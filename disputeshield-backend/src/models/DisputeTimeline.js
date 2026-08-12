import mongoose from 'mongoose';

const disputeTimelineSchema = new mongoose.Schema({
    disputeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dispute',
        required: true
    },

    action: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('DisputeTimeline', disputeTimelineSchema);