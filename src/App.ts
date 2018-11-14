// make bluebird default Promise
import {env, port} from './configs/vars';
import app from './Express';
import {connectMongoDb} from './Mongoose';

// open mongoose connection
connectMongoDb();

// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));
