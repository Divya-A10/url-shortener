'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createShortUrlAction, type CreateShortUrlState } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useEffect, useState, useRef } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-150 ease-in-out hover:shadow-lg active:scale-95">
      {pending ? 'Shortening...' : 'Shorten URL'}
    </Button>
  );
}

export function UrlShortenerForm() {
  const initialState: CreateShortUrlState = {};
  const [state, formAction] = useFormState(createShortUrlAction, initialState);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [originUrl, setOriginUrl] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (state.shortCode && state.longUrl && originUrl) {
      setShortenedUrl(`${originUrl}/${state.shortCode}`);
       if (!state.error && formRef.current) {
         // formRef.current.reset(); // Uncomment to reset form fields on successful new shortlink creation
       }
    } else if (!state.shortCode) { 
        setShortenedUrl(null);
    }
  }, [state, originUrl]);

  const handleCopy = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl).then(() => {
        setCopied(true);
        toast({ title: "Copied!", description: "Shortened URL copied to clipboard." });
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        toast({ variant: "destructive", title: "Error", description: "Failed to copy URL." });
      });
    }
  };

  return (
    <Card className="w-full shadow-xl rounded-lg border-accent/50">
      <CardHeader className="pb-4">
        <CardTitle className="font-headline text-2xl text-primary">Create a Short Link</CardTitle>
        <CardDescription className="text-foreground/70">Enter your long URL below to generate a pastel-short link!</CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="longUrl" className="text-foreground/80 font-medium">Long URL</Label>
            <Input
              id="longUrl"
              name="longUrl"
              type="url"
              placeholder="https://example.com/very-long-url-to-shorten"
              required
              className="border-accent focus:border-primary focus:ring-primary/50 transition-colors duration-150 ease-in-out"
              aria-describedby={state.error ? "longUrl-error" : undefined}
            />
          </div>
          {state.error && <p id="longUrl-error" className="text-sm text-destructive font-medium">{state.error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-2 pb-6 px-6">
          <SubmitButton />
        </CardFooter>
      </form>
      {shortenedUrl && (
        <CardContent className="mt-0 pt-0 pb-6 px-6">
          <div className="mt-1 p-4 border border-primary/30 rounded-md bg-primary/10 shadow-sm">
            <p className="text-sm text-primary/80 font-medium">Your shortened URL:</p>
            <div className="flex items-center justify-between gap-2 mt-1">
              <Link href={shortenedUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline break-all text-lg flex items-center gap-1.5 group">
                {shortenedUrl.replace(/^https?:\/\//, '')} 
                <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy shortened URL" className="text-primary hover:bg-primary/20">
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Original: <span className="break-all opacity-80">{state.longUrl}</span>
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
