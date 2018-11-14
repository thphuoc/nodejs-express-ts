import {ExtractJwt} from 'passport-jwt';
import * as mongoose from 'mongoose';
import {env, mongo} from './configs/vars';

// Exit application on error
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
    mongoose.set('debug', true);
}

export const connectMongoDb = () => {
    mongoose.connect(mongo.uri, {
        keepAlive: 1,
        useMongoClient: true,
    });
    return mongoose.connection;
}
