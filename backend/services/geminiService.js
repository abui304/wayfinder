// handles all interactions with the gemini api

async function generateTravelItinerary(preferences) {
    const { destincation, budgets, dayCount, activityFrequency, activityLevel } = preferences;

    // THIS IS THE PROMPT - channel our best prompt engineer
    const prompt = `Create a ${daysCount}-daytravel itinerary for a trip to ${destination}.
        The total budget for activites is around $${budget}.
        The user's preferred activity frequency is "${activityFrequency}" and activity level is "${activityLevel}".
        Given the activity frequency:
        - For 'relaxed', include 1-2 main activites per day.
        - For 'moderate', include 2-3 main activites per day.
        - For 'packed', include 3-5 main activites per day.
        Given the activity level:
        - For 'chill', include activities that involve no physical activity.
        - For 'moderate', include activities that involve some physical activity.
        - For 'active', include activities that mainly involve physical activity.
        For each activity, provide a time slot, a 1-2 sentence summary, and an estimated cost in USD.

        Please return the response as a JSON object only, with no other text before or ater it.
        The JSON object should have a single key "days", which is an array of day objects.
        Each day object should have "dayNumber" and "activities" (an array of activity objects).
        Each activity object must have "timeSlot", "summary", and "cost".

        Example format:
       {
         "days": [
           {
             "dayNumber": 1,
             "activities": [
               {
                 "timeSlot": "9:00 AM - 1:00 PM",
                 "summary": "Explore the historic city center and its famous landmarks.",
                 "cost": 25
               },
               {
                 "timeSlot": "6:00 PM - 8:00 PM",
                 "summary": "Enjoy a traditional dinner at a highly-rated local restaurant.",
                 "cost": 50
               }
             ]
           }
         ]
       }
   `;

   const systemInstruction = "You are a helpful travel assistant named Wayfinder. Your gaol is to generate detailed and personalized travel itineraries in a structured JSON format.";
   const apiKey = process.env.GEMINI_API_KEY; // api is in .env file
   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

   const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstructions: {
            parts: [{ text: systemInstruction }]
        },
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
    const generatedText = result.candidates[0].content.parts[0].text;

    // clean text to make sure is valid JSON before parsing
    const cleanedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanedText);
   } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error('Failed to generate itinerary from AI service.');
   }
}

module.exports = { generateTravelItinerary };