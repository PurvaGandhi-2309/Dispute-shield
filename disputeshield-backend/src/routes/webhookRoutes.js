import express from 'express';
import { handleDisputeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Public webhook route for payment processor notifications (e.g., Stripe, Shopify)
router.post('/dispute', handleDisputeWebhook);

export default router;