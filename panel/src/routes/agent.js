import { Router } from "express";
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import { ensureRoles } from "../middlewares/auth.js";

const prisma = new PrismaClient();
const router = Router();

router.use(ensureRoles(["AGENT"]));

function parseRange(req) {
  const from = req.query.from || dayjs().subtract(7, "day").format("YYYY-MM-DD");
  const to = req.query.to || dayjs().format("YYYY-MM-DD");
  return { from, to };
}

router.get("/conversations", async (req, res) => {
  const { from, to } = parseRange(req);
  const userFilter = req.query.user || undefined;
  const intent = req.query.intent || undefined;
  const fallback = req.query.fallback === "1" ? 1 : undefined;
  const tenant = await prisma.tenants.findUnique({ where: { id: req.user.tenantId } });
  if (!tenant) return res.status(403).send("Forbidden");

  const where = {
    tenantSlug: tenant.slug,
    createdAt: { gte: new Date(from + " 00:00:00"), lte: new Date(to + " 23:59:59") },
  };
  if (userFilter) where.username = userFilter;

  let conversations = await prisma.conversations.findMany({ where, orderBy: { createdAt: "desc" } });

  if (intent || fallback) {
    const ids = await prisma.$queryRaw`
      SELECT DISTINCT c.id FROM conversations c
      JOIN interactions i ON i.tenantSlug = c.tenantSlug AND i.username = c.username
      WHERE c.tenantSlug = ${tenant.slug}
        AND c.createdAt BETWEEN ${new Date(from + " 00:00:00")} AND ${new Date(to + " 23:59:59")}
        ${userFilter ? prisma.raw(`AND c.username = '${userFilter}'`) : prisma.raw('')}
        ${intent ? prisma.raw(`AND i.intent = '${intent}'`) : prisma.raw('')}
        ${fallback ? prisma.raw('AND i.isFallback = 1') : prisma.raw('')}`;
    const idList = ids.map(r => r.id);
    conversations = conversations.filter(c => idList.includes(c.id));
  }

  res.render("agent/conversations", { title: "Conversaciones", conversations, from, to, filters: { user: userFilter, intent, fallback: req.query.fallback } });
});

router.get("/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const conversation = await prisma.conversations.findUnique({ where: { id } });
  if (!conversation) return res.status(404).send("Not found");
  const tenant = await prisma.tenants.findUnique({ where: { id: req.user.tenantId } });
  if (!tenant || conversation.tenantSlug !== tenant.slug) return res.status(403).send("Forbidden");

  const messages = await prisma.interactions.findMany({
    where: {
      tenantSlug: conversation.tenantSlug,
      username: conversation.username,
      timestamp: { gte: conversation.createdAt },
    },
    orderBy: { timestamp: "asc" },
  });

  res.render("agent/conversation_detail", { title: "Conversación", conversation, messages });
});

router.post("/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { notes, status, requiresFollowup, resolvedByHuman } = req.body;
  await prisma.conversations.update({
    where: { id },
    data: {
      notes,
      status,
      requiresFollowup: requiresFollowup ? true : false,
      resolvedByHuman: resolvedByHuman ? true : false,
    },
  });
  res.redirect(`/agent/conversations/${id}`);
});

router.get("/followup", async (req, res) => {
  const tenant = await prisma.tenants.findUnique({ where: { id: req.user.tenantId } });
  if (!tenant) return res.status(403).send("Forbidden");
  const conversations = await prisma.conversations.findMany({
    where: { tenantSlug: tenant.slug, requiresFollowup: true },
    orderBy: { createdAt: "desc" },
  });
  res.render("agent/followup", { title: "Seguimiento", conversations });
});

router.get("/menus", async (req, res) => {
  const tenant = await prisma.tenants.findUnique({ where: { id: req.user.tenantId } });
  if (!tenant) return res.status(403).send("Forbidden");
  const menus = await prisma.menus.findMany({ where: { tenantId: tenant.id }, orderBy: { opcion_num: "asc" } });
  res.render("agent/menus", { title: "Menús", menus, tenant });
});

export default router;
