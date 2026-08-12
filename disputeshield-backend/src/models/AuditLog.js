import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        disputeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dispute",
            required: true
        },

        action: {
            type: String,
            required: true
        },

        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        details: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("AuditLog", auditLogSchema);