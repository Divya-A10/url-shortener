import { UrlShortenerForm } from '@/components/url-shortener-form';
import { UsageTips } from '@/components/usage-tips';
import Link from 'next/link';
import { Zap } from 'lucide-react'; 

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8 selection:bg-primary/30 selection:text-primary-foreground">
      <div className="w-full max-w-2xl mx-auto">
        <header className="mb-8 sm:mb-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary transition-colors duration-300 group-hover:text-primary/80">
              LINK SHORTENER
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2 text-md sm:text-lg">
            Shorten your long URLs
          </p>
        </header>

        <main className="w-full space-y-8">
          <UrlShortenerForm />
          <UsageTips />
        </main>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Link Pastel. All rights reserved.</p>
          <p className="mt-1 opacity-80">
            Note: This is a demo application. Shortened links are stored in-memory and will be lost on server restart.
          </p>
        </footer>
      </div>
    </div>
  );
}
