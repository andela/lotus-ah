// Models Import
import models from '../db/models';

const { Report, Article } = models;
/**
 * @class ReportController
 */
class ReportController {
  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @return {object} report
   * @memberof ReportController
   */
  static reportArticle(request, response) {
    const user = request.userObject.dataValues;
    const article = request.articleObject.dataValues;
    const userId = user.id;
    const articleId = article.id;
    const { reason } = request.body;

    Report.findOrCreate({
      where: {
        articleId,
        userId,
        reason
      }
    })
      .spread((report, created) => {
        if (!created && !report.isResolved) {
          return response.status(409).json({
            status: 'FAILED',
            message: 'report already exists'
          });
        }
        const value = {
          isReported: true,
        };
        Article.update(
          value,
          {
            where: {
              id: report.articleId
            }
          }
        )
          .then(() => {
            const changeValue = {
              isResolved: false,
            };
            Report.update(
              changeValue,
              {
                where: {
                  isResolved: report.isResolved
                }
              }
            ).then((updatedArticle) => {
              if (updatedArticle) {
                return response.status(201).json({
                  status: 'SUCCESS',
                  message: 'Article has been reported successfully',
                  report
                });
              }
            });
          })
          .catch(err => response.status(500).json({
            status: 'FAILED',
            message: 'Article can not be reported',
            Error: err.toString()
          }));
      });
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @return {object} report
  * @memberof ReportController
  */
  static resolveReport(request, response) {
    const user = request.userObject.dataValues;
    const article = request.articleObject.dataValues;
    const articleId = article.id;

    if (!user.roleName === 'ADMIN') {
      return response.status(401).json({
        status: 'FAILED',
        message: 'unauthorized access',
      });
    }
    Report.findOne({
      where: {
        articleId
      }
    })
      .then((foundReport) => {
        const value = {
          isResolved: true,
        };
        Report.update(
          value,
          {
            where: {
              id: foundReport.dataValues.id
            }
          }
        )
          .then(() => {
            const reportStatus = {
              isReported: false,
            };
            Article.update(
              reportStatus,
              {
                where: {
                  isReported: true,

                }
              }
            )
              .then(() => response.status(200).json({
                status: 'SUCCESS',
                message: 'Article has been resolved successfully'
              }));
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
  * @return {object} report
  * @memberof ReportController
  */
  static fetchAllReportedArticle(request, response) {
    Article.findAndCountAll({
      where: {
        isReported: true
      },
    })
      .then(reportedArticle => response.status(200).json({
        status: 'SUCCESS',
        message: 'Fetch reported article successfully',
        data: reportedArticle
      }))
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
  * @return {object} report
  * @memberof ReportController
  */
  static fetchReportForASingleArticle(request, response) {
    const user = request.userObject.dataValues;
    const article = request.articleObject.dataValues;
    if (user.roleId !== Number(1)) {
      return response.status(401).json({
        status: 'FAILED',
        message: 'unauthorized access',
      });
    }

    if (article.isReported === true) {
      return Report.findAll({
        where: {
          articleId: article.id
        }
      })
        .then(reports => response.status(200).json({
          status: 'SUCCESS',
          message: 'Fetch reported article successfully',
          reports
        }))
        .catch(err => response.status(500).json({
          status: 'FAILED',
          message: err.message
        }));
    }

    return response.status(200).json({
      status: 'FAILED',
      message: 'This article does not have any report',
    });
  }
}
export default ReportController;
