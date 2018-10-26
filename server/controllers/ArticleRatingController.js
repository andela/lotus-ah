import Sequelize from 'sequelize';
import { Article, Rating } from '../db/models';
import NotificationController from './NotificationController';
import auth from '../middlewares/TokenVerification';


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
    const authenticatedUser = req.authUser;
    const articele = req.articleObject.dataValues;
    const { author } = req;
    const { rating } = req.body;
    const articleId = articele.id;

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
          .addRatingToArticle(articleId, rating, authenticatedUser, author);
        res.status(201)
          .json({
            status: 'Success',
            message: 'Your rating has been recorded'
          });
      }
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
 * @description get average rating
 * @param {integer} articleId
 * @param {intger} rating
 * @param {object} authenticatedUser
 * @param {object} author
 * @returns {object} object
 * @member ArticleRatingCointroller
 */
  static addRatingToArticle(articleId, rating, authenticatedUser, author) {
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
      .then((articele) => {
        const notify = {
          type: 'like',
          articleId,
          rating,
          message: `new rating has been added to your article ${articele.title}`,
          user: authenticatedUser,
          messageForAuthor: `Hey ${auth.firstname}, ${authenticatedUser.firstname} rated your article
          ${articele.title}
          `,
          author,
        };
        NotificationController.notifyFollowers(
          {
            followerType: 'article',
            notify,
          }
        );
      })
      .catch(error => error);
  }
}

export default ArticleRatingCointroller;
