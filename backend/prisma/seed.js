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
  console.log('Starting to seed default categories...');

  // 1. Find all existing default categories
  const existingDefaults = await prisma.category.findMany({
    where: {
      userId: null,
    },
    select: {
      name: true,
    },
  });

  const existingDefaultNames = new Set(existingDefaults.map((cat) => cat.name));

  // 2. Determine which categories are new and need to be created
  const newCategoriesToCreate = defaultCategories
    .filter((name) => !existingDefaultNames.has(name))
    .map((name) => ({ name: name, userId: null }));

  // 3. Create only the new categories
  if (newCategoriesToCreate.length > 0) {
    await prisma.category.createMany({
      data: newCategoriesToCreate,
    });
    console.log(
      `Successfully created ${newCategoriesToCreate.length} new default categories.`
    );
  } else {
    console.log('All default categories already exist. No action taken.');
  }
}

main()
  .catch((error) => {
    console.error('Error seeding default categories:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
