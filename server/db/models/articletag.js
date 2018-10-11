const articletag = (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, { tableName: 'article_tags' });
  ArticleTag.associate = (models) => {
    ArticleTag.belongsTo(models.Article, {
      foreignKey: 'articleId'
    });
    ArticleTag.belongsTo(models.Tag, {
      foreignKey: 'tagId'
    });
  };
  return ArticleTag;
};

export default articletag;
