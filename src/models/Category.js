module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cost: {
      type: DataTypes.STRING, // Изменено с DECIMAL/INTEGER на STRING
      allowNull: false
    },
    typeCostFirst: {
      type: DataTypes.STRING,
      allowNull: false
    },
    typeCostSecond: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      as: 'products',
      foreignKey: 'categoryId',
      onDelete: 'CASCADE' // Добавляем каскадное удаление
    });
  };

  return Category;
};