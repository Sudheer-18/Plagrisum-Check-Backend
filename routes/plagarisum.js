const express = require('express');
const router = express.Router();
const { checkPlagiarism, checkAllPlagiarism } = require('../Controller/plagarisum');

router.post('/check', checkPlagiarism);

router.get('/check-all', checkAllPlagiarism);

module.exports = router;
