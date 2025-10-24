'use client'

import { useState, useEffect } from 'react';

export default function Home() {
    // 1. Use state to hold the date, initializing with a default or 'Loading...'
    const [date, setDate] = useState<Date | string>('Loading...');

    // 2. useEffect is used to handle side effects like fetching data and setting intervals
    useEffect(() => {
        const fetchAndSetDate = async () => {
            try {
                const fetchedDate = await getDate();
                setDate(fetchedDate);
            } catch (error) {
                console.error("Error fetching date:", error);
                setDate(new Date()); // Fallback to client's time on error
            }
        };

        // Fetch immediately on mount
        fetchAndSetDate();

        // 3. Set up the interval to run every 5 seconds (for example)
        const intervalId = setInterval(fetchAndSetDate, 1000);

        // 4. Clean-up function: This runs when the component is unmounted
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this runs only once on mount

    // Convert the date state to a display string
    const dateString = (date instanceof Date)
        ? date.toLocaleTimeString('en-US', {
            timeZone: 'Europe/Bucharest',
            timeStyle: "medium"
        })
        : date; // Will display "Loading..." or "Error..." if it's a string

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1 className="text-xl">
                {dateString}
            </h1>
        </div>
    );
}