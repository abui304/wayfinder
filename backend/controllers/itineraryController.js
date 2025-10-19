// logic for itinerary generation

const Itinerary = require('../models/Itinerary');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { generateTravelItinerary } = require('../services/geminiService');
const { getImageForActivity } = require('../services/imageService');

exports.generateItinerary = async (req, res) => {
    try {
        // 1. get user preferences
        const user = await User.findById(req.user.id);
        const { destination, budget, daysCount } = req.body;
        const { activityFrequency, activityLevel } = user.personality;

        // 2. call gemini service to get the itin content
        const itineraryData = await generateTravelItinerary ({
            destination,
            budget,
            daysCount,
            activityLevel,
            activityFrequency
        });

        // 3. create and save the itin and activites to the db
        let totalCost = 0;
        const newItinerary = new Itinerary({
            user: user.id,
            destination,
            budget
        });

        const savedDays = [];

        for (const day of itineraryData.days) {
            let dailyCost = 0;
            const activityDocs = [];
            for (const act of day.activities) {
                const imageUr1 = await getImageForActivity(act.summary);
                const newActivity = new Activity({
                    itinerary: newItinerary._id,
                    timeSlot: act.timeSlot,
                    summary: act.summary,
                    cost: act.cost,
                    imageUr1: imageUr1,
                });
                const savedActivity = await newActivity.save();
                activityDocs.push(savedActivity._id);
                dailyCost += savedActivity.cost;
            }
            savedDays.push({
                dayNumber: day.dayNumber,
                activities: activityDocs,
                dailyCost: dailyCost
            });
            totalCost += dailyCost;
        }

        newItinerary.days = savedDays;
        newItinerary.totalCost = totalCost;

        await newItinerary.save();

        // 4. send the created itin back to frontend
         const populatedItinerary = await Itinerary.findById(newItinerary._id).populate({
            path: 'days.activities'
        });

        res.status(201).json(populatedItinerary);
    } catch (err) {
        console.error(`Error generating itinerary:`, err);
        res.status(500).json({ msg: 'Server error while generating itinerary' });
    }
};