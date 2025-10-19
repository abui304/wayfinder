// logic for itinerary generation

const Itinerary = require('../models/Itinerary');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { generateTravelItinerary } = require('../services/geminiService');
const { getImageForActivity } = require('../services/imageService');

exports.generateItinerary = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { destination, budget, daysCount } = req.body;
        const { activityFrequency, activityLevel } = user.personality;

        const itineraryData = await generateTravelItinerary ({
            destination,
            budget,
            daysCount,
            activityLevel,
            activityFrequency
        });

        let totalCost = 0;
        const newItinerary = new Itinerary({
            user: user.id,
            destination,
            budget,
            daysCount
        });

        const dayPromises = itineraryData.days.map(async (day, dayIndex) => {
            let dailyCost = 0;
            
            const activityDocs = await Promise.all(day.activities.map(async (act, actIndex) => {
                
                if (!act.name || !act.summary || !act.timeSlot || act.cost === undefined) {
                    console.warn(`Skipping activity ${dayIndex + 1}-${actIndex + 1} due to missing required fields.`, act);
                    return null; 
                }
                const costValue = Number(String(act.cost).replace(/[^0-9.]/g, '')) || 0; 
                const imageUrl = await getImageForActivity(act.summary); 

                const newActivity = new Activity({
                    itinerary: newItinerary._id,
                    name: act.name,
                    timeSlot: act.timeSlot,
                    summary: act.summary,
                    cost: costValue, 
                    location: act.location || "",
                    imageUrl: imageUrl, 
                });

                const savedActivity = await newActivity.save();
                dailyCost += savedActivity.cost;
                return savedActivity._id; 
            }));

            const validActivities = activityDocs.filter(id => id !== null);

            return {
                dayNumber: day.dayNumber,
                activities: validActivities, 
                dailyCost: dailyCost
            };
        });
        
        const savedDaysResults = await Promise.all(dayPromises);
        
        const savedDays = savedDaysResults.map(dayResult => {
            totalCost += dayResult.dailyCost;
            return dayResult;
        }).sort((a, b) => a.dayNumber - b.dayNumber);

        newItinerary.days = savedDays;
        newItinerary.totalCost = totalCost;

        await newItinerary.save(); 
        console.log('Main Itinerary document saved successfully.');
         const populatedItinerary = await Itinerary.findById(newItinerary._id).populate({
            path: 'days.activities',
            model: 'Activity',
        });

        res.status(201).json(populatedItinerary);
    } catch (err) {
        console.error('--- ITINERARY GENERATION FAILED ---');
        console.error(`Error name: ${err.name}`);
        console.error(`Error message: ${err.message}`);
        console.error(`Full Error Object:`, err);
        
        const status = err.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({ msg: `Server error while generating itinerary: ${err.message}` });
    }
};