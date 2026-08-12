import mongoose from 'mongoose';
const disputeSchema = new mongoose.Schema({
    chargebackId: {
        type: String,
        required: [true, 'Chargeback ID is required'],
        unique: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    reasonCode: {
        type: String,
        required: [true, 'Reason code is required']
    },
    status: {
        type: String,
        enum: [
            'NEEDS_EVIDENCE',
            'UNDER_REVIEW',
            'GENERATING',
            'REBUTTAL_READY',
            'SUBMITTED',
            'WON',
            'LOST'
        ],
        default: 'NEEDS_EVIDENCE'
    },
    shippingAddress: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zipCode: { type: String, default: '' },
        country: { type: String, default: '' }
    },
    winProbabilityScore: {
        type: Number,
        default: 0
    },
    rebuttalLetterText: {
        type: String,
        default: ''
    },
    pdfUrl: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date,
        default: null
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    aiRecommendation: {
        type: String,
        enum: ["APPROVE", "REJECT", "REVIEW"],
        default: "REVIEW"
    },

    humanDecision: {
        type: String,
        enum: ["APPROVE", "REJECT"],
        default: null
    },

    humanReviewedAt: {
        type: Date,
        default: null
    },
    finalDecision: {
        type: String,
        enum: ["MERCHANT_WON", "MERCHANT_LOST", "RESOLVED"],
        default: null
    },

    finalDecisionReason: {
        type: String,
        default: null
    },

    finalDecisionAt: {
        type: Date,
        default: null
    }
});

export default mongoose.model('Dispute', disputeSchema);