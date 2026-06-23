import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <div className="text-center">
                <p className=" font-semibold uppercase tracking-widest text-secondary-foreground">
                    Error 404
                </p>
                <h1 className="mt-4 text-5xl font-bold tracking-tight text-primary sm:text-6xl">
                    Page not found
                </h1>
                <p className="mt-6 text-lg leading-8 text-secondary-foreground max-w-md mx-auto">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or never existed.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button size='lg'>
                        <Link href='/dashboard/workflows'>
                            Back to dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}