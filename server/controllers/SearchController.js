// moduler importations
import { Tag, Article, User } from '../db/models';

/**
 * @class SearchController
 */
class SearchController {
  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @memberof SearchController
   * @returns {object} json
   */
  static searchTag(request, response) {
    const { name } = request.params;
    Tag.findAll({
      where: {
        $or: [
          {
            name: { like: `%${name}%` }
          }
        ]
      },
    })
      .then((tag) => {
        if (!tag || tag.length === 0) {
          response.status(404)
            .json({
              status: 'failed',
              message: 'Tag name provided does not exist'
            });
        }
        response.status(200)
          .json({
            status: 'success',
            message: 'Tags successfully obtained',
            tag
          });
      })
      .catch(error => error.message);
  }

  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @memberof SearchController
   * @returns {object} json
   */
  static searchArticle(request, response) {
    const { keyword } = request.params;
    Article.findAll({
      where: {
        $or: [
          {
            title: { like: `%${keyword}%` }
          },
          {
            description: { like: `%${keyword}%` }
          }
        ]
      },
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'username', 'email', 'bio', 'imageUrl'],
      }],
      attributes: ['id', 'slug', 'title', 'description', 'userId']
    })
      .then((article) => {
        if (!article || article.length === 0) {
          return response.status(404)
            .json({
              status: 'failed',
              message: 'We couldn’t find any article'
            });
        }
        response.status(200)
          .json({
            status: 'success',
            message: 'All articles available',
            article
          });
      })
      .catch(error => error.message);
  }

  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @param {object} author
   * @memberof SearchController
   * @returns {object} json
   */
  static searchAuthor(request, response) {
    const { author } = request.params;
    User.findAll({
      where: {
        $or: [
          {
            firstname: { like: `%${author}%` }
          },
          {
            lastname: { like: `%${author}%` }
          },
          {
            username: { like: `%${author}%` }
          }
        ]
      },
      attributes: ['id', 'username', 'email', 'bio', 'imageUrl']
    }).then((Authors) => {
      if (!Authors || Authors.length === 0) {
        return response.status(404)
          .json({
            status: 'failed',
            message: 'We could not find the author'
          });
      }
      response.status(200)
        .json({
          status: 'success',
          message: 'All Author available',
          Authors
        });
    })
      .catch(error => error.message);
  }
}
export default SearchController;
