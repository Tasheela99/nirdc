const mongoose = require('mongoose');

const aboutNavConfigSchema = new mongoose.Schema({
  visibility: {
    introduction: { type: Boolean, default: true },
    history: { type: Boolean, default: true },
    visionMission: { type: Boolean, default: true },
    values: { type: Boolean, default: true },
    objectives: { type: Boolean, default: true },
    responsibilities: { type: Boolean, default: true },
    functionsServices: { type: Boolean, default: true },
    directorMessage: { type: Boolean, default: true },
    team: { type: Boolean, default: true },
    organizationalStructure: { type: Boolean, default: true },
    downloads: { type: Boolean, default: true },
    reportsPublications: { type: Boolean, default: true },
    newsletters: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('AboutNavConfig', aboutNavConfigSchema);
