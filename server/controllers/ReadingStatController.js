import {
  Article,
  ReadingStat
} from '../db/models';
/**
 * @class ReadingStatController
 */
class ReadingStatController {
  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @return {object} result
   * @memberof ReadingStatController
   */
  static recordReadingStat(request, response) {
    const { userId, articleId } = response.stat;
    ReadingStat.findOne({
      where: {
        userId,
        articleId
      },
    })
      .then((stat) => {
        if (!stat) {
          ReadingStat.create({ articleId, userId })
            .then(() => response.status(201)
              .json({
                status: 'success',
                message: 'reading statistics has been recorded'
              }))
            .catch(err => err.message);
        }
      });
  }

  /**
 * @static
 * @param {object} request
 * @param {object} response
 * @return {object} result
 * @memberof ReadingStatController
 */
  static getReadingStat(request, response) {
    const userId = request.decoded.id;
    ReadingStat.findAndCountAll({
      where: { userId },
      attributes: ['articleId'],
      include: [
        {
          model: Article,
          as: 'article',
          attributes: ['id', 'slug', 'title', 'description']
        }
      ]
    })
      .then((articles) => {
        if (!articles || articles.count === 0) {
          return response.status(404)
            .json({
              status: 'failed',
              message: 'You recorded statistics available'
            });
        }
        response.status(200)
          .json({
            status: 'success',
            message: 'Your reading statistics',
            articles,
          });
      })
      .catch(err => err.message);
  }
}
export default ReadingStatController;
