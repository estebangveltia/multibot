import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function aggregateDay(dateStr) {
  const dayStart = new Date(dateStr + "T00:00:00.000Z");
  const dayEnd = new Date(dateStr + "T23:59:59.999Z");

  const tenants = await prisma.tenants.findMany({ select: { slug: true } });

  for (const t of tenants) {
    const interactions = await prisma.interactions.findMany({
      where: {
        tenantSlug: t.slug,
        timestamp: { gte: dayStart, lte: dayEnd },
      },
      select: { username: true, response: true },
    });

    const messages = interactions.length;
    const usersSet = new Set(interactions.map(i => i.username));
    const users = usersSet.size;
    const conversations = users; // aproximación
    const fallbacks = interactions.filter(i =>
      (i.response || "").match(/Opción no válida|Por favor, indique el número/i)
    ).length;
    const avgPerConv = conversations > 0 ? messages / conversations : 0;

    await prisma.metricsdaily.upsert({
      where: { day_tenantSlug_botId: { day: new Date(dateStr), tenantSlug: t.slug, botId: null } },
      create: {
        day: new Date(dateStr),
        tenantSlug: t.slug,
        botId: null,
        conversations,
        users,
        messages,
        fallbacks,
        avgPerConv,
      },
      update: {
        conversations,
        users,
        messages,
        fallbacks,
        avgPerConv,
      }
    });
  }
}
