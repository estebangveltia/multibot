import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function injectUser(req, res, next) {
  res.locals.currentUser = null;
  res.locals.flash = req.flash();
  if (req.session && req.session.userId) {
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    if (user) {
      req.user = user;
      res.locals.currentUser = user;
    }
  }
  next();
}

export function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect("/login");
}

export function ensureRoles(roles) {
  return (req, res, next) => {
    if (!req.user) return res.redirect("/login");
    if (!roles.includes(req.user.role)) return res.status(403).send("Forbidden");
    next();
  };
}
