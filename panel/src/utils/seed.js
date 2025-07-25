import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const { SUPER_EMAIL, SUPER_PASSWORD } = process.env;
  const superHash = await bcrypt.hash(SUPER_PASSWORD, 10);

  await prisma.users.upsert({
    where: { email: SUPER_EMAIL },
    create: {
      email: SUPER_EMAIL,
      password: superHash,
      name: "Owner",
      role: "SUPER_ADMIN",
    },
    update: {}
  });

  const tenant1 = await prisma.tenants.upsert({
    where: { slug: "empresa1" },
    create: { name: "Empresa 1", slug: "empresa1" },
    update: {}
  });
  const tenant2 = await prisma.tenants.upsert({
    where: { slug: "empresa2" },
    create: { name: "Empresa 2", slug: "empresa2" },
    update: {}
  });

  const adminHash = await bcrypt.hash("admin123", 10);

  await prisma.users.upsert({
    where: { email: "admin@empresa1.com" },
    create: {
      email: "admin@empresa1.com",
      password: adminHash,
      name: "Admin Empresa1",
      role: "TENANT_ADMIN",
      tenantId: tenant1.id
    },
    update: {}
  });

  await prisma.users.upsert({
    where: { email: "admin@empresa2.com" },
    create: {
      email: "admin@empresa2.com",
      password: adminHash,
      name: "Admin Empresa2",
      role: "TENANT_ADMIN",
      tenantId: tenant2.id
    },
    update: {}
  });

  for (const tenant of [tenant1, tenant2]) {
    for (let i = 1; i <= 10; i++) {
      await prisma.$executeRaw`INSERT INTO menus (tenantId, opcion_num, label, response) VALUES (${tenant.id}, ${i}, ${`Opcion ${i}`}, ${`Respuesta ${i}`}) ON DUPLICATE KEY UPDATE label=VALUES(label), response=VALUES(response)`;
    }
  }

  console.log("Seed completed");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
