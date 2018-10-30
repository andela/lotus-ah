
const validateBody = {

  replyBody: (body) => {
    if (!body || body.trim() === '') {
      return false;
    }
    return true;
  }
};
export default validateBody;
