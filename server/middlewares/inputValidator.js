import Validator from 'validatorjs';

export const articleValidation = schema => (req, res, next) => {
  const input = req.body;
  const validation = new Validator({
    title: input.title,
    body: input.body,
    description: input.description
  }, schema);
  if (validation.fails()) {
    return res.status(400).json({ message: validation.errors.all() });
  }
  next();
};

export const reportValidation = schema => (req, res, next) => {
  const input = req.body;
  const validation = new Validator({
    reason: input.reason,
  }, schema);
  if (validation.fails()) {
    return res.status(400).json({ message: validation.errors.all() });
  }
  next();
};

export const schemas = {
  articleSchema: {
    title: 'required|string|max:225',
    body: 'required|string',
    description: 'required|string|max:150',
  },
  reportSchema: {
    reason: 'required|string',
  }
};

export const tagValidation = (request, response, next) => {
  const { name } = request.body;
  const validation = new Validator(
    {
      name
    },
    {
      name: 'required|string|min:1'
    }
  );
  if (validation.fails()) {
    return response.status(400)
      .json({
        message: validation.errors.all()
      });
  }
  next();
};
