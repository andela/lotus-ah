// moduler importations
import { Tag, Article } from '../db/models';

/**
 * @class TagController
 *  @desc This is a class controller
 * that handles operations related to Tags.
 */
class TagController {
  /**
     * @static
     * @param {*} request
     * @param {*} response
     * @memberof TagController
     * @returns {object} json
     */
  static createTag(request, response) {
    const { name } = request.body;
    Tag.findOrCreate({ where: { name } })
      .then(tag => response.status(201)
        .json({
          status: 'success',
          message: 'Tag was created',
          tag
        }))
      .catch(error => error.message);
  }

  /**
   * @static
   * @param {*} request
   * @param {*} response
   * @memberof TagController
   * @returns {object} json
   */
  static getAllTag(request, response) {
    Tag.findAll()
      .then(tag => response.status(200)
        .json({
          status: 'success',
          message: 'All tags available',
          tag
        }))
      .catch(error => error.message);
  }

  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @memberof TagController
   * @returns {object} json
   */
  static getArticleByTagId(request, response) {
    const { id } = request.params;
    Tag.findOne({
      where: { id },
      include: [{
        model: Article,
        as: 'Articles',
        attributes: [
          'userId',
          'title',
          'body',
          'description',
          'rating',
          'createdAt',
          'updatedAt'],
        through: {
          attributes: [],
        }
      }]
    })
      .then((article) => {
        if (article) {
          return response.status(200)
            .json({
              status: 'success',
              message: 'Tags with associated articles successfully obtained',
              article
            });
        }
        response.status(404)
          .json({
            status: 'failed',
            message: 'Tag id provided does not exist'
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
  static getArticleByTagName(request, response) {
    const { name } = request.params;
    Tag.findOne({
      where: { name },
      include: [{
        model: Article,
        as: 'Articles',
        attributes: [
          'userId',
          'title',
          'body',
          'description',
          'rating',
          'createdAt',
          'updatedAt'],
        through: {
          attributes: [],
        }
      }]
    })
      .then((article) => {
        if (!article) {
          response.status(404)
            .json({
              status: 'failed',
              message: 'Tag name provided does not exist'
            });
        } else {
          response.status(200)
            .json({
              status: 'success',
              message: 'Tags with associated articles successfully obtained',
              article
            });
        }
      })
      .catch(error => error.message);
  }
}
export default TagController;
