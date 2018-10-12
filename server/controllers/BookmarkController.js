import { Bookmark, Article } from '../db/models';
/**
 *@class BookMarkController
 *@description Handles all the logic of Article bookmarking
 */
class BookMarkController {
  /**
   * @static
   * @param { object } req
   * @param { object } res
   * @description add article to user bookmark
   * @memberof ArticleFixture
   * @returns { object } object
   */
  static bookmark(req, res) {
    const articleId = req.body.id;
    const { slug } = req.body;
    const userId = req.decoded.id;
    Article.findOne({
      where: { id: articleId, slug }
    })
      .then((article) => {
        if (!article) {
          throw new Error('Article does not exist');
        }
        return Bookmark.findOrCreate({
          include: [{
            model: Article,
          }],
          where: { userId, articleId }
        });
      })
      .spread((bookmark) => {
        res.status(200)
          .json({
            status: 'Success',
            message: 'Article bookmarked',
            bookmark
          });
      })
      .catch((error) => {
        if (error.message === 'Article does not exist') {
          return res.status(404)
            .json({
              status: 'Success',
              message: 'Article does not exist',
            });
        }
        res.status(500)
          .json({
            status: 'Failed',
            message: 'Problem bookmarking article',
          });
      });
  }

  /**
   * @static
   * @param { object } req
   * @param { object } res
   * @description remove a loggedin user bookmark with bookmarkId
   * @memberof ArticleFixture
   * @returns { object } object
   */
  static removeBookmark(req, res) {
    const userId = req.decoded.id;
    const { id } = req.params;
    Bookmark.destroy({
      where: { userId, id }
    })
      .then((result) => {
        const message = 'Article removed from bookmark';
        if (result === 0) {
          const bookmarkNotFound = new Error();
          bookmarkNotFound.message = 'Bookmark does not exist';
          bookmarkNotFound.number = 404;
          throw bookmarkNotFound;
        }
        res.status(200)
          .json({
            status: 'Success',
            message,
          });
      })
      .catch((error) => {
        if (error.number === 404) {
          return res.status(404)
            .json({
              status: 'Failed',
              message: error.message,
            });
        }
        res.status(500)
          .json({
            status: 'Failed',
            message: 'Problem removing article from bookmark',
          });
      });
  }

  /**
   * @static
   * @param { object } req
   * @param { object } res
   * @description returns a loggedin user bookmark with bookmarkId
   * @memberof ArticleFixture
   * @returns { object } object
   */
  static getBookmarkById(req, res) {
    const userId = req.decoded.id;
    const { id } = req.params;
    Bookmark.findAll({
      include: [
        {
          model: Article,
        },
      ],
      where: { userId, id }
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
            message: 'Problem finding bookmark',
          });
      });
  }

  /**
   * @static
   * @param { object } req
   * @param { object } res
   * @description returns all user favorite articles
   * @memberof ArticleFixture
   * @returns { object } object
   */
  static getAllBookmark(req, res) {
    const userId = req.decoded.id;
    Bookmark.findAll({
      include: [
        {
          model: Article,
        },
      ],
      attributes: [
        'id',
        'userId',
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
            message: 'Problem finding bookmark',
          });
      });
  }
}

export default BookMarkController;
