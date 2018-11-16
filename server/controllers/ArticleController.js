// Third-party libraries
import slug from 'slug';
import uuid from 'uuid';

// modules import
import {
  Article,
  FavoriteArticle,
  Comment,
  Tag,
  Reaction,
  User,
  Reply
} from '../db/models';
import timeToRead from '../helpers/timeToRead';
import NotificationController from './NotificationController';
/**
 * @class ArticleController
 * @desc This is a class controller
 * that handles all operations related to Articles.
 */
class ArticleController {
  /**
   * @static
   * @param {string} title
   * @memberof ArticleController
   * @return {string} slug
   * @description creates slug
   */
  static makeSlug(title) {
    return `${slug(title)}-${uuid()}`;
  }

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
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.secure_url;
    }
    const articleSlug = ArticleController.makeSlug(title);
    const authenticatedUser = req.authUser;
    let tags = req.body.tags || [];
    if (tags.length > 5) {
      return res.status(400).json({
        status: 'failed',
        message: 'Tags should not exceed 5',
      });
    }
    tags = ArticleController.tagIdExist(tags);

    Article.create({
      userId,
      title,
      slug: articleSlug,
      rating: null,
      description,
      body,
      imageUrl
    })
      .then(taggingArticle => taggingArticle.addTags(tags))
      .then(() => {
        Article.findOne({
          where: { slug: articleSlug },
          include: [{
            model: Tag,
            as: 'Tags',
            attributes: ['name'],
            through: {
              attributes: [],
            }
          }]
        })
          .then((create) => {
            const notify = {
              type: 'publish',
              article: create.title,
              slug: create.slug,
              author: authenticatedUser,
              authenticatedUser,
              articleUrl: `${process.env.BASE_URL}/api/v1/articles/${create.slug}`,
              message: `${authenticatedUser.firstname},${authenticatedUser.id},published a new artilce,${create.title},${create.slug}`,
              emailMessage: `${authenticatedUser.firstname} published a new artilce`
            };
            NotificationController.notifyFollowers(
              {
                followerType: 'authorFollowers',
                notify,
              }
            );
            return res.status(201).json({
              status: 'SUCCESS',
              message: 'Published article successfully',
              createdArticle: create
            });
          });
      })
      .catch(err => res.status(500).json({
        status: 'FAILED',
        message: 'Error processing request, please try again',
        Error: err.toString()
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
      currentSlug = req.params.slug,
      userId = req.decoded.id,
      imageUrl = null,
      readTime = timeToRead(body);

    let tags = req.body.tags || [];
    if (tags.length > 5) {
      res.status(400).json({
        status: 'error',
        message: 'Tags should not exceed 5',
      });
    }
    tags = ArticleController.tagIdExist(tags);
    Article.findOne({
      where: {
        slug: currentSlug,
        userId
      },
      attributes: ['slug', 'userId', 'title', 'id']
    })
      .then((foundArticle) => {
        if (foundArticle) {
          const value = {
            title: (title) || foundArticle.title,
            description: (description) || foundArticle.description,
            body: (body) || foundArticle.body,
            imageUrl: (imageUrl) || foundArticle.imageUrl,
            readTime,
          };
          foundArticle.update(value, {
            where: {
              id: foundArticle.dataValues.id
            }
          })
            .then((tagArticle) => {
              foundArticle.setTags(tags)
                .then(() => foundArticle.getTags({ attributes: ['id', 'name'] })
                  .then(taglink => res.status(200).json({
                    status: 'success',
                    message: 'Article updated successfully',
                    article: tagArticle,
                    tags: taglink
                  })));
            });
        } else {
          res.status(404).json({
            message: 'Article not found or has been deleted',
          });
        }
      })
      .catch(err => res.status(500).json({
        status: 'FAILED',
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
    const currentSlug = req.params.slug,
      userId = req.decoded.id;

    Article.findOne({
      where: {
        slug: currentSlug,
        userId
      },
      attributes: ['slug', 'userId', 'title', 'id']
    })
      .then((foundArticle) => {
        if (foundArticle) {
          return Article.destroy({
            where: {
              slug: currentSlug,
            }
          })
            .then(() => {
              res.status(200)
                .json({
                  status: 'SUCCESS',
                  message: 'Article deleted successfully',
                });
            });
        }
        res.status(404)
          .json({
            status: 'FAILED',
            message: 'Article not found or has been deleted',
          });
      })
      .catch(err => res.status(500).json({
        status: 'FAILED',
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
    const userId = req.decoded.id;

    Article.findAndCountAll({
      where: {
        userId,
      },
      include: [{
        model: Comment,
        as: 'comments',
        attributes: ['id', 'commentBody', 'userId', 'createdAt']
      },
      {
        model: Tag,
        as: 'Tags',
        attributes: ['name'],
        through: {
          attributes: [],
        }
      },
      {
        model: Reaction,
        as: 'reactions',
        attributes: ['id', 'likes', 'dislike']
      }],
      attributes: [
        'userId',
        'title',
        'body',
        'description',
        'imageUrl',
        'rating',
        'createdAt',
        'updatedAt'
      ]
    })
      .then((articles) => {
        if (articles) {
          return res.status(200)
            .json({
              status: 'SUCCESS',
              message: 'Fetched all articles for a user',
              Articles: articles
            });
        }
        res.status(404)
          .json({
            status: 'FAILED',
            message: 'Article not found or has been deleted',
          });
      })
      .catch(err => res.status(500).json({
        status: 'FAILED',
        message: 'Error processing request, please try again',
        Error: err.toString()
      }));
  }

  /**
   * @description Fetch a single Article from the Article's list
   * @param {object} req http request object
   * @param {object} res http response object
   * @param  {function} next response from the server
   * @returns {object} json
   * @memberof ArticleController
   */
  static getSingleArticle(req, res, next) {
    const currentSlug = req.params.slug;
    const userId = req.decoded.id;
    if (!currentSlug) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Article ID must be a number',
      });
    }
    Article.findOne({
      where: {
        slug: currentSlug,
      },
      include: [{
        model: Comment,
        as: 'comments',
        attributes: ['id', 'commentBody', 'userId', 'createdAt'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: [
              'firstname',
              'username'
            ]
          },
          {
            model: Reply,
            as: 'replies',
            attributes: [
              'id'
            ]

          }
        ]
      },
      {
        model: Tag,
        as: 'Tags',
        attributes: ['name'],
        through: {
          attributes: [],
        }
      },
      {
        model: User,
        as: 'users',
        attributes: [
          'firstname',
          'lastname',
          'username'
        ]
      },
      {
        model: Reaction,
        as: 'reactions',
        attributes: ['id', 'likes', 'dislike']
      }],
      attributes: [
        'id',
        'userId',
        'title',
        'imageUrl',
        'body',
        'slug',
        'description',
        'rating',
        'createdAt',
        'isReported',
        'updatedAt'
      ]
    })
      .then((articles) => {
        if (articles) {
          const articleId = articles.id;
          if (userId !== 0) {
            res.stat = { userId, articleId };
            next();
          }
          return res.status(200)
            .json({
              status: 'SUCCESS',
              message: 'Fetched a single user article',
              Articles: articles
            });
        }
        res.status(404)
          .json({
            status: 'FAILED',
            message: 'Article not found or has been deleted',
          });
      })
      .catch(err => res.status(500).json({
        status: 'FAILED',
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
    const limit = 15;
    let offset = 0;
    Article.findAndCountAll()
      .then((data) => {
        const { page } = req.params;
        offset = limit * (page - 1);
        const pages = Math.ceil(data.count / limit);
        Article.findAll({
          include: [{
            model: Comment,
            as: 'comments',
            attributes: ['id', 'commentBody', 'userId', 'createdAt']
          },
          {
            model: Tag,
            as: 'Tags',
            attributes: ['id', 'name'],
            through: {
              attributes: [],
            }
          },
          {
            model: Reaction,
            as: 'reactions',
            attributes: ['id', 'likes', 'dislike']
          }],
          attributes: [
            'id',
            'slug',
            'userId',
            'title',
            'body',
            'description',
            'imageUrl',
            'rating',
            'createdAt',
            'updatedAt'
          ],
          limit,
          offset
        })
          .then((articles) => {
            if (articles) {
              return res.status(200)
                .json({
                  status: 'SUCCESS',
                  message: 'Fetched all article',
                  articles,
                  articlesCount: data.count,
                  page,
                  pages
                });
            }
          })
          .catch(err => res.status(500).json({
            status: 'FAILED',
            message: 'Error processing request, please try again',
            Error: err.toString()
          }));
      }).catch(err => err.message);
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
    const articleId = req.articleObject.dataValues.id;
    const userId = req.decoded.id;
    return FavoriteArticle.findOrCreate({
      include: [{
        model: Article,
      }],
      where: { userId, articleId }
    }).then((result) => {
      res.status(200)
        .json({
          status: 'Success',
          message: 'Article added to favorite',
          article: result,
        });
    })
      .catch(err => res.status(500).json({
        status: 'FAILED',
        message: 'Error processing request, please try again',
        Error: err.toString()
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
    const articleId = req.articleObject.dataValues.id;

    FavoriteArticle.destroy({
      where: { userId, articleId }
    })
      .then(() => res.status(200)
        .json({
          status: 'Success',
          message: 'Article removed from favourite',
        }))
      .catch(err => res.status(500)
        .json({
          status: 'FAILED',
          message: 'Error processing request, please try again',
          Error: err.toString()
        }));
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
      .catch(err => res.status(500).json({
        status: 'FAILED',
        message: 'Error processing request, please try again',
        Error: err.toString()
      }));
  }

  /**
   * @static
   * @param {*} collectedtags
   * @memberof ArticleController
   * @returns {object} result
   * @description Filter tagId that doesnt exit
   */
  static tagIdExist(collectedtags) {
    const filteredtag = [];
    for (let i = 0; i < collectedtags.length; i += 1) {
      Tag.findOne({ where: { id: parseInt(collectedtags[i], 10) } })
        .then((tag) => {
          if (tag) {
            filteredtag.push(collectedtags[i]);
          }
        })
        .catch(error => error.message);
    }
    return filteredtag;
  }
}

export default ArticleController;
