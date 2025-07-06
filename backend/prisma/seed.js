const prisma = require('../src/config/prisma');

const defaultCategories = [
  // Income
  'Salary',
  'Other Income',

  // Essential Expenses
  'Housing',
  'Groceries',
  'Utilities',
  'Transport',
  'Health',

  // Forward-Looking
  'Subscriptions',
  'Savings',
];

async function main() {
  // Delete existing default categories
  await prisma.category.deleteMany({
    where: {
      name: {
        in: defaultCategories,
      },
      userId: null,
    },
  });

  // Create default categories
  await prisma.category.createMany({
    data: defaultCategories.map((name) => ({ name })),
  });
  console.log('Default categories created successfully.');
}

main()
  .catch((error) => {
    console.error('Error creating default categories:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
