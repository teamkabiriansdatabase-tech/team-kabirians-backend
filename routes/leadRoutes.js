const express = require('express');
const router = express.Router();
const { submitFreeClassLead } = require('../controllers/leadController');

router.post('/free-class', submitFreeClassLead);

module.exports = router;