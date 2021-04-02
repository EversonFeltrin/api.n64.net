const express = require('express');
const Games = require('../models/Games');
const router = express.Router();

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

router.get('/', async (req, res) => {
    // GET URL PARAMETERS
    const { limit, pages, fields, orderBy, sortBy, q} = req.query;

    // MANAGE REQUEST CONSULTATION PARAMETERS TO PASS ON THE MODEL
    const criteria = {
        limit: Number(limit) || DEFAULT_LIMIT,
        page: Number(pages) || DEFAULT_PAGE,
        fields: fields || null,
        orderBy: orderBy || 'title',
        // 1 - asc | -1 - desc
        sortBy: sortBy !== undefined ? Number(sortBy) : 1, 
        q: q || ''
    }
    // FIND IN DATABASE
    const result = await Games.find(criteria);

    return res.json({ message: 'games OK', data: result});
});


module.exports = router;