// In a production application, use a persistent database like Firebase Firestore, Supabase, or a relational database with Prisma.
// This in-memory store is for demonstration purposes and will lose data on server restart.

import { createHash } from 'crypto';

export interface UrlMapping {
  longUrl: string;
  shortCode: string;
  createdAt: Date;
}

// Store for shortCode -> UrlMapping
const urlStore: Map<string, UrlMapping> = new Map();
// Index for longUrl -> shortCode to quickly check for existing entries
const longUrlIndex: Map<string, string> = new Map();

/**
 * Retrieves a URL mapping by its short code.
 * @param shortCode The short code to look up.
 * @returns The UrlMapping if found, otherwise undefined.
 */
export async function getUrlMappingByShortCode(shortCode: string): Promise<UrlMapping | undefined> {
  return urlStore.get(shortCode);
}

/**
 * Retrieves a short code by its original long URL.
 * @param longUrl The long URL to look up.
 * @returns The short code if found, otherwise undefined.
 */
export async function getShortCodeByLongUrl(longUrl: string): Promise<string | undefined> {
  return longUrlIndex.get(longUrl);
}

/**
 * Creates and stores a new URL mapping.
 * @param longUrl The original long URL.
 * @param shortCode The generated short code.
 * @returns The created UrlMapping.
 */
export async function createUrlMapping(longUrl: string, shortCode: string): Promise<UrlMapping> {
  const mapping: UrlMapping = { longUrl, shortCode, createdAt: new Date() };
  urlStore.set(shortCode, mapping);
  longUrlIndex.set(longUrl, shortCode);
  return mapping;
}

/**
 * Generates a deterministic short code from a long URL.
 * Uses a SHA256 hash and takes a substring. Base64url encoding is used for URL-friendliness.
 * @param longUrl The long URL to generate a short code for.
 * @param suffix Optional suffix to add to the long URL before hashing, used for collision resolution.
 * @returns A 6-character short code.
 */
export function generateDeterministicShortCode(longUrl: string, suffix: string = ''): string {
  const input = longUrl + suffix;
  const hash = createHash('sha256').update(input).digest('base64url');
  // base64url is URL safe. Take the first 6 characters.
  return hash.substring(0, 6);
}
