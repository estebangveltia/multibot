import { Router } from "express";
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import { ensureRoles } from "../middlewares/auth.js";

const prisma = new PrismaClient();
const router = Router();

router.use(ensureRoles(["SUPER_ADMIN"]));

function parseRange(req) {
  const from = req.query.from || dayjs().subtract(7, "day").format("YYYY-MM-DD");
  const to = req.query.to || dayjs().format("YYYY-MM-DD");
  return { from, to };
}

router.get("/dashboard", async (req, res) => {
  const { from, to } = parseRange(req);
  const rows = await prisma.metricsDaily.findMany({
    where: { day: { gte: new Date(from), lte: new Date(to) } },
    orderBy: { day: "asc" },
  });
  const tenants = await prisma.tenant.findMany({ orderBy: { id: "asc" } });

  const kpis = rows.reduce((acc, r) => {
    acc.conversations += r.conversations;
    acc.users += r.users;
    acc.messages += r.messages;
    acc.fallbacks += r.fallbacks;
    acc.avg_acc += r.avgPerConv;
    acc.count += 1;
    return acc;
  }, { conversations: 0, users: 0, messages: 0, fallbacks: 0, avg_acc: 0, count: 0 });
  const avg_per_conv = kpis.count ? (kpis.avg_acc / kpis.count) : 0;

  res.render("super/dashboard", {
    title: "Super Dashboard",
    rows,
    from,
    to,
    kpis: { ...kpis, avg_per_conv },
    tenants
  });
});

router.get("/tenants", async (req, res) => {
  const tenants = await prisma.tenant.findMany({
    include: { users: true, bots: true },
    orderBy: { id: "asc" }
  });
  res.render("super/tenants", { title: "Tenants", tenants });
});

router.get("/tenants/new", (req, res) => {
  res.render("super/tenant_new", { title: "Nuevo Tenant" });
});

router.post("/tenants", async (req, res) => {
  const { name, slug } = req.body;
  await prisma.tenant.create({ data: { name, slug } });
  res.redirect("/super/tenants");
});

router.get("/tenants/:id/dashboard", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { from, to } = parseRange(req);
  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) return res.status(404).send("Tenant not found");

  const rows = await prisma.metricsDaily.findMany({
    where: {
      tenantSlug: tenant.slug,
      day: { gte: new Date(from), lte: new Date(to) },
    },
    orderBy: { day: "asc" },
  });

  const kpis = rows.reduce((acc, r) => {
    acc.conversations += r.conversations;
    acc.users += r.users;
    acc.messages += r.messages;
    acc.fallbacks += r.fallbacks;
    acc.avg_acc += r.avgPerConv;
    acc.count += 1;
    return acc;
  }, { conversations: 0, users: 0, messages: 0, fallbacks: 0, avg_acc: 0, count: 0 });
  const avg_per_conv = kpis.count ? (kpis.avg_acc / kpis.count) : 0;

  const topMenu = await prisma.$queryRawUnsafe(`
    SELECT menuOption as menu_option, COUNT(*) as count
    FROM interactions
    WHERE tenantSlug = '${tenant.slug}'
      AND timestamp BETWEEN '${from} 00:00:00' AND '${to} 23:59:59'
      AND menuOption IS NOT NULL
    GROUP BY menuOption
    ORDER BY count DESC
    LIMIT 10
  `);

  res.render("super/tenant_dashboard", {
    title: `Dashboard - ${tenant.name}`,
    tenant,
    rows,
    from,
    to,
    kpis: { ...kpis, avg_per_conv },
    topMenu
  });
});

export default router;
