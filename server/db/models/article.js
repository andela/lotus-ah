const article = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'User',
        key: 'id'
      }
    }
  },
  { tableName: 'articles' });

  Article.associate = (models) => {
    // associations can be defined here
    Article.belongsTo(models.User, {
      as: 'users',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Article.hasMany(models.Comment, {
      foreignKey: 'articleId',
      as: 'comments'
    });
    Article.belongsToMany(models.Tag, {
      through: 'articleTag',
    });
    Article.hasMany(models.FavoriteArticle, {
      foreignKey: 'articleId',
      as: 'favourite'
    });
  };
  return Article;
};
export default article;
