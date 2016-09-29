import * as mongoose from 'mongoose';

(<any>mongoose).Promise = global.Promise;
mongoose.connect('mongodb://localhost/myMongo');

/**
 * connect mongodb
 */
export const mongodb = mongoose;