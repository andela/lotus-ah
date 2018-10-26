import { Article, User } from '../db/models';

// Method to fetch an article with the user
const getArticle = (request, response, next) => {
  Article.findOne({
    include: [{
      model: User,
      as: 'users',
      attributes: [
        'id',
        'email',
        'firstname',
        'lastname',
        'bio',
        'username',
        'imageUrl'
      ]
    }],
    attributes: ['id', 'title', 'body', 'slug', 'description', 'isReported'],
    where: {
      slug: request.params.slug
    }
  })
    .then((article) => {
      if (!article) {
        return response.status(404)
          .json({
            status: 'FAILED',
            message: 'Article not found'
          });
      }
      request.articleObject = article;
      next();
    })
    .catch(next);
};

export default getArticle;
