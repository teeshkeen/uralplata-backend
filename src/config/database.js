const Sequelize = require('sequelize');
const config = require('./default');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log // Добавьте это для отладки SQL-запросов
});

// Проверка подключения
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const initializeModels = async () => {
    try {
      await sequelize.sync({ force: false });
      console.log('Models synchronized successfully');
    } catch (error) {
      console.error('Error synchronizing models:', error);
      throw error;
    }
  };
  
  initializeModels();

const Category = require('../models/Category')(sequelize, Sequelize.DataTypes);
const Product = require('../models/Product')(sequelize, Sequelize.DataTypes);
const User = require('../models/User')(sequelize, Sequelize.DataTypes);

// Определение связей
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = {
  sequelize,
  Category,
  Product,
  User
};