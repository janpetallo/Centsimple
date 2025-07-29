const prisma = require('../config/prisma');
const { validationResult } = require('express-validator');

async function createCategory(req, res) {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify the category name does not already exist
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' }, // The key is mode: 'insensitive'
        OR: [
          { userId: null }, // Is it a default category?
          { userId: userId }, // Or does it belong to this user?
        ],
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        message: `You already have a category named '${existingCategory.name}'.`,
      });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name,
        userId: userId,
      },
    });

    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error) {
    // Prisma's error code for a unique constraint violation for @@unique([name, userId])
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: `You already have a category named '${name}'.`,
      });
    }
    console.error('Error creating a category', error);
    res
      .status(500)
      .json({ message: 'Could not create category. Please try again.' });
  }
}

async function getCategories(req, res) {
  try {
    const userId = req.user.id;

    // STEP 1: Get a list of all category IDs that the user has pinned.
    const pinnedCategories = await prisma.userPinnedCategory.findMany({
      where: {
        userId: userId,
      },
      select: {
        categoryId: true,
      },
    });

    // Create a Set for fast lookups (O(1) complexity).
    const pinnedCategoryIds = new Set(
      pinnedCategories.map((pc) => pc.categoryId)
    );

    // STEP 2: Fetch ALL categories relevant to the user (their own + all defaults).
    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId: userId }, { userId: null }],
      },
    });

    // STEP 3: Sort the categories in JavaScript.
    // Pinned categories will be at the top, followed by unpinned categories.
    // Within each group, categories are sorted alphabetically.
    categories.sort((a, b) => {
      const aIsPinned = pinnedCategoryIds.has(a.id);
      const bIsPinned = pinnedCategoryIds.has(b.id);

      // If one is pinned and the other is not, the pinned one comes first.
      if (aIsPinned !== bIsPinned) {
        return aIsPinned ? -1 : 1;
      }

      // If both are pinned or both are unpinned, sort by name alphabetically.
      return a.name.localeCompare(b.name);
    });

    const pinnedIds = Array.from(pinnedCategoryIds);

    res.status(200).json({
      message: 'Categories fetched successfully.',
      categories: categories,
      pinnedIds: pinnedIds,
    });
  } catch (error) {
    console.error('Error fetching all categories', error);
    res
      .status(500)
      .json({ message: 'Could not load categories. Please try again.' });
  }
}

async function updateCategory(req, res) {
  const categoryId = parseInt(req.params.categoryId, 10);
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify the category to update exists and belongs to the user.
    const categoryToUpdate = await prisma.category.findUnique({
      where: { id: categoryId, userId: userId },
    });

    if (!categoryToUpdate) {
      return res.status(404).json({
        message: 'Category not found or you do not have permission to edit it.',
      });
    }

    // Verify the new category name to update does not already exist
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        NOT: {
          id: categoryId, // Exclude the current category
        },
        // check for conflicts in both default AND user's own categories
        OR: [
          { userId: null }, // Is it a default category?
          { userId: userId }, // Or does it belong to this user?
        ],
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        message: `You already have a category named '${existingCategory.name}'.`,
      });
    }

    // This inherently checks if the category exists AND belongs to the user
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId, userId: userId },
      data: { name: name },
    });

    res.status(200).json({
      message: 'Category updated successfully.',
      category: updatedCategory,
    });
  } catch (error) {
    // Prisma's error code for a unique constraint violation for @@unique([name, userId])
    // Duplicate error
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: `You already have a category named '${name}'.`,
      });
    }
    // Prisma's error code for "record to update not found".
    // This error occurs if the ID doesn't exist OR if the userId doesn't match.
    if (error.code === 'P2025') {
      return res.status(404).json({
        message: 'Category not found or you do not have permission to edit it.',
      });
    }
    console.error('Error updating a category', error);
    res
      .status(500)
      .json({ message: 'Could not update category. Please try again.' });
  }
}

async function deleteCategory(req, res) {
  const categoryId = parseInt(req.params.categoryId, 10);
  const userId = req.user.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // STEP 1: Check if this category is being used by any transactions.
    const transactionCount = await prisma.transaction.count({
      where: {
        categoryId: categoryId,
        userId: userId,
      },
    });

    // STEP 2: If the category is in use, send back a specific error.
    if (transactionCount > 0) {
      return res.status(409).json({
        message: 'This category is in use and cannot be deleted.',
      });
    }

    // STEP 3: If the category is NOT in use, proceed with the deletion.
    // The delete will only happen if the category ID exists AND belongs to the user.
    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId, userId: userId },
    });

    res.status(200).json({
      message: 'Category deleted successfully.',
      category: deletedCategory,
    });
  } catch (error) {
    // Prisma's error code for "record to delete not found".
    if (error.code === 'P2025') {
      return res.status(404).json({
        message:
          'Category not found or you do not have permission to delete it.',
      });
    }
    console.error('Error deleting a category', error);
    res
      .status(500)
      .json({ message: 'Could not delete category. Please try again.' });
  }
}

async function togglePinCategory(req, res) {
  const categoryId = parseInt(req.params.categoryId, 10);
  const userId = req.user.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // STEP 1: Verify the category exists and is accessible to the user (default or their own).
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ userId: userId }, { userId: null }],
      },
    });

    if (!category) {
      return res.status(404).json({
        message: 'Category not found or you do not have permission to pin it.',
      });
    }

    // STEP 2: Check if the pin already exists in the correct table.
    const existingPin = await prisma.userPinnedCategory.findUnique({
      where: {
        userId_categoryId: {
          userId: userId,
          categoryId: categoryId,
        },
      },
    });

    // STEP 3: If the pin exists, delete it to "unpin".
    if (existingPin) {
      await prisma.userPinnedCategory.delete({
        where: {
          userId_categoryId: {
            userId: userId,
            categoryId: categoryId,
          },
        },
      });
      return res.status(200).json({
        message: 'Category unpinned successfully.',
        category: category,
      });
    }

    // STEP 4: If the pin does not exist, create it.
    await prisma.userPinnedCategory.create({
      data: {
        userId: userId,
        categoryId: categoryId,
      },
    });

    return res.status(201).json({
      message: 'Category pinned successfully.',
      category: category,
    });
  } catch (error) {
    console.error('Error toggling pin for a category', error);
    res
      .status(500)
      .json({ message: 'Could not toggle pin. Please try again.' });
  }
}

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  togglePinCategory,
};
