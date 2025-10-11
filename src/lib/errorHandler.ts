/**
 * Global error handling utilities for Web3Twin
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export class Web3TwinError extends Error {
  public code: string;
  public details?: any;
  public timestamp: Date;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'Web3TwinError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

/**
 * Error codes for different types of errors
 */
export const ERROR_CODES = {
  // API Errors
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  API_USER_NOT_FOUND: 'API_USER_NOT_FOUND',
  API_NETWORK_ERROR: 'API_NETWORK_ERROR',
  
  // Validation Errors
  INVALID_HANDLE: 'INVALID_HANDLE',
  INVALID_FID: 'INVALID_FID',
  
  // Blockchain Errors
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  NFT_MINT_FAILED: 'NFT_MINT_FAILED',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  
  // General Errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
} as const;

/**
 * Create a standardized error object
 */
export function createError(
  code: keyof typeof ERROR_CODES,
  message: string,
  details?: any
): Web3TwinError {
  return new Web3TwinError(ERROR_CODES[code], message, details);
}

/**
 * Handle API errors with proper error codes
 */
export function handleApiError(error: any, context: string): Web3TwinError {
  console.error(`API Error in ${context}:`, error);
  
  if (error?.response?.status === 401) {
    return createError('API_KEY_MISSING', 'Invalid or missing API key');
  }
  
  if (error?.response?.status === 429) {
    return createError('API_RATE_LIMIT', 'API rate limit exceeded. Please try again later.');
  }
  
  if (error?.response?.status === 404) {
    return createError('API_USER_NOT_FOUND', 'User not found. Please check the handle and try again.');
  }
  
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('fetch')) {
    return createError('API_NETWORK_ERROR', 'Network error. Please check your connection and try again.');
  }
  
  return createError('UNKNOWN_ERROR', `An unexpected error occurred: ${error?.message || 'Unknown error'}`);
}

/**
 * Handle blockchain/wallet errors
 */
export function handleBlockchainError(error: any, context: string): Web3TwinError {
  console.error(`Blockchain Error in ${context}:`, error);
  
  if (error?.code === 4001) {
    return createError('WALLET_NOT_CONNECTED', 'User rejected the transaction');
  }
  
  if (error?.code === -32603) {
    return createError('CONTRACT_ERROR', 'Smart contract execution failed');
  }
  
  if (error?.message?.includes('insufficient funds')) {
    return createError('NFT_MINT_FAILED', 'Insufficient funds for transaction');
  }
  
  return createError('UNKNOWN_ERROR', `Blockchain error: ${error?.message || 'Unknown error'}`);
}

/**
 * Validate Farcaster handle
 */
export function validateHandle(handle: string): Web3TwinError | null {
  if (!handle || typeof handle !== 'string') {
    return createError('INVALID_HANDLE', 'Handle must be a non-empty string');
  }
  
  const cleanHandle = handle.replace('@', '').trim();
  
  if (cleanHandle.length === 0) {
    return createError('INVALID_HANDLE', 'Please enter a valid Farcaster handle');
  }
  
  if (cleanHandle.length > 30) {
    return createError('INVALID_HANDLE', 'Handle is too long (max 30 characters)');
  }
  
  // Basic validation - alphanumeric, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(cleanHandle)) {
    return createError('INVALID_HANDLE', 'Handle contains invalid characters');
  }
  
  return null;
}

/**
 * Validate FID
 */
export function validateFid(fid: number): Web3TwinError | null {
  if (!fid || typeof fid !== 'number') {
    return createError('INVALID_FID', 'FID must be a valid number');
  }
  
  if (fid <= 0) {
    return createError('INVALID_FID', 'FID must be a positive number');
  }
  
  if (fid > 999999999) {
    return createError('INVALID_FID', 'FID is too large');
  }
  
  return null;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Timeout wrapper for async functions
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(createError('TIMEOUT_ERROR', `Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}
