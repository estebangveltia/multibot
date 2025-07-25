import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const { SUPER_EMAIL, SUPER_PASSWORD } = process.env;
  const superHash = await bcrypt.hash(SUPER_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: SUPER_EMAIL },
    create: {
      email: SUPER_EMAIL,
      password: superHash,
      name: "Owner",
      role: "SUPER_ADMIN",
    },
    update: {}
  });

  const tenant = await prisma.tenants.upsert({
    where: { slug: "empresa1" },
    create: { name: "Empresa 1", slug: "empresa1" },
    update: {}
  });

  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@empresa1.com" },
    create: {
      email: "admin@empresa1.com",
      password: adminHash,
      name: "Admin Empresa1",
      role: "TENANT_ADMIN",
      tenantId: tenant.id
    },
    update: {}
  });

  console.log("Seed completed");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
