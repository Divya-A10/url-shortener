'use server';

import { z } from 'zod';
import { 
  generateDeterministicShortCode, 
  getShortCodeByLongUrl, 
  createUrlMapping,
  getUrlMappingByShortCode
} from '@/lib/store';
import { revalidatePath } from 'next/cache';

const CreateShortUrlSchema = z.object({
  longUrl: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)." }),
});

export interface CreateShortUrlState {
  shortCode?: string;
  error?: string;
  longUrl?: string; // To display original URL alongside the new short one
}

export async function createShortUrlAction(
  prevState: CreateShortUrlState, 
  formData: FormData
): Promise<CreateShortUrlState> {
  const validatedFields = CreateShortUrlSchema.safeParse({
    longUrl: formData.get('longUrl'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.longUrl?.[0] || "Invalid input.",
    };
  }

  const { longUrl } = validatedFields.data;

  try {
    // 1. Check if this long URL already has a short code
    const existingShortCodeForLongUrl = await getShortCodeByLongUrl(longUrl);
    if (existingShortCodeForLongUrl) {
      return { shortCode: existingShortCodeForLongUrl, longUrl };
    }

    // 2. Generate a new short code (deterministically based on longUrl)
    let newShortCode = generateDeterministicShortCode(longUrl);
    let attempt = 0;
    const maxAttempts = 10; // Max attempts to resolve collision for different long URLs mapping to the same code

    // 3. Check for collisions: if this newShortCode is already used by a *different* long URL
    let collisionMapping = await getUrlMappingByShortCode(newShortCode);
    while (collisionMapping && collisionMapping.longUrl !== longUrl && attempt < maxAttempts) {
      attempt++;
      // Add a suffix to the long URL before hashing to generate a new code
      newShortCode = generateDeterministicShortCode(longUrl, attempt.toString());
      collisionMapping = await getUrlMappingByShortCode(newShortCode);
    }

    if (collisionMapping && collisionMapping.longUrl !== longUrl && attempt >= maxAttempts) {
      // This means we couldn't find a unique short code after several attempts
      return { error: "Could not generate a unique short code due to too many collisions. Please try a different URL or try again later." };
    }
    
    // 4. Store the new mapping
    await createUrlMapping(longUrl, newShortCode);
    
    revalidatePath('/');

    return { shortCode: newShortCode, longUrl };

  } catch (e) {
    console.error("Error in createShortUrlAction:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { error: `Server error: ${errorMessage}` };
  }
}
