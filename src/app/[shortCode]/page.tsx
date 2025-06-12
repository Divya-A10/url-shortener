import { getUrlMappingByShortCode } from '@/lib/store';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

type Props = {
  params: { shortCode: string };
};

export default async function ShortCodeRedirectPage({ params }: Props) {
  const { shortCode } = params;

  // Validate shortCode: 1-10 chars, alphanumeric, underscore, hyphen.
  // Current generator makes 6 char base64url codes (alphanumeric, -, _).
  if (!shortCode || typeof shortCode !== 'string' || !/^[a-zA-Z0-9_-]{1,10}$/.test(shortCode)) {
    notFound(); 
  }
  
  // Prevent common non-shortcode paths from hitting the store
  if (shortCode.includes('.') || ['api', 'public', '_next', 'static', 'favicon'].includes(shortCode.toLowerCase())) {
    notFound();
  }

  const mapping = await getUrlMappingByShortCode(shortCode);

  if (mapping && mapping.longUrl) {
    redirect(mapping.longUrl);
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <div className="max-w-md">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-4">Link Not Found</h1>
          <p className="text-muted-foreground mb-2">
            Oops! The short link you tried to access doesn't seem to exist or may have expired.
          </p>
          <p className="text-muted-foreground mb-8">
            The code <code className="bg-secondary p-1 rounded-md text-secondary-foreground font-mono">{shortCode}</code> did not match any of our records.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
            <Link href="/">Create a New Short Link</Link>
          </Button>
        </div>
      </div>
    );
  }
}
