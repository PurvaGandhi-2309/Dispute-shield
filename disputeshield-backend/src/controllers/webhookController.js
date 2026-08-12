import Dispute from '../models/Dispute.js';
import Evidence from '../models/Evidence.js';

// @desc    Handle incoming dispute webhooks (e.g., Stripe/Shopify)
// @route   POST /api/webhooks/dispute
export const handleDisputeWebhook = async (req, res) => {
  try {
    const {
      chargebackId,
      amount,
      reasonCode,
      shippingAddress,
      trackingNumber,
      customerIp,
      orderReceiptUrl
    } = req.body;

    if (!chargebackId) {
      return res.status(400).json({ message: 'Missing chargebackId in webhook payload' });
    }

    // 1. Create or update Dispute
    let dispute = await Dispute.findOne({ chargebackId });

    if (!dispute) {
      dispute = await Dispute.create({
        chargebackId,
        amount,
        reasonCode,
        shippingAddress: shippingAddress || {},
        status: 'NEEDS_EVIDENCE'
      });
    }

    // 2. Create or update Evidence linked to this Dispute
    let evidence = await Evidence.findOne({ disputeId: dispute._id });

    if (evidence) {
      if (trackingNumber) evidence.trackingNumber = trackingNumber;
      if (customerIp) evidence.customerIp = customerIp;
      if (orderReceiptUrl) evidence.orderReceiptUrl = orderReceiptUrl;
      if (shippingAddress) evidence.shippingAddress = shippingAddress;
      await evidence.save();
    } else {
      await Evidence.create({
        disputeId: dispute._id,
        trackingNumber: trackingNumber || '',
        customerIp: customerIp || '',
        orderReceiptUrl: orderReceiptUrl || '',
        shippingAddress: shippingAddress || {}
      });
    }

    // Acknowledge receipt to the webhook sender
    res.status(200).json({ received: true, disputeId: dispute._id });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ message: 'Webhook handler failed', error: error.message });
  }
};