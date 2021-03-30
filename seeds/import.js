const fs = require('fs');
const dotenv = require('dotenv');
const { Schema, model, connect } = require('mongoose');
dotenv.config();

// strict false allows other data besides title
const GameSchema = new Schema({ title: String }, {strict: false});
const Game = model('Game', GameSchema);

/**
 * @name Parse JSON
 * @description Parser of json to return object data or null when error
 * @param {JSON} data Object data
 * @returns {JSON} Object data | NULL
 * @author Everson F. Feltrin
 * @since 2021-03-29
 */
const parseJSON = (data) => {
    try {
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
};

/**
 * @name Connect TO DB
 * @description Connect to mongo db 
 * @returns {JSON} Mongo db connection
 * @author Everson F. Feltrin
 * @since 2021-03-29
 */
const connectToDB = () => {
    const options = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    };

    return connect(process.env.DATABASE, options);
};

/**
 * @name Read Games From File
 * @description Read file to get games data
 * @param {String} filename 
 * @returns {JSON} Games data
 * @author Everson F. Feltrin
 * @since 2021-03-29
 */
const readGamesFromFile = (filename) => {
    const promiseCallBack = (resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if(err) return reject();

            const json = parseJSON(data);
            if(!json) return reject(`Not able to parse JSON file ${filename}`);
            
            return resolve(json);
        });
    };

    return new Promise(promiseCallBack);
};

/**
 * @name Store Game
 * @description Store game in database
 * @param {JSON} data Game data
 * @author Everson F. Feltrin
 * @since 2021-03-29
 */
const storeGame = (data) => {
    const game = new Game(data);
    
    return game.save();
};

/**
 * @name import Games
 * @description Execute import to database
 * @author Everson F. Feltrin
 * @since 2021-03-29
 */
const importGames = async () => {
    await connectToDB();
    const games = await readGamesFromFile('games.json');

    for(let i=0; i < games.length; i++) {
        const game = games[i];
        
        await storeGame(game);
        console.log(game.title);
    }

    process.exit();
};

importGames();
