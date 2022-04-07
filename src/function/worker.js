import { preprocess, getSentences, countPuncMarks, getWords, getUniqueWords, wordAnalyze } from '../function/vn';

function analyze(paragraphs) {
  const parTokens = preprocess(paragraphs);
  const sentTokens = getSentences(parTokens);
  let words = [];
  for (const token of sentTokens) {
    words.push(...getWords(token));
  }
  const { lettersCount, syllablesCount } = wordAnalyze(words);
  const wordsCount = words.length;
  const sentsCount = sentTokens.length;
  let charsCount = 0;
  for (let paragraph of paragraphs) {
    charsCount += paragraph.text.length;
  }
  return {lettersCount, charsCount, syllablesCount, wordsCount, sentsCount, words};
}

self.addEventListener('message', e => {
  const { paragraphs, text } = JSON.parse(e.data);
  let rLettersCount = 0;
  let rCharsCount = 0;
  let rSyllablesCount = 0;
  let rWordsCount = 0;
  let rSentsCount = 0;
  let rPuncMarksCount = countPuncMarks(text);
  let rParsCount = paragraphs.length;
  let rUniqueWordsCount = 0;
  for (let i = 0; i < rParsCount; i += 10) {
    const {lettersCount, charsCount, syllablesCount, wordsCount, sentsCount, words} = analyze(paragraphs.slice(i, i + 10));
    rLettersCount += lettersCount;
    rCharsCount += charsCount;
    rSyllablesCount += syllablesCount;
    rWordsCount += wordsCount;
    rSentsCount += sentsCount;
    if (i + 10 >= rParsCount) {
      rUniqueWordsCount += getUniqueWords(words).length;
    }
    self.postMessage({ rLettersCount, rCharsCount, rSyllablesCount, rPuncMarksCount, rWordsCount, rUniqueWordsCount, rSentsCount, rParsCount }); 
  }
});