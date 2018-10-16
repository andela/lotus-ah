import slug from 'slug';
import uuid from 'uuid';

import { Article, FavoriteArticle, Comment } from '../db/models';

/**
 * @class ArticleController
 * @desc This is a class controller
 * that handles all operations related to Articles.
 */
class ArticleController {
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
    const userId = req.decoded.id;
    console.log(userId);
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
      .then((createdArticle) => {
        res.status(201)
          .json({
            message: 'Published article successfully',
            createdArticle
          });
      })
      .catch((err) => {
        res.status(500)
          .json({
            message: 'Error processing request, please try again',
            Error: err.toString(),
          });
      });
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
      userId = req.decoded.id,
      imageUrl = null;

    if (!(Number.isInteger(id)) && !Number(id)) {
      return res.status(400)
        .json({
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
            .then(() => {
              res.status(200)
                .json({
                  message: 'Article updated successfully'
                });
            });
        }
        res.status(404)
          .json({
            message: 'Article not found or has been deleted',
          });
      })
      .catch((err) => {
        res.status(500)
          .json({
            message: 'Error processing request, please try again',
            Error: err.toString()
          });
      });
  }

  /**
   * @description Delete an Article from the Article's list
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} json
   * @memberof ArticleController
   */
  static deleteArticle(req, res) {
    const id = req.params.articleId,
      userId = req.decoded.id;

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
            .then(() => {
              res.status(200)
                .json({
                  message: 'Article deleted successfully',
                });
            });
        }
        res.status(404)
          .json({
            message: 'Article not found or has been deleted',
          });
      })
      .catch((err) => {
        res.status(500)
          .json({
            message: 'Error processing request, please try again',
            Error: err.toString()
          });
      });
  }

  /**
   * @description Fetch all Articles from the Article's list
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} json
   * @memberof ArticleController
   */
  static getUserArticles(req, res) {
    const userId = req.decoded.id;

    Article.findAndCountAll({
      where: {
        userId,
      },
      include: [{
        model: Comment,
        as: 'comments',
        attributes: ['id', 'commentBody', 'userId', 'createdAt']
      }],
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
          return res.status(200)
            .json({
              message: 'All articles for a user displayed',
              Articles: articles
            });
        }
      })
      .catch((err) => {
        res.status(500)
          .json({
            message: 'Error processing request, please try again',
            Error: err.toString()
          });
      });
  }

  /**
   * @description Fetch a single Article from the Article's list
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} json
   * @memberof ArticleController
   */
  static getSingleArticle(req, res) {
    const id = req.params.articleId,
      userId = req.decoded.id;

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
      include: [{
        model: Comment,
        as: 'comments',
        attributes: ['id', 'commentBody', 'userId', 'createdAt']
      }],
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
          return res.status(200)
            .json({
              message: 'Single article displayed',
              Articles: articles
            });
        }
        res.status(404)
          .json({
            message: 'Article not found or has been deleted',
          });
      })
      .catch((err) => {
        res.status(500)
          .json({
            message: 'Error processing request, please try again',
            Error: err.toString()
          });
      });
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
      ],
      include: [{
        model: Comment,
        as: 'comments',
        attributes: ['id', 'commentBody', 'userId', 'createdAt']
      }],
    })
      .then((articles) => {
        if (articles) {
          return res.status(200)
            .json({
              message: 'All article displayed',
              Articles: articles
            });
        }
      })
      .catch((err) => {
        res.status(500)
          .json({
            message: 'Error processing request, please try again',
            Error: err.toString()
          });
      });
  }

  /**
   *
   *
   * @static
   * @param { object } req
   * @param { object } res
   * @description add article to user favorite list
   * @memberof ArticleFixture
   * @returns { object } object
   */
  static addFavourite(req, res) {
    const articleId = req.params.id;
    const userId = req.decoded.id;
    console.log(userId);
    Article.findOne({
      where: { id: articleId }
    })
      .then(article => article)
      .then((article) => {
        if (!article) {
          return res.status(404)
            .json({
              status: 'Success',
              message: 'Article does not exist',
            });
        }
        return FavoriteArticle.findOrCreate({
          include: [{
            model: Article,
          }],
          where: { userId, articleId }
        });
      })
      .then((result) => {
        res.status(200)
          .json({
            status: 'Success',
            message: 'Article added to favorite',
            article: result,
          });
      })
      .catch(() => res.status(500)
        .json({
          status: 'Failed',
          message: 'Problem favouriting article',
        }));
  }

  /**
   *
   *
   * @static
   * @param { object } req
   * @param { object } res
   * @description remove an article from favourite
   * @memberof ArticleFixture
   * @returns { object } object
   */
  static removeFavourite(req, res) {
    const userId = req.decoded.id;
    const articleId = req.params.id;
    Article.findOne({
      where: { id: articleId }
    })
      .then(article => article)
      .then((article) => {
        if (!article) {
          return res.status(404)
            .json({
              status: 'Success',
              message: 'Article does not exist',
            });
        }
        return FavoriteArticle.destroy({
          where: { userId, articleId }
        });
      })
      .then(() => res.status(200)
        .json(
          {
            status: 'Success',
            message: 'Article removed from favourite',
          }
        ))
      .catch(() => {
        res.status(500)
          .json({
            status: 'Failed',
            message: 'Problem removing article from favorite'
          });
      });
  }

  /**
   *
   *
   * @static
   * @param { object } req
   * @param { object } res
   * @description returns all user favorite articles
   * @memberof ArticleFixture
   * @returns { object } object
   */
  static getAllFavorite(req, res) {
    const userId = req.decoded.id;
    FavoriteArticle.findAll({
      include: [
        {
          model: Article,
        },
      ],
      where: { userId, }
    }).then((result) => {
      res.status(200)
        .json({
          status: 'Success',
          result
        });
    })
      .catch(() => {
        res.status(500)
          .json({
            status: 'Failed',
            message: 'Problem finding favourite article',
          });
      });
  }
}
export default ArticleController;
