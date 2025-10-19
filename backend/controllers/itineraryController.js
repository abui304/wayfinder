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

exports.getLatestItinerary = async (req, res) => {
    try {
        console.log(`Fetching latest itinerary for user: ${req.user.id}`);
        
        // Find the single most recent itinerary for the logged-in user
        const latestItinerary = await Itinerary.findOne({ user: req.user.id })
            .sort({ createdAt: -1 }) // Sort by creation date descending
            .limit(1)
            .populate({
                path: 'days.activities',
                model: 'Activity',
            });

        if (!latestItinerary) {
            console.log(`No itinerary found for user: ${req.user.id}`);
            return res.status(404).json({ msg: 'No itinerary found for this user.' });
        }

        res.json(latestItinerary);
    } catch (err) {
        console.error('ERROR fetching latest itinerary:', err.message);
        res.status(500).json({ msg: 'Server Error while fetching itinerary.' });
    }
};

exports.getItineraryById = async (req, res) => {
    try {
        const itineraryId = req.params.id; // Get the ID from the URL parameter
        
        // Find the itinerary by ID and ensure it belongs to the logged-in user
        const itinerary = await Itinerary.findOne({ 
            _id: itineraryId, 
            user: req.user.id 
        }).populate({
            path: 'days.activities',
            model: 'Activity',
        });

        if (!itinerary) {
            // Use 404 if the ID doesn't exist OR if it exists but belongs to a different user
            return res.status(404).json({ msg: 'Itinerary not found or access denied.' });
        }

        res.json(itinerary);
    } catch (err) {
        // If the ID format is invalid (e.g., too short/long), MongoDB/Mongoose throws a CastError
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Invalid Itinerary ID format.' });
        }
        console.error('ERROR fetching itinerary by ID:', err.message);
        res.status(500).json({ msg: 'Server Error while fetching itinerary.' });
    }
};