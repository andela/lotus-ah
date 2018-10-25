const seeder = {
  setHighlightSeeder(
    userId,
    articleId,
    highlightedText,
    commentBody
  ) {
    return {
      userId,
      articleId,
      highlightedText,
      commentBody
    };
  }
};

export default seeder;
