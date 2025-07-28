import { Router } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();
router.get("/login", (req, res) => {
    res.render("auth/login", { title: "Login" });
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        req.flash("error", "Credenciales inválidas");
        return res.redirect("/login");
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        req.flash("error", "Credenciales inválidas");
        return res.redirect("/login");
    }
    req.session.userId = user.id;
    if (user.role === "SUPER_ADMIN")
        return res.redirect("/super/dashboard");
    return res.redirect("/app/dashboard");
});
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});
export default router;
