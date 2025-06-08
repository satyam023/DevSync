const express = require('express');
const router = express.Router();
const { requestSkillExchange, getSkillExchangeRequests, respondToSkillExchange} = require('../controllers/skillExchangeController');
const authMiddleware = require('../middleware/authMiddleware.js'); 

router.post('/request', authMiddleware, requestSkillExchange);
router.get('/get-skills', authMiddleware, getSkillExchangeRequests);
router.patch('/:exchangeId/respond', authMiddleware, respondToSkillExchange);

module.exports = router;
