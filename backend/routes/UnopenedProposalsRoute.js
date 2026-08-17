const express = require('express');
const router = express.Router();
const { getUnopenedProposalsCount } = require('../controllers/UnopenedProposalsController');

// GET /api/proposals/unopened-count
router.get('/unopened-count', getUnopenedProposalsCount);

module.exports = router;
