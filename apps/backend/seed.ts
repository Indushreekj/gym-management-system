import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding plans...');
  
  await prisma.membershipPlan.createMany({
    data: [
      { name: 'Monthly Standard', price: 29.99, durationDays: 30 },
      { name: 'Quarterly Pro', price: 79.99, durationDays: 90 },
      { name: 'Yearly Elite', price: 299.99, durationDays: 365 },
    ],
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
