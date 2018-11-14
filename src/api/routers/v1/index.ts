import * as express from 'express';
import authRouter from './auth.route';

export const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/docs', express.static('docs'));

router.use('/auth', authRouter);
