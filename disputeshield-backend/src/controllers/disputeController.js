// import Dispute from '../models/Dispute.js';
// import Evidence from '../models/Evidence.js';

// // @desc    Create a new dispute
// // @route   POST /api/disputes
// export const createDispute = async (req, res) => {
//     try {
//         const { chargebackId, amount, reasonCode, shippingAddress } = req.body;

//         // Check if dispute already exists
//         const existingDispute = await Dispute.findOne({ chargebackId });
//         if (existingDispute) {
//             return res.status(400).json({ message: 'Dispute with this Chargeback ID already exists' });
//         }

//         const dispute = await Dispute.create({
//             chargebackId,
//             amount,
//             reasonCode,
//             shippingAddress: shippingAddress || {}
//         });

//         res.status(201).json(dispute);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Get all disputes
// // @route   GET /api/disputes
// export const getDisputes = async (req, res) => {
//     try {
//         const disputes = await Dispute.find().sort({ createdAt: -1 });
//         res.json(disputes);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Get single dispute by ID
// // @route   GET /api/disputes/:id
// export const getDisputeById = async (req, res) => {
//     try {
//         const dispute = await Dispute.findById(req.params.id);
//         if (!dispute) {
//             return res.status(404).json({ message: 'Dispute not found' });
//         }
//         res.json(dispute);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Generate Rebuttal Letter & Calculate Win Probability
// // @route   POST /api/disputes/:id/generate
// export const generateRebuttal = async (req, res) => {
//     try {
//         const dispute = await Dispute.findById(req.params.id);
//         if (!dispute) {
//             return res.status(404).json({ message: 'Dispute not found' });
//         }

//         const evidence = await Evidence.findOne({ disputeId: dispute._id });

//         // Calculate win probability based on available evidence
//         let score = 50; // base score
//         if (evidence?.trackingNumber) score += 20;
//         if (evidence?.customerIp) score += 15;
//         if (evidence?.orderReceiptUrl) score += 15;

//         const formattedAddress = dispute.shippingAddress?.street
//             ? `${dispute.shippingAddress.street}, ${dispute.shippingAddress.city}, ${dispute.shippingAddress.state} ${dispute.shippingAddress.zipCode}`
//             : 'N/A';

//         // Generated Rebuttal Template
//         const rebuttalText = `
// DISPUTE REBUTTAL LETTER
// Chargeback ID: ${dispute.chargebackId}
// Dispute Amount: $${dispute.amount}
// Reason Code: ${dispute.reasonCode}

// To Whom It May Concern,

// We are formally contesting the chargeback for Chargeback ID ${dispute.chargebackId}.
// The transaction of $${dispute.amount} was legitimately authorized and fulfilled.

// Compelling Evidence:
// - Tracking Number: ${evidence?.trackingNumber || 'N/A'}
// - Customer IP Address: ${evidence?.customerIp || 'N/A'}
// - Shipping Address: ${formattedAddress}
// - Proof of Purchase: ${evidence?.orderReceiptUrl ? 'Attached' : 'N/A'}

// We request an immediate reversal of this chargeback based on the provided proof.

// Sincerely,
// Merchant Support Team
//     `.trim();

//         dispute.rebuttalLetterText = rebuttalText;
//         dispute.winProbabilityScore = Math.min(score, 100);
//         dispute.status = 'GENERATING';

//         await dispute.save();

//         res.json(dispute);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
import Dispute from '../models/Dispute.js';
import Evidence from '../models/Evidence.js';
import AuditLog from "../models/AuditLog.js";
import DisputeTimeline from '../models/DisputeTimeline.js';
import path from "path";
import { generateRebuttalWithAI } from "../services/aiService.js";
import {
  extractTextFromPDF,
  generateRebuttalPDF
} from "../services/pdfService.js";
// @desc    Create a new dispute
// @route   POST /api/disputes
export const createDispute = async (req, res) => {
  try {
    const {
      chargebackId,
      amount,
      reasonCode,
      shippingAddress
    } = req.body;

    // Check if dispute already exists
    const existingDispute = await Dispute.findOne({ chargebackId });

    if (existingDispute) {
      return res.status(400).json({
        message: 'Dispute with this Chargeback ID already exists'
      });
    }

    // Create dispute
    const dispute = await Dispute.create({
      chargebackId,
      amount,
      reasonCode,
      shippingAddress: shippingAddress || {}
    });
    await DisputeTimeline.create({
      disputeId: dispute._id,
      action: 'DISPUTE_CREATED',
      description: 'Dispute was created'
    });

    res.status(201).json(dispute);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Get all disputes
export const getDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find().sort({ createdAt: -1 });
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single dispute by ID
export const getDisputeById = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }
    res.json(dispute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Rebuttal Letter & Calculate Win Probability
export const generateRebuttal = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    // const evidence = await Evidence.findOne({ disputeId: dispute._id });
    const evidence = await Evidence.find({ disputeId: dispute._id });

    // Calculate win score based on received webhook evidence

    // if (evidence?.trackingNumber) score += 20;
    // if (evidence?.customerIp) score += 15;
    // if (evidence?.orderReceiptUrl) score += 15;
    let score = 50;

    if (evidence.some(e => e.trackingNumber)) score += 20;
    if (evidence.some(e => e.customerIp)) score += 15;
    // if (evidence.some(e => e.orderReceiptUrl)) score += 15;

    const formattedAddress = dispute.shippingAddress?.street
      ? `${dispute.shippingAddress.street}, ${dispute.shippingAddress.city}, ${dispute.shippingAddress.state} ${dispute.shippingAddress.zipCode}`
      : 'N/A';

    const rebuttalText = await generateRebuttalWithAI(
      dispute,
      evidence
    );

    const pdfFileName = `rebuttal-${dispute._id}-${Date.now()}.pdf`;
    const pdfPath = path.join(process.cwd(), "uploads", pdfFileName);

    await generateRebuttalPDF(rebuttalText, pdfPath);

    dispute.pdfUrl = `/uploads/${pdfFileName}`;

    dispute.rebuttalLetterText = rebuttalText;
    dispute.winProbabilityScore = Math.min(score, 100);
    dispute.status = 'GENERATING';



    await dispute.save();
    await DisputeTimeline.create({
      disputeId: dispute._id,
      action: 'REBUTTAL_GENERATED',
      description: 'AI generated a rebuttal letter'
    });

    res.json(dispute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc Upload evidence file
// @route POST /api/disputes/:id/upload
// 
export const uploadEvidence = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: 'Dispute not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    // Get evidence details sent by merchant
    const {
      trackingNumber,
      customerIp,
      shippingAddress,
      amount
    } = req.body;

    console.log("REQ.BODY:", req.body);
    console.log("AMOUNT:", amount);

    // Extract text only if uploaded file is PDF
    let extractedText = '';

    if (req.file.mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(req.file.path);
    }

    const evidence = await Evidence.create({
      disputeId: dispute._id,
      amount: amount || null,

      trackingNumber: trackingNumber || '',
      customerIp: customerIp || '',

      shippingAddress: shippingAddress
        ? JSON.parse(shippingAddress)
        : {},

      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,

      // Store extracted PDF text
      extractedText
    });
    await AuditLog.create({
      disputeId: dispute._id,
      action: "EVIDENCE_UPLOADED",
      performedBy: req.user?._id,
      details: `Evidence uploaded: ${req.file.originalname}`
    });

    await DisputeTimeline.create({
      disputeId: dispute._id,
      action: 'EVIDENCE_UPLOADED',
      description: `Evidence file ${req.file.filename} was uploaded`
    });

    res.status(201).json({
      message: 'Evidence uploaded successfully',
      evidence
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// export const getEvidenceByDispute = async (req, res) => {
//   try {
//     const evidence = await Evidence.find({
//       disputeId: req.params.id
//     });

//     res.status(200).json(
//       evidence.map(e => ({
//         _id: e._id,
//         fileName: e.fileName,
//         fileUrl: e.fileUrl,
//         fileType: e.fileType,
//         // amount: e.amount
//         amount: item.amount,
//         trackingNumber: item.trackingNumber,
//         customerIp: item.customerIp,
//         createdAt: item.createdAt,
//       }))
//     );

//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching evidence",
//       error: error.message
//     });
//   }
// };
export const getEvidenceByDispute = async (req, res) => {
  try {
    const evidence = await Evidence.find({
      disputeId: req.params.id
    });

    res.status(200).json(
      evidence.map(e => ({
        _id: e._id,
        fileName: e.fileName,
        fileUrl: e.fileUrl,
        fileType: e.fileType,
        fileSize: e.fileSize,
        amount: e.amount,
        trackingNumber: e.trackingNumber,
        customerIp: e.customerIp,
        createdAt: e.createdAt,
      }))
    );

  } catch (error) {
    res.status(500).json({
      message: "Error fetching evidence",
      error: error.message
    });
  }
};

// @desc    Update a dispute
// @route   PUT /api/disputes/:id
export const updateDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: 'Dispute not found'
      });
    }

    const {
      amount,
      reasonCode,
      shippingAddress
    } = req.body;

    if (amount !== undefined) {
      dispute.amount = amount;
    }

    if (reasonCode !== undefined) {
      dispute.reasonCode = reasonCode;
    }

    if (shippingAddress !== undefined) {
      dispute.shippingAddress = shippingAddress;
    }

    await dispute.save();

    res.status(200).json({
      message: 'Dispute updated successfully',
      dispute
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//updateDisputStatus
// @desc    Update dispute status
// @route   PUT /api/disputes/:id/status
export const updateDisputeStatus = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: 'Dispute not found'
      });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: 'Status is required'
      });
    }

    const allowedStatuses = [
      'NEEDS_EVIDENCE',
      'UNDER_REVIEW',
      'GENERATING',
      'REBUTTAL_READY',
      'SUBMITTED',
      'WON',
      'LOST'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      });
    }

    dispute.status = status;

    await dispute.save();

    await DisputeTimeline.create({
      disputeId: dispute._id,
      action: 'STATUS_CHANGED',
      description: `Status changed to ${status}`
    });

    res.status(200).json({
      message: 'Dispute status updated successfully',
      status: dispute.status
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//deadline
// @desc    Update dispute deadline
// @route   PUT /api/disputes/:id/deadline
export const updateDisputeDeadline = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: 'Dispute not found'
      });
    }

    const { deadline } = req.body;

    if (!deadline) {
      return res.status(400).json({
        message: 'Deadline is required'
      });
    }

    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid deadline'
      });
    }

    dispute.deadline = deadlineDate;

    await dispute.save();
    await DisputeTimeline.create({
      disputeId: dispute._id,
      action: 'DEADLINE_SET',
      description: `Deadline set to ${deadlineDate.toISOString()}`
    });

    res.status(200).json({
      message: 'Deadline updated successfully',
      deadline: dispute.deadline
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
//diputePriority
// @desc    Get dispute priority
// @route   GET /api/disputes/:id/priority
export const getDisputePriority = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: 'Dispute not found'
      });
    }

    if (!dispute.deadline) {
      return res.status(200).json({
        priority: 'NO_DEADLINE',
        message: 'No deadline set for this dispute'
      });
    }

    const now = new Date();
    const deadline = new Date(dispute.deadline);

    const timeDifference = deadline - now;
    const daysRemaining = Math.ceil(
      timeDifference / (1000 * 60 * 60 * 24)
    );

    let priority;

    if (daysRemaining < 0) {
      priority = 'OVERDUE';
    } else if (daysRemaining <= 1) {
      priority = 'HIGH';
    } else if (daysRemaining <= 3) {
      priority = 'MEDIUM';
    } else {
      priority = 'LOW';
    }

    res.status(200).json({
      priority,
      daysRemaining
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// @desc    Archive a dispute
// @route   DELETE /api/disputes/:id
export const deleteDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: 'Dispute not found'
      });
    }

    dispute.isArchived = true;

    await dispute.save();

    res.status(200).json({
      message: 'Dispute archived successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// timeline we add and also imort it from models
// @desc Get dispute timeline
// @route GET /api/disputes/:id/timeline
export const getDisputeTimeline = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: 'Dispute not found'
      });
    }

    const timeline = await DisputeTimeline.find({
      disputeId: dispute._id
    }).sort({ createdAt: -1 });

    res.status(200).json(timeline);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// @desc    Check dispute for conflicts
// @route   GET /api/disputes/:id/conflicts
export const checkDisputeConflicts = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);


    if (!dispute) {
      return res.status(404).json({
        message: 'Dispute not found'
      });
    }


    const evidence = await Evidence.find({
      disputeId: dispute._id

    });


    const conflicts = [];

    evidence.forEach(e => {
      if (
        e.amount !== null &&
        e.amount !== undefined &&
        Number(e.amount) !== Number(dispute.amount)
      ) {
        conflicts.push({
          type: 'AMOUNT_CONFLICT',
          disputeAmount: dispute.amount,
          evidenceAmount: e.amount,
          evidenceFile: e.fileName
        });
      }
    });

    res.status(200).json({
      hasConflict: conflicts.length > 0,
      conflicts
    });



  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const aiReviewDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: "Dispute not found"
      });
    }

    // Simple AI-style recommendation for now
    const recommendation = "REVIEW";

    dispute.aiRecommendation = recommendation;

    await dispute.save();
    await AuditLog.create({
      disputeId: dispute._id,
      action: "AI_RECOMMENDATION",
      performedBy: req.user?._id,
      details: `AI recommendation: ${recommendation}`
    });

    res.status(200).json({
      message: "AI review completed",
      aiRecommendation: recommendation
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const humanReviewDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: "Dispute not found"
      });
    }

    const { decision } = req.body;

    if (!["APPROVE", "REJECT"].includes(decision)) {
      return res.status(400).json({
        message: "Decision must be APPROVE or REJECT"
      });
    }

    dispute.humanDecision = decision;
    dispute.humanReviewedAt = new Date();

    await dispute.save();
    await AuditLog.create({
      disputeId: dispute._id,
      action: "HUMAN_REVIEWED",
      performedBy: req.user?._id,
      details: `Human decision: ${decision}`
    });

    res.status(200).json({
      message: "Human review completed",
      humanDecision: decision,
      humanReviewedAt: dispute.humanReviewedAt
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
//final decision
export const finalizeDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: "Dispute not found"
      });
    }

    const { decision, reason } = req.body;

    if (!["MERCHANT_WON", "MERCHANT_LOST"].includes(decision)) {
      return res.status(400).json({
        message: "Invalid final decision"
      });
    }

    dispute.finalDecision = decision;
    dispute.finalDecisionReason = reason || null;
    dispute.finalDecisionAt = new Date();
    
    if (decision === "MERCHANT_WON") {
        dispute.status = "WON";
    } else if (decision === "MERCHANT_LOST") {
        dispute.status = "LOST";
    } else {
        dispute.status = "SUBMITTED";
    }
    
    await dispute.save();

    res.status(200).json({
      message: "Dispute finalized",
      finalDecision: dispute.finalDecision,
      reason: dispute.finalDecisionReason,
      finalDecisionAt: dispute.finalDecisionAt
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
