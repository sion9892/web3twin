export interface CastData {
  text: string;
  author_fid: number;
  hash: string;
  timestamp: string;
}

/**
 * Common stop words that don't add meaningful value to similarity analysis
 */
const STOP_WORDS = new Set([
  // Articles
  'a', 'an', 'the',
  // Pronouns
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs',
  'this', 'that', 'these', 'those',
  // Prepositions
  'in', 'on', 'at', 'by', 'for', 'with', 'without', 'through', 'during', 'before', 'after',
  'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
  'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now',
  // Common verbs
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can',
  // Common words
  'and', 'or', 'but', 'if', 'because', 'as', 'until', 'while', 'of', 'to', 'from',
  'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just',
  'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren',
  'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn',
  'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn',
  // Crypto/Web3 specific common words
  'gm', 'gn', 'wagmi', 'ngmi', 'diamond', 'hands', 'apes', 'moon', 'lambo',
  'hodl', 'fomo', 'fud', 'pump', 'dump', 'bull', 'bear', 'crypto', 'defi',
  'nft', 'dao', 'web3', 'blockchain', 'ethereum', 'bitcoin', 'btc', 'eth'
]);

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
 * Extract hashtags from text and filter out common/meaningless ones
 */
function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  const hashtags = text.match(hashtagRegex) || [];
  
  // Filter out common/meaningless hashtags
  const commonHashtags = new Set([
    '#farcaster', '#web3', '#crypto', '#nft', '#defi', '#dao', '#blockchain',
    '#ethereum', '#bitcoin', '#btc', '#eth', '#gm', '#gn', '#wagmi', '#ngmi',
    '#moon', '#lambo', '#diamond', '#hands', '#apes', '#hodl', '#fomo', '#fud',
    '#pump', '#dump', '#bull', '#bear', '#crypto', '#defi', '#web3', '#nft',
    '#dao', '#blockchain', '#ethereum', '#bitcoin', '#btc', '#eth', '#gm',
    '#gn', '#wagmi', '#ngmi', '#moon', '#lambo', '#diamond', '#hands', '#apes',
    '#hodl', '#fomo', '#fud', '#pump', '#dump', '#bull', '#bear'
  ]);
  
  return hashtags.filter(tag => {
    const tagLower = tag.toLowerCase();
    // Filter out common hashtags
    if (commonHashtags.has(tagLower)) return false;
    // Filter out very short hashtags
    if (tag.length <= 3) return false;
    // Filter out hashtags that are just numbers
    if (/^#\d+$/.test(tag)) return false;
    return true;
  });
}

/**
 * Check if a word should be filtered out (stop word or too short)
 */
function shouldFilterWord(word: string): boolean {
  // Filter out very short words
  if (word.length <= 2) return true;
  
  // Filter out stop words
  if (STOP_WORDS.has(word.toLowerCase())) return true;
  
  // Filter out words that are only numbers
  if (/^\d+$/.test(word)) return true;
  
  // Filter out words with too many repeated characters (like "loooool")
  if (/(.)\1{3,}/.test(word)) return true;
  
  return false;
}

/**
 * Debug function to show filtered vs kept words (for development)
 */
export function debugTokenization(text: string): { kept: string[], filtered: string[] } {
  const allWords = text
    .toLowerCase()
    .split(/[\s.,!?;:()\[\]{}'"]+/)
    .filter(word => word.length > 0);
  
  const kept: string[] = [];
  const filtered: string[] = [];
  
  allWords.forEach(word => {
    if (shouldFilterWord(word)) {
      filtered.push(word);
    } else {
      kept.push(word);
    }
  });
  
  return { kept, filtered };
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
    .filter(word => !shouldFilterWord(word)); // Apply comprehensive filtering
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



