
const tag = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'tags'
  });
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Article, {
      through: 'ArticleTag',
      foreignKey: 'tagId',
      as: 'Articles',
    });
  };
  return Tag;
};
export default tag;
