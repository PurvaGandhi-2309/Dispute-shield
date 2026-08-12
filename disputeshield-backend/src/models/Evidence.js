import mongoose from 'mongoose';
const evidenceSchema = new mongoose.Schema({
    disputeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dispute',
        required: true
    },
    amount: {
        type: Number,
        default: null
    },
    trackingNumber: {
        type: String,
        default: ''
    },
    shippingAddress: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zipCode: { type: String, default: '' },
        country: { type: String, default: '' }
    },
    customerIp: {
        type: String,
        default: ''
    },
    fileName: {
        type: String,
        default: ""
    },

    fileUrl: {
        type: String,
        default: ""
    },

    fileType: {
        type: String,
        default: ""
    },
    extractedText: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
export default mongoose.model('Evidence', evidenceSchema);
