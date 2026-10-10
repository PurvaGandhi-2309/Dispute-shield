import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "./Evidence.css";
import "./Dashboard.css";
import Sidebar from '../components/Sidebar';
import { FolderOpen, CheckCircle, Zap, AlertTriangle } from 'lucide-react';

function getFileTypeLabel(fileType) {
    if (!fileType) return "FILE";

    const upper = fileType.toUpperCase();

    if (upper.includes("PDF")) return "PDF";

    if (
        upper.includes("PNG") ||
        upper.includes("JPG") ||
        upper.includes("JPEG") ||
        upper.includes("IMAGE")
    ) {
        return "IMG";
    }

    if (upper.includes("CSV")) return "CSV";
    if (upper.includes("DOC")) return "DOC";

    return upper.slice(0, 4);
}

function getFileTypeClass(fileType) {
    if (!fileType) return "ev-ft-file";

    const upper = fileType.toUpperCase();

    if (upper.includes("PDF")) return "ev-ft-pdf";

    if (
        upper.includes("PNG") ||
        upper.includes("JPG") ||
        upper.includes("JPEG") ||
        upper.includes("IMAGE")
    ) {
        return "ev-ft-img";
    }

    if (upper.includes("CSV")) return "ev-ft-csv";
    if (upper.includes("DOC")) return "ev-ft-doc";

    return "ev-ft-file";
}

function Evidence() {

    const [disputes, setDisputes] = useState([]);
    const [evidenceByDispute, setEvidenceByDispute] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    // Which dispute is expanded
    const [expandedDispute, setExpandedDispute] = useState(null);

    // Which dispute has upload box open
    const [uploadingDispute, setUploadingDispute] = useState(null);

    // Selected files for each dispute
    const [selectedFiles, setSelectedFiles] = useState({});

    // console.log("EVIDENCE DATA:", evidenceByDispute);
    // ─────────────────────────────────────
    // FETCH DISPUTES
    // ─────────────────────────────────────

    useEffect(() => {

        const fetchDisputes = async () => {

            try {

                const data = await apiRequest("/disputes");

                setDisputes(data);

            } catch (error) {

                console.error(
                    "Failed to fetch disputes:",
                    error
                );

            }

        };

        fetchDisputes();

    }, []);


    // ─────────────────────────────────────
    // FETCH EVIDENCE
    // ─────────────────────────────────────

    useEffect(() => {

        if (disputes.length === 0) return;

        const fetchAllEvidence = async () => {

            const evidenceMap = {};

            for (const dispute of disputes) {

                try {

                    const data = await apiRequest(
                        `/disputes/${dispute._id}/evidence`
                    );

                    evidenceMap[dispute._id] = data;

                } catch (error) {

                    console.error(
                        `Failed to fetch evidence for ${dispute._id}:`,
                        error
                    );

                    evidenceMap[dispute._id] = [];

                }

            }

            setEvidenceByDispute(evidenceMap);

        };

        fetchAllEvidence();

    }, [disputes]);


    // ─────────────────────────────────────
    // SELECT FILES
    // ─────────────────────────────────────

    const handleFileSelect = (disputeId, files) => {

        if (!files) return;

        const fileArray = Array.from(files);

        const maxSize = 25 * 1024 * 1024;

        const validFiles = fileArray.filter((file) => {

            if (file.size > maxSize) {

                alert(
                    `${file.name} is larger than 25 MB.`
                );

                return false;
            }

            return true;

        });

        setSelectedFiles((prev) => ({

            ...prev,

            [disputeId]: [
                ...(prev[disputeId] || []),
                ...validFiles
            ]

        }));

    };


    // ─────────────────────────────────────
    // REMOVE ONE FILE
    // ─────────────────────────────────────

    const handleRemoveFile = (disputeId, index) => {

        setSelectedFiles((prev) => ({

            ...prev,

            [disputeId]: (
                prev[disputeId] || []
            ).filter((_, i) => i !== index)

        }));

    };


    // ─────────────────────────────────────
    // CANCEL ALL FILES
    // ─────────────────────────────────────

    const handleCancelUpload = (disputeId) => {

        setSelectedFiles((prev) => ({

            ...prev,

            [disputeId]: []

        }));

        setUploadingDispute(null);

    };


    // ─────────────────────────────────────
    // UPLOAD FILES
    // ─────────────────────────────────────

    // const handleUploadEvidence = async (disputeId) => {

    //     const files = selectedFiles[disputeId] || [];

    //     if (files.length === 0) {

    //         alert("Please select at least one file.");

    //         return;

    //     }

    //     try {

    //         for (const file of files) {

    //             const formData = new FormData();

    //             formData.append(
    //                 "evidence",
    //                 file
    //             );

    //             await apiRequest(
    //                 `/disputes/${disputeId}/upload`,
    //                 {
    //                     method: "POST",
    //                     body: formData
    //                 }
    //             );

    //         }

    //         alert(
    //             "Evidence uploaded successfully."
    //         );

    //         setSelectedFiles((prev) => ({

    //             ...prev,

    //             [disputeId]: []

    //         }));




    //         setUploadingDispute(null);


    //         const updatedEvidence =
    //             await apiRequest(
    //                 `/disputes/${disputeId}/evidence`
    //             );

    //         setEvidenceByDispute((prev) => ({

    //             ...prev,

    //             [disputeId]: updatedEvidence

    //         }));

    //         //     
    //     } catch (error) {

    //         console.error("UPLOAD ERROR:", error);

    //         alert(
    //             `Upload failed: ${error.message}`
    //         );

    //     }
    const handleUploadEvidence = async (disputeId) => {

        const files = selectedFiles[disputeId] || [];

        if (files.length === 0) {
            alert("Please select at least one file.");
            return;
        }

        try {

            for (const file of files) {

                const formData = new FormData();

                // formData.append("evidence", file);
                formData.append("file", file);


                await apiRequest(
                    `/disputes/${disputeId}/upload`,
                    {
                        method: "POST",
                        body: formData
                    }
                );
            }

            alert("Evidence uploaded successfully.");

            setSelectedFiles((prev) => ({
                ...prev,
                [disputeId]: []
            }));

            setUploadingDispute(null);

            const updatedEvidence = await apiRequest(
                `/disputes/${disputeId}/evidence`
            );

            setEvidenceByDispute((prev) => ({
                ...prev,
                [disputeId]: updatedEvidence
            }));

        } catch (error) {

            console.error("UPLOAD ERROR:", error);

            alert(`Upload failed: ${error.message}`);

        }

    };


    // ─────────────────────────────────────
    // FILTER DISPUTES
    // ─────────────────────────────────────

    const filteredDisputes = disputes.filter(
        (dispute) => {

            const q =
                searchQuery.toLowerCase();

            return (
                dispute.chargebackId
                    ?.toLowerCase()
                    .includes(q) ||

                dispute.reasonCode
                    ?.toLowerCase()
                    .includes(q) ||

                dispute.status
                    ?.toLowerCase()
                    .includes(q)
            );

        }
    );


    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="dashboard-main" style={{ overflowY: 'auto' }}>
                <div className="evidence-page">


            {/* HEADER */}

            <div className="evidence-header">

                <div className="evidence-header-left">

                    <p className="eyebrow">
                        EVIDENCE MANAGEMENT
                    </p>

                    <h1>
                        Evidence
                    </h1>

                    <p className="page-description">
                        Organize and review evidence attached
                        to your disputes.
                    </p>

                </div>

            </div>


            {/* SUMMARY */}

            <div className="evidence-summary">

                <div className="evidence-stat">

                    <div className="ev-stat-icon ev-icon-blue">
                        <FolderOpen size={20} />
                    </div>

                    <div className="ev-stat-body">

                        <span>
                            Total Evidence
                        </span>

                        <strong>
                            {Object.values(
                                evidenceByDispute
                            ).reduce(
                                (total, items) =>
                                    total + items.length,
                                0
                            )}
                        </strong>

                        <small>
                            Across all disputes
                        </small>

                    </div>

                </div>


                <div className="evidence-stat">

                    <div className="ev-stat-icon ev-icon-green">
                        <CheckCircle size={20} />
                    </div>

                    <div className="ev-stat-body">

                        <span>
                            Files Uploaded
                        </span>

                        <strong>
                            {Object.values(
                                evidenceByDispute
                            ).reduce(
                                (total, items) =>
                                    total + items.length,
                                0
                            )}
                        </strong>

                        <small>
                            Documents and images
                        </small>
                        {/* <small>
                            {item.fileType || "Document"}
                            {" • "}
                            {item.fileSize
                                ? `${(item.fileSize / (1024 * 1024)).toFixed(2)} MB`
                                : "Size unavailable"}
                        </small> */}

                    </div>

                </div>


                <div className="evidence-stat">

                    <div className="ev-stat-icon ev-icon-purple">
                        <Zap size={20} />
                    </div>

                    <div className="ev-stat-body">

                        <span>
                            Text Extracted
                        </span>

                        <strong>
                            {Object.values(
                                evidenceByDispute
                            )
                                .flat()
                                .filter(
                                    (item) =>
                                        item.extractedText
                                ).length}
                        </strong>

                        <small>
                            Ready for review
                        </small>

                    </div>

                </div>


                <div className="evidence-stat ev-stat-alert">

                    <div className="ev-stat-icon ev-icon-red">
                        <AlertTriangle size={20} />
                    </div>

                    <div className="ev-stat-body">

                        <span>
                            Missing Evidence
                        </span>

                        <strong>
                            {disputes.filter(
                                (dispute) =>
                                    (
                                        evidenceByDispute[
                                        dispute._id
                                        ] || []
                                    ).length === 0
                            ).length}
                        </strong>

                        <small>
                            Needs attention
                        </small>

                    </div>

                </div>

            </div>


            {/* SEARCH */}

            <div className="evidence-controls">

                <div className="evidence-search">

                    <span>
                        ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Search files or dispute ID..."
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>


            {/* DISPUTES */}

            <div className="evidence-disputes">

                {filteredDisputes.length > 0 ? (

                    filteredDisputes.map(
                        (dispute) => {

                            const disputeEvidence =
                                evidenceByDispute[
                                dispute._id
                                ] || [];

                            const files =
                                selectedFiles[
                                dispute._id
                                ] || [];

                            const isExpanded =
                                expandedDispute ===
                                dispute._id;

                            const isUploading =
                                uploadingDispute ===
                                dispute._id;


                            return (

                                <div
                                    className="evidence-card"
                                    key={dispute._id}
                                >


                                    {/* DISPUTE HEADER */}

                                    <div
                                        className="evidence-dispute-header"
                                        onClick={() =>
                                            setExpandedDispute(
                                                isExpanded
                                                    ? null
                                                    : dispute._id
                                            )
                                        }
                                    >

                                        <div>

                                            <p className="eyebrow">
                                                DISPUTE
                                            </p>

                                            <h2>
                                                #
                                                {
                                                    dispute.chargebackId
                                                }
                                            </h2>

                                        </div>


                                        <div className="dispute-card-meta">

                                            <span>
                                                ₹
                                                {(
                                                    dispute.amount ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>

                                            <span>
                                                {dispute.status ||
                                                    "Under Review"}
                                            </span>

                                            <span className="ev-expand-icon">
                                                {isExpanded
                                                    ? "⌃"
                                                    : "⌄"}
                                            </span>

                                        </div>

                                    </div>


                                    {/* EVERYTHING BELOW HEADER
                                        ONLY SHOWS WHEN EXPANDED */}

                                    {isExpanded && (

                                        <>


                                            {/* EVIDENCE LIST */}

                                            <div className="evidence-table">

                                                <div className="evidence-table-header">

                                                    <span>
                                                        Evidence
                                                    </span>

                                                    <span>
                                                        Details
                                                    </span>

                                                    <span>
                                                        Status
                                                    </span>

                                                    <span>
                                                        Uploaded
                                                    </span>

                                                </div>


                                                {disputeEvidence.length >
                                                    0 ? (

                                                    disputeEvidence
                                                        .filter(
                                                            (item) => {

                                                                const q =
                                                                    searchQuery.toLowerCase();

                                                                return (
                                                                    item.fileName
                                                                        ?.toLowerCase()
                                                                        .includes(q) ||
                                                                    dispute.chargebackId
                                                                        ?.toLowerCase()
                                                                        .includes(q)
                                                                );

                                                            }
                                                        )
                                                        .map(
                                                            (item) => (

                                                                <div
                                                                    className="evidence-table-row"
                                                                    key={
                                                                        item._id
                                                                    }
                                                                >

                                                                    <div className="file-cell">

                                                                        <div
                                                                            className={`file-icon ${getFileTypeClass(
                                                                                item.fileType
                                                                            )}`}
                                                                        >
                                                                            {getFileTypeLabel(
                                                                                item.fileType
                                                                            )}
                                                                        </div>

                                                                        <div>

                                                                            <strong>
                                                                                {
                                                                                    item.fileName
                                                                                }
                                                                            </strong>

                                                                            <small>
                                                                                {item.fileType || "Document"}
                                                                                {item.fileSize > 0 &&
                                                                                    ` • ${(item.fileSize / (1024 * 1024)).toFixed(2)} MB`}
                                                                            </small>

                                                                        </div>

                                                                    </div>


                                                                    <div className="evidence-details">

                                                                        <span>
                                                                            Tracking:{" "}
                                                                            {
                                                                                item.trackingNumber ||
                                                                                "N/A"
                                                                            }
                                                                        </span>

                                                                        <span>
                                                                            IP:{" "}
                                                                            {
                                                                                item.customerIp ||
                                                                                "N/A"
                                                                            }
                                                                        </span>

                                                                    </div>
                                                                    <div className="evidence-actions">

                                                                        <a
                                                                            onClick={() => console.log("FILE URL:", item.fileUrl)}
                                                                            href={`http://localhost:5000${item.fileUrl}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="view-evidence-btn"
                                                                        >
                                                                            View
                                                                        </a>

                                                                    </div>


                                                                    <span className="evidence-status extracted">
                                                                        Extracted
                                                                    </span>


                                                                    <span className="uploaded-date">

                                                                        {
                                                                            item.createdAt
                                                                                ? new Date(
                                                                                    item.createdAt
                                                                                ).toLocaleDateString(
                                                                                    "en-IN"
                                                                                )
                                                                                : "N/A"
                                                                        }

                                                                    </span>

                                                                </div>

                                                            )
                                                        )

                                                ) : (

                                                    <div className="ev-empty-state">

                                                        <div className="ev-empty-icon">
                                                            📂
                                                        </div>

                                                        <p>
                                                            No evidence uploaded yet
                                                        </p>

                                                        <small>
                                                            Upload evidence files
                                                            for this dispute.
                                                        </small>

                                                    </div>

                                                )}

                                            </div>


                                            {/* UPLOAD BUTTON */}

                                            {!isUploading && (

                                                <button
                                                    type="button"
                                                    className="upload-evidence-btn ev-dispute-upload-btn"
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        setUploadingDispute(
                                                            dispute._id
                                                        );

                                                    }}
                                                >

                                                    <span>
                                                        +
                                                    </span>

                                                    Upload Evidence

                                                </button>

                                            )}


                                            {/* UPLOAD ZONE */}

                                            {isUploading && (

                                                <div className="ev-upload-zone">

                                                    <div className="ev-upload-icon">
                                                        ⬆
                                                    </div>


                                                    <div className="ev-upload-text">

                                                        <strong>
                                                            Drop files to upload evidence
                                                        </strong>

                                                        <p>
                                                            Supports PDF, JPG, PNG,
                                                            CSV, DOC — max 25 MB per
                                                            file
                                                        </p>

                                                    </div>


                                                    {/* BROWSE */}

                                                    <label
                                                        className="upload-evidence-btn ev-upload-btn"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >

                                                        <span>
                                                            +
                                                        </span>

                                                        Browse Files

                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.csv"
                                                            hidden
                                                            onChange={(e) => {

                                                                e.stopPropagation();

                                                                handleFileSelect(
                                                                    dispute._id,
                                                                    e.target.files
                                                                );

                                                            }}
                                                        />

                                                    </label>


                                                    {/* SELECTED FILES */}

                                                    {files.length > 0 && (

                                                        <div
                                                            className="selected-files"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >

                                                            <div className="selected-files-header">

                                                                <strong>
                                                                    Selected Evidence
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        files.length
                                                                    }{" "}
                                                                    file(s)
                                                                </span>

                                                            </div>


                                                            {files.map(
                                                                (
                                                                    file,
                                                                    index
                                                                ) => (

                                                                    <div
                                                                        className="selected-file-row"
                                                                        key={`${file.name}-${index}`}
                                                                    >

                                                                        <div>

                                                                            <strong>
                                                                                {
                                                                                    file.name
                                                                                }
                                                                            </strong>

                                                                            <small>
                                                                                {(
                                                                                    file.size /
                                                                                    (1024 *
                                                                                        1024)
                                                                                ).toFixed(
                                                                                    2
                                                                                )}{" "}
                                                                                MB
                                                                            </small>

                                                                        </div>


                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleRemoveFile(
                                                                                    dispute._id,
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            Remove
                                                                        </button>

                                                                    </div>

                                                                )
                                                            )}


                                                            {/* ACTIONS */}

                                                            <div className="selected-files-actions">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleCancelUpload(
                                                                            dispute._id
                                                                        )
                                                                    }
                                                                >
                                                                    Cancel
                                                                </button>


                                                                <button
                                                                    type="button"
                                                                    className="upload-evidence-btn"
                                                                    onClick={() =>
                                                                        handleUploadEvidence(
                                                                            dispute._id
                                                                        )
                                                                    }
                                                                >
                                                                    Upload Evidence
                                                                </button>

                                                            </div>

                                                        </div>

                                                    )}

                                                </div>

                                            )}

                                        </>

                                    )}

                                </div>

                            );

                        }
                    )

                ) : (

                    <div className="ev-empty-state">

                        <div className="ev-empty-icon">
                            📂
                        </div>

                        <p>
                            No disputes found
                        </p>

                    </div>

                )}

            </div>
                </div>
            </main>
        </div>
    );
}

export default Evidence;