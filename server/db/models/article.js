const article = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true

    },

  });

  Article.associate = (models) => {
    // associations can be defined here
    Article.belongsTo(models.User, {
      foriegnKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Article;
};
export default article;
