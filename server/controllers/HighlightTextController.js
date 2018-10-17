import models from '../db/models';

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
    const user = request.userObject.dataValues;
    const article = request.articleObject.dataValues;
    const userId = user.id;
    const articleId = article.id;
    const { commentBody, highlightedText } = request.body;

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
        return response.status(201).json({
          message: 'Highlighted text has been commented on successfully',
          highlight,
        });
      });
  }
}
export default HighlightTextController;
