'use client';

import { useEffect, useState } from 'react';
import { getUsageTips, type UsageTipsOutput } from '@/ai/flows/usage-tips';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';

export function UsageTips() {
  const [tips, setTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTips() {
      try {
        setIsLoading(true);
        setError(null);
        const result: UsageTipsOutput = await getUsageTips({ context: "User is on the main page of Link Pastel, a URL shortener. They might be looking for ways to best use the service, understand its limitations, or find creative uses for short URLs." });
        setTips(result.tips);
      } catch (err) {
        console.error("Failed to fetch usage tips:", err);
        setError("Could not load usage tips at this time.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTips();
  }, []);

  return (
    <Card className="w-full shadow-lg rounded-lg border-accent/50">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-accent-foreground flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          Usage Tips
        </CardTitle>
        <CardDescription className="text-foreground/70">Get the most out of Link Pastel!</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[6rem]">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {error && <p className="text-destructive font-medium">{error}</p>}
        {tips && !isLoading && (
          <div className="text-sm space-y-2 whitespace-pre-wrap text-foreground/90">{tips}</div>
        )}
      </CardContent>
    </Card>
  );
}
