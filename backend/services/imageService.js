const fetch = require('node-fetch');

exports.getImageForActivity = async (query) => {
    console.log('Fetching image for query:', query);
    
    if (!process.env.UNSPLASH_ACCESS_KEY) {
        console.warn('UNSPLASH_ACCESS_KEY not found in .env file');
        return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    }
    
    // Simplify the query
    const cleanQuery = query.split('.')[0]
                          .replace(/restaurant|dinner|lunch|breakfast|hotel/g, '')
                          .replace(/[^\w\s]/g, '')
                          .trim()
                          .split(' ').slice(0, 3).join(' ')
                          || 'travel';
    
    const apiUrl = `https://api.unsplash.com/search/photos?page=1&per_page=1&query=${encodeURIComponent(cleanQuery)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            console.error('Unsplash API error:', response.status, response.statusText);
            return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
        }

        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
            return data.results[0].urls.small;
        }

        return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    } catch (error) {
        console.error('Error fetching image:', error.message);
        return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    }
};