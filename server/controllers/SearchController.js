// moduler importations
import Sequelize from 'sequelize';
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
  static searchArticleByKeyword(request, response) {
    let { keyword } = request.params;
    keyword = keyword.toLowerCase();
    Article.findAll({
      where: {
        $or: [
          {
            title: Sequelize.where(Sequelize.fn('lower', Sequelize.col('title')),
              { like: `%${keyword}%` })
          },
          {
            description: Sequelize.where(Sequelize.fn('lower', Sequelize.col('title')),
              { like: `%${keyword}%` })
          },
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('title'))),
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('description')))
        ]
      },
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'username', 'email', 'bio', 'imageUrl'],
      }],
      attributes: ['id', 'slug', 'title', 'description', 'userId', 'imageUrl', 'rating']
    })
      .then((article) => {
        if (!article || article.length === 0) {
          return response.status(404)
            .json({
              status: 'failed',
              message: 'We could not find any article'
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
   * @memberof TagController
   * @returns {object} json
   */
  static searchArticleByTagName(request, response) {
    let { name } = request.params;
    name = name.toLowerCase();
    return Tag.findAll({
      where: {
        $or: [
          {
            name: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')),
              { like: `%${name}%` })
          },
        ]
      },
      include: [{
        model: Article,
        as: 'Articles',
        attributes: [
          'id',
          'userId',
          'title',
          'body',
          'slug',
          'description',
          'rating',
          'imageUrl',
        ],
        through: {
          attributes: [],
        },
        include: [{
          model: User,
          as: 'users',
          attributes: ['id', 'username', 'email', 'bio', 'imageUrl'],
        }]
      },
      ]
    })
      .then((tag) => {
        if (!tag || tag.length === 0) {
          return response.status(404)
            .json({
              status: 'failed',
              message: 'Tag name provided does not exist'
            });
        }
        return response.status(200)
          .json({
            status: 'success',
            message: 'Tags with associated articles successfully obtained',
            tag
          });
      })
      .catch(err => response.status(500).json({
        status: 'FAILED',
        message: 'Error processing request, please try again',
        Error: err.toString()
      }));
  }

  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @memberof SearchController
   * @returns {object} json
   */
  static searchArticleByAuthor(request, response) {
    let { author } = request.params;
    author = author.toLowerCase();
    return User.findAll({
      where: {
        $or: [
          {
            firstname: Sequelize.where(Sequelize.fn('lower', Sequelize.col('firstname')),
              { like: `%${author}%` })
          },
          {
            lastname: Sequelize.where(Sequelize.fn('lower', Sequelize.col('lastname')),
              { like: `%${author}%` })
          },
          {
            username: Sequelize.where(Sequelize.fn('lower', Sequelize.col('username')),
              { like: `%${author}%` })
          },
        ]
      },
      include: [{
        model: Article,
        as: 'Articles',
        attributes: [
          'id',
          'userId',
          'title',
          'body',
          'description',
          'rating',
          'imageUrl',
          'slug'
        ],
      }],
      attributes: ['id', 'firstname', 'lastname', 'username', 'imageUrl', 'email']
    })
      .then((authors) => {
        if (!authors || authors.length === 0) {
          return response.status(404)
            .json({
              status: 'failed',
              message: 'We could not find any article'
            });
        }
        response.status(200)
          .json({
            status: 'success',
            message: 'All articles available',
            authors
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
