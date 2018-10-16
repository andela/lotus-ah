
const ratingValidator = {
  validate: (req, res, next) => {
    const { rating } = req.body;
    if (!rating) {
      return res.status(400)
        .json({
          status: 'Failed',
          message: 'Rating must be a number'
        });
    }
    if (rating > 5 || rating < 1) {
      return res.status(400)
        .json({
          status: 'Failed',
          message: 'You should provide a rating between 1 and 5'
        });
    }
    next();
  }
};

export default ratingValidator;
