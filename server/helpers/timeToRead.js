// Method to calcuylate time to read an article

const timeToReadAnArticle = (articleBody) => {
  const timeTakenToRead = {};

  if (articleBody === undefined) {
    return timeTakenToRead;
  }
  const minuteToReadAWord = 0.00363636364;
  const splittedWord = articleBody.split(' ');
  const wordLength = splittedWord.length;

  const TimeTaken = wordLength * minuteToReadAWord;


  timeTakenToRead.time = `${Math.round(TimeTaken)} minute`;
  timeTakenToRead.wordCount = wordLength;

  return JSON.stringify(timeTakenToRead);
};

export default timeToReadAnArticle;
