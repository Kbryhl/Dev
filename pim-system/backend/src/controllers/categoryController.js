const { v4: uuidv4 } = require('uuid');
const { runAsync, getAsync, allAsync } = require('../database/db');

const getAllCategories = async (req, res) => {
  try {
    const categories = await allAsync('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get categories', details: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const id = uuidv4();

    await runAsync(
      'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
      [id, name, description]
    );

    res.status(201).json({ message: 'Category created', categoryId: id });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    res.status(500).json({ error: 'Failed to create category', details: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    await runAsync(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );

    res.json({ message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category', details: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await runAsync('DELETE FROM categories WHERE id = ?', [id]);

    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category', details: err.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
