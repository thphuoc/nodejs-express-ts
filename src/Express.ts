import * as express from 'express'
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'
import * as compress from 'compression'
import * as methodOverride from 'method-override'
import * as cors from 'cors'
import * as helmet from 'helmet'
import * as passport from 'passport'
import {router} from './api/routers/v1'
import {logs} from './configs/vars'
import {jwt, facebook, google} from './Authentication'
import {converter, handler, notFound} from './api/middlewares/error'
/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use('jwt', jwt);
passport.use('facebook', facebook);
passport.use('google', google);

// mount api v1 routes
app.use('/v1', router);

// if error is not an instanceOf APIError, convert it.
app.use(converter);

// catch 404 and forward to error handler
app.use(notFound);

// error handler, send stacktrace only during development
app.use(handler);

export default app;
