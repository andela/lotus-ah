import Sequelize from 'sequelize';
import { Article, Rating } from '../db/models';

/**
 * @class ArticleRatingCointroller
 * @description Rates an article
 */
class ArticleRatingCointroller {
  /**
   *@description addRating to article
    * @param {object} req
    * @param {object} res
    * @param {function} next
    * @returns {object} response
    */
  static addRating(req, res) {
    const userId = req.decoded.id;
    const { slug } = req.params;
    const { rating } = req.body;
    Article.findOne({
      where: {
        slug
      }
    }).then((article) => {
      if (article === null) {
        return res.status(404)
          .json({
            status: 'Success',
            message: 'Article not found'
          });
      }
      const articleId = article.dataValues.id;
      return Rating.findOrCreate({
        where: { userId, articleId },
        attributes: [
          'rating'
        ],
        defaults: {
          rating,
        }
      }).then((ratings) => {
        if (ratings) {
          ArticleRatingCointroller
            .addRatingToArticle(articleId);
          res.status(201)
            .json({
              status: 'Success',
              message: 'Your rating has been recorded'
            });
        }
      });
    })
      .catch(err => res.status(500)
        .json({
          status: 'Success',
          message: 'Problem adding rating to article',
          err: err.message.toString()
        }));
  }

  /**
 * @static
 * @param {integer} articleId
 * @param {intger} userId
 * @description get average rating
 * @returns {object} object
 */
  static addRatingToArticle(articleId) {
    return Rating.findAll({
      where: { articleId },
      attributes: [
        [Sequelize.fn('avg', Sequelize.col('rating')), 'rating'],
        [Sequelize.fn('count', '*'), 'count']
      ],
    }).then((result) => {
      const articleRating = parseInt(result[0].dataValues.rating, 10);
      Article.update({
        rating: articleRating,
      },
      {
        where: { id: articleId }
      });
    })
      .catch(error => error);
  }
}

export default ArticleRatingCointroller;
