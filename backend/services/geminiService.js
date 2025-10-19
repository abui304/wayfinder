// handles all interactions with the gemini api

async function generateTravelItinerary(preferences) {
    const { destination, budget, daysCount, activityFrequency, activityLevel } = preferences;

    const modelName = 'gemini-2.5-flash';
    const apiKey = process.env.GEMINI_API_KEY; // api is in .env file
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // THIS IS THE PROMPT - channel our best prompt engineer
    const prompt = `Create a ${daysCount}-daytravel itinerary for a trip to ${destination}.
        The total budget for activites is around $${budget}.
        The user's preferred activity frequency is "${activityFrequency}" and activity level is "${activityLevel}".
        Given the activity frequency:
        - For 'relaxed', include 3-4 main activites per day.
        - For 'moderate', include 5-6 main activites per day.
        - For 'packed', include 7-8 main activites per day.
        Given the activity level:
        - For 'chill', include activities that involve no physical activity.
        - For 'moderate', include activities that involve some physical activity.
        - For 'active', include activities that mainly involve physical activity.
        For each activity, provide a time slot, a 1-2 sentence summary, and an estimated cost in USD.

        Please return the response as a JSON object only, with no other text before or ater it.
        The JSON object should have a single key "days", which is an array of day objects.
        Each day object should have "dayNumber" and "activities" (an array of activity objects).
        Each activity object must have "name" (a short, catchy title like "Eiffel Tower"), "timeSlot", "summary" (a 1-2 sentence description), "cost", and "location".

        Example format:
       {
         "days": [
           {
             "dayNumber": 1,
             "activities": [
               {
                 "name": "City Center",
                 "timeSlot": "9:00 AM - 1:00 PM",
                 "summary": "Explore the historic city center and its famous landmarks.",
                 "cost": 25,
                 "location": "Plaza Mayor, 28012 Madrid, Spain"
               },
               {
                 "name": "Dinner at <RESTAURANT NAME>",
                 "timeSlot": "6:00 PM - 8:00 PM",
                 "summary": "Enjoy a traditional dinner at a highly-rated local restaurant.",
                 "cost": 50,
                 "location": "Plaza Mayor, 28012 Madrid, Spain"
               }
             ]
           }
         ]
       }
   `;

    const systemInstruction = "You are a helpful travel assistant named Wayfinder. Your gaol is to generate detailed and personalized travel itineraries in a structured JSON format.";
   

// backend/services/geminiService.js (FINAL CORRECT PAYLOAD FOR v1 REST API)

    const payload = {
        contents: [
            {
            role: "user",
            parts: [{ text: prompt }]
            }
        ],

        // system instruction at top level
        system_instruction: {
            role: "system",
            parts: [{ text: systemInstruction }]
        },

        generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.7,
        }
    };

   try {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API call failed with status ${response.status}: ${errorBody}`);
    }

    const result = await response.json();
    if (!result.candidates || !result.candidates[0].content || !result.candidates[0].content.parts[0]) {
        throw new Error('Invalid response structure from Gemini API');
    }
    const generatedText = result.candidates[0].content.parts[0].text;

    return JSON.parse(generatedText);
   } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error('Failed to generate itinerary from AI service.');
   }
}

module.exports = { generateTravelItinerary };