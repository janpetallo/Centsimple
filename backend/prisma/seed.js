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
];

async function main() {
  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: {
        name_userId: {
          name: name,
          userId: null,
        },
      },
      update: {},
      create: { name: name, userId: null },
    });
  }
  console.log('Default categories created or updated successfully.');
}

main()
  .catch((error) => {
    console.error('Error creating or updating default categories:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
