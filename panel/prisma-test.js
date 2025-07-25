import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.users.findMany()
  console.log('Usuarios encontrados:', users)
}

main().catch(console.error).finally(() => prisma.$disconnect())
