export interface CastData {
  text: string;
  author_fid: number;
  hash: string;
  timestamp: string;
}

export interface TokenizedData {
  words: Set<string>;
  hashtags: Set<string>;
  emojis: Set<string>;
  gmStreak: number;
}

export interface SimilarityResult {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  similarity: number;
  textJaccard: number;
  hashtagOverlap: number;
  emojiOverlap: number;
  gmBonus: number;
  sharedHashtags: string[];
  sharedEmojis: string[];
  matchingGmStreak: boolean;
}

/**
 * Extract emojis from text using Unicode ranges
 */
function extractEmojis(text: string): string[] {
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
  return text.match(emojiRegex) || [];
}

/**
 * Extract hashtags from text
 */
function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  return text.match(hashtagRegex) || [];
}

/**
 * Tokenize and preprocess text into words (lowercase, no punctuation)
 */
function tokenizeText(text: string): string[] {
  // Remove URLs
  let cleaned = text.replace(/https?:\/\/[^\s]+/g, '');
  // Remove mentions
  cleaned = cleaned.replace(/@[\w]+/g, '');
  // Remove hashtags (we handle them separately)
  cleaned = cleaned.replace(/#[\w]+/g, '');
  // Remove emojis (we handle them separately)
  cleaned = cleaned.replace(/(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu, '');
  // Lowercase and split by whitespace/punctuation
  return cleaned
    .toLowerCase()
    .split(/[\s.,!?;:()\[\]{}'"]+/)
    .filter(word => word.length > 2); // Filter out very short words
}

/**
 * Calculate consecutive days with 'gm' casts (simplified: just count gm occurrences)
 */
function calculateGmStreak(casts: CastData[]): number {
  const gmCount = casts.filter(cast => 
    /\bgm\b/i.test(cast.text)
  ).length;
  return gmCount;
}

/**
 * Process casts into tokenized data
 */
export function preprocessCasts(casts: CastData[]): TokenizedData {
  const allWords: string[] = [];
  const allHashtags: string[] = [];
  const allEmojis: string[] = [];

  for (const cast of casts) {
    allWords.push(...tokenizeText(cast.text));
    allHashtags.push(...extractHashtags(cast.text));
    allEmojis.push(...extractEmojis(cast.text));
  }

  return {
    words: new Set(allWords),
    hashtags: new Set(allHashtags),
    emojis: new Set(allEmojis),
    gmStreak: calculateGmStreak(casts),
  };
}

/**
 * Calculate Jaccard similarity between two sets
 */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}

/**
 * Calculate overlap coefficient (intersection / min size)
 */
function overlapCoefficient(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const minSize = Math.min(setA.size, setB.size);
  
  return intersection.size / minSize;
}

/**
 * Calculate final similarity score using weighted formula
 * Score = 0.6·text Jaccard + 0.25·hashtag overlap + 0.15·emoji overlap + bonus for matching gm streak
 */
export function calculateSimilarity(
  userTokens: TokenizedData,
  candidateTokens: TokenizedData,
  candidateInfo: { fid: number; username: string; displayName: string; pfpUrl: string }
): SimilarityResult {
  const textJaccard = jaccardSimilarity(userTokens.words, candidateTokens.words);
  const hashtagOverlap = overlapCoefficient(userTokens.hashtags, candidateTokens.hashtags);
  const emojiOverlap = overlapCoefficient(userTokens.emojis, candidateTokens.emojis);
  
  // GM bonus: if both have gm streaks, add bonus proportional to min streak
  const matchingGmStreak = userTokens.gmStreak > 0 && candidateTokens.gmStreak > 0;
  const gmBonus = matchingGmStreak 
    ? Math.min(userTokens.gmStreak, candidateTokens.gmStreak) * 0.02 
    : 0;
  
  const similarity = 
    0.6 * textJaccard + 
    0.25 * hashtagOverlap + 
    0.15 * emojiOverlap + 
    gmBonus;

  // Get shared items for display
  const sharedHashtags = [...userTokens.hashtags].filter(h => candidateTokens.hashtags.has(h));
  const sharedEmojis = [...userTokens.emojis].filter(e => candidateTokens.emojis.has(e));

  return {
    fid: candidateInfo.fid,
    username: candidateInfo.username,
    displayName: candidateInfo.displayName,
    pfpUrl: candidateInfo.pfpUrl,
    similarity: Math.min(similarity * 100, 100), // Convert to percentage, cap at 100
    textJaccard,
    hashtagOverlap,
    emojiOverlap,
    gmBonus,
    sharedHashtags: sharedHashtags.slice(0, 5), // Top 5
    sharedEmojis: sharedEmojis.slice(0, 5), // Top 5
    matchingGmStreak,
  };
}

/**
 * Find the best twin match from a list of candidates
 */
export function findBestTwin(
  userTokens: TokenizedData,
  candidates: Array<{ tokens: TokenizedData; info: { fid: number; username: string; displayName: string; pfpUrl: string } }>
): SimilarityResult | null {
  if (candidates.length === 0) return null;

  const results = candidates.map(candidate =>
    calculateSimilarity(userTokens, candidate.tokens, candidate.info)
  );

  // Sort by similarity and return the best match
  results.sort((a, b) => b.similarity - a.similarity);
  
  return results[0];
}

