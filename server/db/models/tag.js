
const tag = (sequelize, DataTypes) => {
  const Tag = sequelize.define('tag', {
    name: {
      type: DataTypes.STRING
    }
  });
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Article, {
      as: 'tagArticle',
      through: 'articleTag',
    });
  };
  return Tag;
};
export default tag;
