const mongoose = require('mongoose');

const HomePageDetailsSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
    titleTexts: {type: [String], required: false},
    firstBannerImages: {type: [String], required: false},
    visionSectionTitle: {type: String, required: false},
    visionSectionContent: {type: String, required: false},
    missionSectionTitle: {type: String, required: false},
    missionSectionContent: {type: String, required: false},
    gapFillingSectionTitle: {type: String, required: false},
    gapFillingSectionContent: {type: String, required: false},
    matchInvestorsSectionTitle: {type: String, required: false},
    matchInvestorsSectionContent: {type: String, required: false},
    disseminateSectionTitle: {type: String, required: false},
    disseminateSectionContent: {type: String, required: false},
    valuesSectionTitle: {type: String, required: false},
    valuesSectionContent: {type: String, required: false},
    secondBannerImages: {type: [String], required: false},
    secondBannerContent: {type: [String], required: false},
    aboutUsSectionTitle: {type: String, required: false},
    aboutUsSectionImages: {type: [String], required: false},
    aboutUsSectionContent: {type: String, required: false},
    activeState: {type: Boolean, default: true},

}, {timestamps: true});

module.exports = mongoose.model('HomePageDetails', HomePageDetailsSchema);
