
const tag = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING
    }
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
