
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const countCharacters = (text: string): number => {
  return text.length;
};

export const countSentences = (text: string): number => {
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
};

export const countParagraphs = (text: string): number => {
  return text.split(/\n+/).filter(para => para.trim().length > 0).length;
};

export const toSentenceCase = (text: string): string => {
  return text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
};

export const toTitleCase = (text: string): string => {
  return text.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

export const cleanText = (text: string, options: { 
  removeExtraSpaces?: boolean; 
  removeLineBreaks?: boolean; 
  trimWhitespace?: boolean;
}): string => {
  let result = text;
  if (options.removeExtraSpaces) {
    result = result.replace(/\s+/g, ' ');
  }
  if (options.removeLineBreaks) {
    result = result.replace(/\n/g, ' ');
  }
  if (options.trimWhitespace) {
    result = result.trim();
  }
  return result;
};

export const removeSpecialCharacters = (text: string): string => {
  // Keeps letters, numbers, and spaces. Removes everything else.
  return text.replace(/[^a-zA-Z0-9\s]/g, '');
};

export const getKeywordDensity = (text: string): { word: string; count: number; density: number }[] => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
    
  const total = words.length;
  if (total === 0) return [];

  const freq: Record<string, number> = {};
  words.forEach(word => {
    freq[word] = (freq[word] || 0) + 1;
  });

  return Object.entries(freq)
    .map(([word, count]) => ({
      word,
      count,
      density: Number(((count / total) * 100).toFixed(2))
    }))
    .sort((a, b) => b.count - a.count);
};

export const formatJson = (text: string, spaces: number = 2): string => {
  try {
    const obj = JSON.parse(text);
    return JSON.stringify(obj, null, spaces);
  } catch (e) {
    throw new Error('Invalid JSON format');
  }
};

export const minifyJson = (text: string): string => {
  try {
    const obj = JSON.parse(text);
    return JSON.stringify(obj);
  } catch (e) {
    throw new Error('Invalid JSON format');
  }
};
