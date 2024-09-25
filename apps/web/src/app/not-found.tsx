import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-8 text-center text-[#7f7ff5]">
        <h1 className="mb-4 text-4xl font-bold tracking-tighter text-primary md:text-6xl">
          404 - Page Not Found
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button asChild size="lg">
          <Link  href="/"
           className="inline-flex h-10 items-center justify-center rounded-md bg-[#7f7ff5] text-white bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >Go Back Home</Link>
        </Button>
      </main>
    </div>
  );
};

export default NotFound;