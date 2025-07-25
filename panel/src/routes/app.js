import { Router } from "express";
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import { ensureRoles } from "../middlewares/auth.js";

const prisma = new PrismaClient();
const router = Router();

router.use(ensureRoles(["TENANT_ADMIN", "ANALYST", "AGENT", "VIEWER", "SUPER_ADMIN"]));

function parseRange(req) {
  const from = req.query.from || dayjs().subtract(7, "day").format("YYYY-MM-DD");
  const to = req.query.to || dayjs().format("YYYY-MM-DD");
  return { from, to };
}

router.get("/dashboard", async (req, res) => {
  const user = req.user;
  const tenant = user.tenantId ? await prisma.tenants.findUnique({ where: { id: user.tenantId } }) : null;
  const slug = tenant ? tenant.slug : null;
  const { from, to } = parseRange(req);

  const rows = await prisma.metricsdaily.findMany({
    where: slug
      ? {
          tenantSlug: slug,
          day: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }
      : {
          day: {
            gte: new Date(from),
            lte: new Date(to),
          },
        },
    orderBy: { day: "asc" },
  });

  const kpis = rows.reduce(
    (acc, r) => {
      acc.conversations += r.conversations;
      acc.users += r.users;
      acc.messages += r.messages;
      acc.fallbacks += r.fallbacks;
      acc.avg_acc += r.avgPerConv;
      acc.count += 1;
      return acc;
    },
    { conversations: 0, users: 0, messages: 0, fallbacks: 0, avg_acc: 0, count: 0 }
  );

  const avg_per_conv = kpis.count ? kpis.avg_acc / kpis.count : 0;

  res.render("app/dashboard", {
    title: "Dashboard",
    rows,
    from,
    to,
    kpis: { ...kpis, avg_per_conv },
    tenant,
  });
});

router.get("/menus", async (req, res) => {
  const user = req.user;
  const tenant = user.tenantId ? await prisma.tenants.findUnique({ where: { id: user.tenantId } }) : null;
  if (!tenant && user.role !== "SUPER_ADMIN") return res.status(403).send("Forbidden");

  const menus = await prisma.menus.findMany({
    where: tenant ? { tenantId: tenant.id } : undefined,
    orderBy: { opcion_num: "asc" },
  });

  res.render("app/menus", { title: "Menús", tenant, menus });
});

router.get("/menus/new", ensureRoles(["TENANT_ADMIN", "SUPER_ADMIN"]), async (req, res) => {
  const user = req.user;
  const tenant = user.tenantId ? await prisma.tenants.findUnique({ where: { id: user.tenantId } }) : null;
  if (!tenant && user.role !== "SUPER_ADMIN") return res.status(403).send("Forbidden");

  res.render("app/menu_new", { title: "Nueva opción", tenant });
});

router.post("/menus", ensureRoles(["TENANT_ADMIN", "SUPER_ADMIN"]), async (req, res) => {
  const user = req.user;
  const tenant = user.tenantId ? await prisma.tenants.findUnique({ where: { id: user.tenantId } }) : null;
  if (!tenant && user.role !== "SUPER_ADMIN") return res.status(403).send("Forbidden");

  const { opcion_num, label, response } = req.body;

  await prisma.menus.create({
    data: {
      tenantId: tenant.id,
      opcion_num: parseInt(opcion_num, 10),
      label,
      response,
    },
  });

  res.redirect("/app/menus");
});

export default router;
