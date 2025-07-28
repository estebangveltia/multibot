import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import flash from "connect-flash";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import superRoutes from "./routes/super.js";
import appRoutes from "./routes/app.js";
import { injectUser, ensureAuthenticated } from "./middlewares/auth.js";
import { registerDailyCron } from "./cron/index.js";
dotenv.config();
const prisma = new PrismaClient();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8090;
const SESSION_SECRET = process.env.SESSION_SECRET || "dev_secret";
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(expressLayouts);
app.set("layout", "partials/layout");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(injectUser);
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/", authRoutes);
app.use("/super", ensureAuthenticated, superRoutes);
app.use("/app", ensureAuthenticated, appRoutes);
app.get("/", (req, res) => {
    if (!req.user)
        return res.redirect("/login");
    if (req.user.role === "SUPER_ADMIN")
        return res.redirect("/super/dashboard");
    return res.redirect("/app/dashboard");
});
registerDailyCron();
app.listen(PORT, () => {
    console.log(`Panel running on http://0.0.0.0:${PORT}`);
});
