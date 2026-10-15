import express from 'express';
import { overwriteLocalSheet } from '../controllers/syncController.js';

const router = express.Router();

router.post('/overwrite', overwriteLocalSheet);

export default router;
