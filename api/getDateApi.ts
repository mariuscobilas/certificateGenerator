async function getDate(): Promise<Date> {
    const PORT = 3001;
    const SOURCE_API_URL = `http://localhost:${PORT}`;

    try {
        // 1. Await the fetch operation
        const response = await fetch(`${SOURCE_API_URL}/getDate`, {
            method: 'GET',
        });

        // Check for a non-200 status code (e.g., 404, 500)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 2. Await the JSON parsing
        const dateString = await response.json();

        // 3. Final conversion: Create and return a new Date object from the string
        return new Date(dateString);

    } catch (error) {
        // Log the error and re-throw, or handle it gracefully
        console.error("Failed to fetch date:", error);
        throw error;
    }
}