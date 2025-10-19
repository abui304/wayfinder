// We fetch images from Unsplash API
const fetch = require('node-fetch');

exports.getImageForActivity = async (query) => {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
        console.warn('UNSPLASH_ACCESS_KEY not found in .env file. Skipping image fetch.');
        return '';
    }

    const apiUrl = `https://api.unsplash.com/search/photos?page=1&per_page=1&query=${encodeURIComponent(query)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error(`Unsplash API error: ${response.status} ${response.statusText}`);
            return '';
        }

        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
            return data.results[0].urls.small;
        }

        return '';
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error.message);
        return '';
    }
};