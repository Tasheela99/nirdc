const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();
const path = require('path');
const fileUpload = require('express-fileupload');


const PORT = process.env.SERVER_PORT || 3000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

const UserRoute = require('./routes/UserRoute');
const InvestmentQuestionnaireRoute = require('./routes/InvestorApplicationRoute');
const ResearchInvestmentApplicationRoute = require('./routes/ResearchInvestmentApplicationRoute');
const ResearchProposalApplicationRoute = require('./routes/ResearchProposalApplicationRoute');
const NewsRoute = require('./routes/NewsRoute');
const AnnouncementRoute = require('./routes/AnnouncementRoute');
const BlogRoute = require('./routes/BlogRoute');
const AdRoute = require('./routes/AdRoute');
const HomePageDetailsRoute = require('./routes/HomePageDetailsRoute');
const UserController = require('./controllers/UserController');
const { globalLimiter, authLimiter } = require('./utils/RateLimiterUtil');

const app = express();

app.use(globalLimiter);
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:", "*"],
            connectSrc: ["'self'", "*"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
}));
app.use(compression());
app.use(mongoSanitize()); // Prevent NoSQL injection
const UnopenedProposalsRoute = require('./routes/UnopenedProposalsRoute');
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

// Enhanced CORS configuration
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: require('os').tmpdir(),
        limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
    })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security headers (supplementary — helmet handles most)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Authorization');
    next();
});

const logger = require('./utils/LoggerUtil');
const errorHandler = require('./middleware/ErrorHandlerMiddleware');

let isDbConnected = false;
const connectDB = async () => {
    if (isDbConnected || mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(DB_CONNECTION_STRING);
        isDbConnected = true;
        logger.info('✅ MongoDB connected successfully');
        try {
            await UserController.initializeAdmin();
            logger.info('✅ Admin initialized');
        } catch (error) {
            logger.error('❌ Failed to initialize admin:', { error: error.message });
        }
    } catch (error) {
        logger.error('❌ Failed to connect to MongoDB:', { error: error.message });
        throw error;
    }
};

// Ensure DB is connected for serverless environments
app.use(async (req, res, next) => {
    await connectDB().catch(next);
    next();
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT}`);
        });
    });
}

app.use('/api/v1/users/sign-in', authLimiter);
app.use('/api/v1/users', UserRoute);
app.use('/api/v1/investment-questionnaire', InvestmentQuestionnaireRoute);
app.use('/api/v1/research-investment-questionnaire', ResearchInvestmentApplicationRoute);
app.use('/api/v1/research-proposal-questionnaire', ResearchProposalApplicationRoute);
app.use('/api/v1/news', NewsRoute);
app.use('/api/v1/announcements', AnnouncementRoute);
app.use('/api/v1/blogs', BlogRoute);
app.use('/api/v1/ads', AdRoute);
app.use('/api/v1/home-page-details', HomePageDetailsRoute);
app.use('/api/v1/proposals', UnopenedProposalsRoute);

const ReviewerConfigRoute = require('./routes/ReviewerConfigRoute');
const McqRoute = require('./routes/McqRoute');
const ReviewAssignmentRoute = require('./routes/ReviewAssignmentRoute');
const ReviewerRegistrationRoute = require('./routes/reviewerRegistrationRoutes');

app.use('/api/v1/reviewer-config', ReviewerConfigRoute);
app.use('/api/v1', McqRoute); 
app.use('/api/v1/review-assignments', ReviewAssignmentRoute);
app.use('/api/v1/reviewer-registration', ReviewerRegistrationRoute);

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
