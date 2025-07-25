import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = await prisma.users.create({
    data: {
      email: 'admin@demo.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Usuario creado:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
