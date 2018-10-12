
const tag = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'tag'
  });
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Article, {
      as: 'tagArticle',
      through: 'ArticleTag',
    });
  };
  return Tag;
};
export default tag;
