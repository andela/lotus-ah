import models from '../db/models';
import NotificationController from './NotificationController';

const { Highlight } = models;

/**
 * @class HighlightTextController
 */
class HighlightTextController {
  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @return {object} highlightedObject
   * @memberof HighlightTextController
   */
  static highlightArticleText(request, response) {
    const user = request.authUser;
    const article = request.articleObject.dataValues;
    const userId = user.id;
    const articleId = article.id;
    const { commentBody, highlightedText } = request.body;
    const author = request.articleObject.dataValues.users.dataValues;

    Highlight.findOrCreate({
      where: {
        userId,
        articleId,
        commentBody,
        highlightedText
      },
      default: {
        userId,
        articleId,
        commentBody,
        highlightedText
      },
    })
      .spread((highlight, created) => {
        if (!created) {
          return response.status(409).json({
            status: 'Failed',
            message: 'This text has already been commented on'
          });
        }
        const notify = {
          type: 'comment',
          article: article.title,
          author,
          authenticatedUser: user,
          articleUrl: `${process.env.BASE_URL}/api/v1/articles/${article.slug}`,
          message: `${user.firstname} commented on your article`
        };
        NotificationController.notifyFollowers(
          {
            followerType: 'article',
            notify,
          }
        );
        return response.status(201).json({
          message: 'Highlighted text has been commented on successfully',
          highlight,
        });
      });
  }

  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @return {object} highlightedObject
   * @memberof HighlightTextController
   */
  static getHighlightTedText(request, response) {
    const user = request.authUser;
    const article = request.articleObject.dataValues;
    const userId = user.id;
    const articleId = article.id;
    Highlight.findAll({
      where: {
        userId,
        articleId
      }
    })
      .then((fetchComment) => {
        if (!fetchComment) {
          return response.status(500)
            .json({
              message: 'Internal Server Error'
            });
        }
        return response.status(200).json({
          message: 'Comment fetched Succesfully',
          fetchComment,
        });
      });
  }
}
export default HighlightTextController;
