const { Category, Product } = require('../config/database');

const categoriesController = {
  async getCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.json({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Error fetching categories' });
    }
  },

  async createCategory(req, res) {
    try {
      const { name, cost, typeCostFirst, typeCostSecond, imageUrl } = req.body;
      
      // Проверяем наличие обязательных полей
      if (!name || !cost || !typeCostFirst || !typeCostSecond) {
        return res.status(400).json({ 
          message: 'All fields are required' 
        });
      }

      const category = await Category.create({
        name,
        cost,
        typeCostFirst,
        typeCostSecond,
        imageUrl
      });

      res.status(201).json({ category });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ 
        message: 'Error creating category', 
        error: error.message 
      });
    }
  },

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, cost, typeCostFirst, typeCostSecond, imageUrl } = req.body;
      
      const category = await Category.findByPk(id);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      await category.update({
        name,
        cost,
        typeCostFirst,
        typeCostSecond,
        imageUrl
      });
  
      res.json({ category });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Error updating category', error: error.message });
    }
  },

  // controllers/categoriesController.js
async deleteCategory(req, res) {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete category with ID: ${id}`); // Логирование ID категории

    // Находим категорию
    const category = await Category.findByPk(id);

    if (!category) {
      console.log('Category not found'); // Логирование, если категория не найдена
      return res.status(404).json({ error: 'Category not found' });
    }

    // Удаляем все связанные продукты
    const deletedProductsCount = await Product.destroy({
      where: { categoryId: id },
    });
    console.log(`Deleted ${deletedProductsCount} products related to category ID: ${id}`); // Логирование количества удалённых продуктов

    // Удаляем саму категорию
    await category.destroy();
    console.log(`Successfully deleted category ID: ${id}`); // Логирование успешного удаления категории

    res.status(200).json({ message: 'Category and related products deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
};

module.exports = categoriesController;
