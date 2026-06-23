'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorProps {
    error: Error & {
        digest?: string;
        statusCode?: number;
    };
    reset: () => void;
}

function getErrorDetails(error: Error & { statusCode?: number }) {
    if (error.statusCode === 401 || error.message?.includes('unauthorized')) {
        return {
            code: '401',
            title: 'Unauthorized',
            message: 'You need to be logged in to access this resource.',
        };
    }
    if (error.statusCode === 403 || error.message?.includes('forbidden')) {
        return {
            code: '403',
            title: 'Access Denied',
            message: 'You don\'t have permission to access this resource.',
        };
    }
    if (error.statusCode === 429 || error.message?.includes('rate limit')) {
        return {
            code: '429',
            title: 'Too Many Requests',
            message: 'Please wait a moment before trying again.',
        };
    }
    return {
        code: '500',
        title: 'Something went wrong',
        message: error.message || 'An unexpected error occurred. Please try again later.',
    };
}

export default function Error({ error, reset }: ErrorProps) {
    const { code, title, message } = getErrorDetails(error);

    useEffect(() => {
        console.error('Unhandled error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center max-w-2xl mx-auto text-center">
            <p className="font-semibold uppercase tracking-widest text-destructive">
                Error {code}
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-primary sm:text-6xl">
                {title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-secondary-foreground mx-auto">
                {message}
            </p>
            {error.digest && (
                <p className="mt-2 text-sm text-muted-foreground">
                    Error ID: {error.digest}
                </p>
            )}
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size='lg' onClick={reset}>
                    Try again
                </Button>
                <Button size='lg' variant='outline'>
                    <Link href='/dashboard/workflows'>
                        Back to dashboard
                    </Link>
                </Button>
            </div>
        </div>
    );
}