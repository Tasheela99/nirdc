require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const AnnouncementSchema = require('../schemas/AnnouncementSchema');
const NewsSchema = require('../schemas/NewsSchema');
const { generateUniqueSlug } = require('../utils/SlugUtil');

const migrateSlugs = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log('Connected to MongoDB');

        // Migrate Announcements
        const announcements = await AnnouncementSchema.find({ slug: { $exists: false } });
        console.log(`Found ${announcements.length} announcements without a slug.`);
        
        for (const ann of announcements) {
            const title = ann.titleEn || ann.titleSi || ann.titleTa || 'announcement';
            ann.slug = await generateUniqueSlug(AnnouncementSchema, title, ann._id);
            await ann.save();
            console.log(`Migrated announcement: ${ann._id} -> ${ann.slug}`);
        }

        // Migrate News
        const newsList = await NewsSchema.find({ slug: { $exists: false } });
        console.log(`Found ${newsList.length} news items without a slug.`);
        
        for (const news of newsList) {
            const title = news.titleEn || news.titleSi || news.titleTa || 'news';
            news.slug = await generateUniqueSlug(NewsSchema, title, news._id);
            await news.save();
            console.log(`Migrated news: ${news._id} -> ${news.slug}`);
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateSlugs();
