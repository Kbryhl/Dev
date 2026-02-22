const { v4: uuidv4 } = require('uuid');
const { runAsync, getAsync, allAsync } = require('../database/db');

const getAllProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    let params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR sku LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += ' AND category_id = ?';
      params.push(category);
    }

    // Count total
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count');
    const { count } = await getAsync(countSql, params);
    const total = count;

    // Pagination
    const offset = (page - 1) * limit;
    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const products = await allAsync(sql, params);

    // Get specs for each product
    for (let product of products) {
      const specs = await allAsync(
        'SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?',
        [product.id]
      );
      product.specs = specs.reduce((acc, spec) => {
        acc[spec.spec_key] = spec.spec_value;
        return acc;
      }, {});
    }

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get products', details: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await getAsync('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const specs = await allAsync(
      'SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?',
      [product.id]
    );
    product.specs = specs.reduce((acc, spec) => {
      acc[spec.spec_key] = spec.spec_value;
      return acc;
    }, {});

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get product', details: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      description,
      category_id,
      price,
      startup_price,
      weight,
      best_before_date,
      image_url,
      specs
    } = req.body;

    if (!sku || !name) {
      return res.status(400).json({ error: 'SKU and name are required' });
    }

    const id = uuidv4();
    const created_by = req.user.id;

    await runAsync(
      `INSERT INTO products 
       (id, sku, name, description, category_id, price, startup_price, weight, best_before_date, image_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, sku, name, description, category_id, price, startup_price, weight, best_before_date, image_url, created_by]
    );

    // Add specs
    if (specs && typeof specs === 'object') {
      for (const [key, value] of Object.entries(specs)) {
        const specId = uuidv4();
        await runAsync(
          'INSERT INTO product_specs (id, product_id, spec_key, spec_value) VALUES (?, ?, ?, ?)',
          [specId, id, key, value]
        );
      }
    }

    res.status(201).json({ message: 'Product created', productId: id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { specs, ...productData } = updates;

    // Build update query
    const fields = Object.keys(productData).filter(key => !['id', 'created_at'].includes(key));
    const values = fields.map(field => productData[field]);
    values.push(id);

    if (fields.length > 0) {
      const updateSql = `UPDATE products SET ${fields.map(f => `${f} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      await runAsync(updateSql, values);
    }

    // Update specs
    if (specs && typeof specs === 'object') {
      for (const [key, value] of Object.entries(specs)) {
        const existing = await getAsync(
          'SELECT id FROM product_specs WHERE product_id = ? AND spec_key = ?',
          [id, key]
        );

        if (existing) {
          await runAsync(
            'UPDATE product_specs SET spec_value = ? WHERE product_id = ? AND spec_key = ?',
            [value, id, key]
          );
        } else {
          const specId = uuidv4();
          await runAsync(
            'INSERT INTO product_specs (id, product_id, spec_key, spec_value) VALUES (?, ?, ?, ?)',
            [specId, id, key, value]
          );
        }
      }
    }

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await runAsync('DELETE FROM products WHERE id = ?', [id]);
    
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
