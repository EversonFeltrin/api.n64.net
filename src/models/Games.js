const { Schema, model } = require('mongoose');

const GameSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        otherTitles: [String],
        developers: [String],
        publishers: [String],
        genres: [String],
        firstRelease: Date,
        japanRelease: Date,
        usaRelease: Date,
        euroRelease: Date
    }, 
    {
        collections: 'games', 
        strict: false
    }
);

const game = model('Game', GameSchema);

module.exports = {
    find: (criteria) => {
        const { q, limit, page, fields, orderBy, sortBy = 1} = criteria;
        const skip = page > 1 ? (page - 1) * limit : 0;
        
        const query = game.find();
        // search query
        if (q) {
            const regex = new RegExp(`.*${q}.*`, 'i');            
            const searchQuery = {
                $or: [
                    {title: regex},
                    {otherTitle: regex},
                    {publishers: regex},
                    {developers: regex},
                ]
            };

            query.find(searchQuery);
        }
        if (limit) query.limit(limit);
        if(page) query.skip(skip);
        if(fields) query.select(fields.split(','));
        // consider the field(orderBy) in order asc or desc (sortBy)
        if(orderBy) query.sort({[orderBy]: sortBy});

        return query.exec();
    }
};

