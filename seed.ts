import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.plan.createMany({
    data: [
      {
        name: 'Plan Básico',
        price: 19,
        maxStorage: 1024,
        maxExecutions: 200,
      },
      {
        name: 'Plan Pro',
        price: 49,
        maxStorage: 10240,
        maxExecutions: 1000,
      },
    ],
  });

  console.log(`Insertados ${result.count} planes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
