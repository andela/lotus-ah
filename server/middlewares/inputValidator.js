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

export const schemas = {
  articleSchema: {
    title: 'required|string|max:225',
    body: 'required|string',
    description: 'required|string|max:150',
  }
};
