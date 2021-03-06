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

const Game = model('Game', GameSchema);

module.exports = {
    find: (criteria) => {
        const { q, limit, page, fields, orderBy, sortBy = 1} = criteria;
        const skip = page > 1 ? (page - 1) * limit : 0;
        
        const query = Game.find();
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
    },
    store: (data) => {
        const game = new Game(data);
        return game.save();
    }, 
    update: (id, data, options = {new: true}) => {
        // return old register, consider o find and after update - options resolvereturn old register, considerating the find first and after update - options resolve
        return Game.findOneAndUpdate({ _id: id}, data, options);
    }, 
    destroy: (id) => {
        return Game.deleteOne({ _id: id });
    }
};

