const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Изменяем маршруты
router.get('/categories/:categoryId/products', productsController.getProductsByCategoryId);
router.post('/categories/:categoryId/products', productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

module.exports = router;