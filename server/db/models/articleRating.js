const rating = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    rating: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    articleId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'articles',
        key: 'id'
      }
    }
  }, { tableName: 'ratings' });
  Rating.associate = (models) => {
    Rating.belongsTo(models.User, {
      foriegnKey: 'userId',
      onDelete: 'CASCADE'
    });

    Rating.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Rating;
};

export default rating;
