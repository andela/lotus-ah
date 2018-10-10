import slug from 'slug';
import uuid from 'uuid';

import { Article } from '../db/models';
import NotificationController from '../controllers/NotificationController';

const userId = 1;

/**
 * @class ArticleController
 * @desc This is a class controller
 * that handles all operations related to Articles.
 */
class ArticleFixture {
  /**
   *@description Add a new Article to the Article list
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} json
   * @memberof ArticleController
   */
  static createArticle(req, res) {
    const {
      title,
      description,
      body
    } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path;
    }

    Article.create({
      userId,
      title,
      slug: `${slug(title)}-${uuid()}`,
      rating: null,
      description,
      body,
      imageUrl
    })
      .then(createdArticle => NotificationController
        .createNotification(req, res, 'publish', createdArticle))
      .catch(err => res.status(500).json({
        message: 'Error processing request, please try again',
        Error: err.toString(),
      }));
  }

  /**
   * @description Modify an Article in the Article's list
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} json
   * @memberof ArticleController
   */
  static updateArticle(req, res) {
    const {
        title,
        description,
        body
      } = req.body,
      id = req.params.articleId,
      imageUrl = null;

    if (!(Number.isInteger(id)) && !Number(id)) {
      return res.status(400).json({
        message: 'Article ID must be a number',
      });
    }

    Article.findOne({
      where: {
        id,
        userId
      },
      attributes: ['userId']
    })
      .then((foundArticle) => {
        if (foundArticle) {
          const value = {
            title: (title) || foundArticle.title,
            description: (description) || foundArticle.description,
            body: (body) || foundArticle.body,
            imageUrl: (imageUrl) || foundArticle.imageUrl
          };
          const condition = {
            where: {
              id,
              userId
            }
          };
          return Article.update(value, condition)
            .then(() => res.status(200).json({
              message: 'Article updated successfully'
            }));
        }

        res.status(404).json({
          message: 'Article not found or has been deleted',
        });
      })
      .catch(err => res.status(500).json({
        message: 'Error processing request, please try again',
        Error: err.toString()
      }));
  }

  /**
   * @description Delete an Article from the Article's list
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} json
   * @memberof ArticleController
   */
  static deleteArticle(req, res) {
    const id = req.params.articleId;
    if (!(Number.isInteger(id)) && !Number(id)) {
      return res.status(400).json({
        message: 'Article ID must be a number',
      });
    }
    Article.findOne({
      where: {
        id,
        userId
      },
      attributes: ['userId']
    })
      .then((foundArticle) => {
        if (foundArticle) {
          return Article.destroy({
            where: {
              id,
            }
          })
            .then(() => res.status(200).json({
              message: 'Article deleted successfully',
            }));
        }

        res.status(404).json({
          message: 'Article not found or has been deleted',
        });
      })
      .catch(err => res.status(500).json({
        message: 'Error processing request, please try again',
        Error: err.toString()
      }));
  }

  /**
   * @description Fetch all Articles from the Article's list
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} json
   * @memberof ArticleController
   */
  static getUserArticles(req, res) {
    Article.findAndCountAll({
      where: {
        userId,
      },
      attributes: [
        'userId',
        'title',
        'body',
        'description',
        'rating',
        'createdAt',
        'updatedAt'
      ]
    })
      .then((articles) => {
        if (articles) {
          return res.status(200).json({
            message: 'All articles for a user displayed',
            Articles: articles
          });
        }
      })
      .catch(err => res.status(500).json({
        message: 'Error processing request, please try again',
        Error: err.toString()
      }));
  }

  /**
   * @description Fetch a single Article from the Article's list
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} json
   * @memberof ArticleController
   */
  static getSingleArticle(req, res) {
    const id = req.params.articleId;
    if (!(Number.isInteger(id)) && !Number(id)) {
      return res.status(400).json({
        message: 'Article ID must be a number',
      });
    }
    Article.findOne({
      where: {
        id,
        userId,
      },
      attributes: [
        'id',
        'userId',
        'title',
        'body',
        'description',
        'rating',
        'createdAt',
        'updatedAt'
      ]
    })
      .then((articles) => {
        if (articles) {
          return res.status(200).json({
            message: 'Single article displayed',
            Articles: articles
          });
        }

        res.status(404).json({
          message: 'Article not found or has been deleted',
        });
      })
      .catch(err => res.status(500).json({
        message: 'Error processing request, please try again',
        Error: err.toString()
      }));
  }

  /**
   * @description Fetch a all Articles from the Article's list
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} json
   * @memberof ArticleController
   */
  static getAllArticles(req, res) {
    Article.findAndCountAll({
      attributes: [
        'userId',
        'title',
        'body',
        'description',
        'rating',
        'createdAt',
        'updatedAt'
      ]
    })
      .then((articles) => {
        if (articles) {
          return res.status(200).json({
            message: 'All article displayed',
            Articles: articles
          });
        }
      })
      .catch(err => res.status(500).json({
        message: 'Error processing request, please try again',
        Error: err.toString()
      }));
  }
}
export default ArticleFixture;
