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

    return res.json({ message: 'Games list', data: result});
});

router.post('/', async (req, res) => {
    const { body } = req;
    const data = await Games.store(body);

    return res.json({message: "Game stored", data: data});
});

router.put('/:id', async (req, res) => {
    const { body, params } = req;
    const { id } = params;
    const game = await Games.update(id, body);

    return res.json({message: 'Game updated', data: game});
});

router.delete('/:id', async (req, res) => {
    const { params } = req;
    const { id } = params;
    await Games.destroy(id);

    return res.json({message: "Game deleted", data: {}});
});

module.exports = router;