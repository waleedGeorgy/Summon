'use client'
import { PricingTable, useUser } from '@clerk/nextjs'
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function PricingPage() {
    const { isLoaded } = useUser();
    
    const [isMounted, setIsMounted] = useState(false);

    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    useEffect(() => {
        queueMicrotask(() => {
            setIsMounted(true);
        })
    }, []);

    if (!isMounted || !isLoaded) {
        return (
            <div className="flex flex-col">
                <h2 className="text-2xl md:px-12 px-6 mt-12">Pricing plans</h2>
                <div className="flex items-center flex-wrap gap-4 md:px-12 px-6 py-4">
                    {[...Array(2)].map((_, id) => (
                        <div className="w-150 h-75 dark:bg-sidebar bg-neutral-400 animate-pulse rounded-xl" key={id} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl md:px-12 px-6 mt-12">Pricing plans</h2>
            <div className="flex items-center flex-wrap gap-4 md:px-12 px-6 py-4">
                <PricingTable
                    appearance={{
                        variables: {
                            colorBackground: isDark
                                ? 'oklch(0.21 0.006 285.885)'
                                : 'oklch(0.98 0.001 106.423)',
                            colorPrimary: '#006045',
                        },
                        elements: {
                            featuresContainer: {
                                background: isDark
                                    ? 'oklch(0.18 0.006 285.885)'
                                    : 'oklch(0.96 0.002 106.423)',
                            },
                            featureItem: {
                                background: isDark
                                    ? 'oklch(0.18 0.006 285.885)'
                                    : 'oklch(0.96 0.002 106.423)',
                            },
                        },
                    }}
                />
            </div>
        </div>
    )
}