import AuditLog from "../models/AuditLog.js";

export const getAuditHistory = async (req, res) => {
    try {
        const logs = await AuditLog.find({
            disputeId: req.params.id
        })
            .populate("performedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};