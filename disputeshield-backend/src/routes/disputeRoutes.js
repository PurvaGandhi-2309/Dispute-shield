import express from 'express';
import {
    createDispute,
    getDisputes,
    getDisputeById,
    generateRebuttal,
    uploadEvidence,
    getEvidenceByDispute,
    updateDispute,
    updateDisputeStatus,
    updateDisputeDeadline,
    getDisputePriority,
    deleteDispute,
    getDisputeTimeline,
    checkDisputeConflicts,
    aiReviewDispute,
    humanReviewDispute,
    finalizeDispute
} from '../controllers/disputeController.js';
import { getAuditHistory } from "../controllers/auditController.js";
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js'; // when we add delete /orarchieve and also rout for delete
import path from 'path';
import Dispute from '../models/Dispute.js';
const router = express.Router();


// Protected routes (Requires Bearer Token)
router.post('/', protect, createDispute);
router.get('/', protect, getDisputes);
router.get('/:id', protect, getDisputeById);
router.post('/:id/upload', protect, upload.single('file'), uploadEvidence);
router.post('/:id/generate', protect, generateRebuttal);
router.get("/:id/evidence", getEvidenceByDispute);
router.put('/:id', updateDispute);
router.put('/:id/status', authMiddleware, updateDisputeStatus);
router.put('/:id/deadline', authMiddleware, updateDisputeDeadline);
router.get('/:id/priority', authMiddleware, getDisputePriority);
router.delete('/:id', authMiddleware, deleteDispute);
router.get('/:id/timeline', authMiddleware, getDisputeTimeline);
router.get('/:id/conflicts', authMiddleware, checkDisputeConflicts);
router.get("/:id/audit", getAuditHistory);
router.post("/:id/ai-review", aiReviewDispute);
router.post("/:id/finalize", finalizeDispute);

router.post("/:id/human-review", humanReviewDispute);
router.get('/:id/download-pdf', protect, async (req, res) => {
    try {
        const dispute = await Dispute.findById(req.params.id);

        if (!dispute || !dispute.pdfUrl) {
            return res.status(404).json({
                message: 'PDF not found'
            });
        }

        const filePath = path.join(
            process.cwd(),
            dispute.pdfUrl
        );

        res.download(filePath, 'rebuttal.pdf');

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

export default router;