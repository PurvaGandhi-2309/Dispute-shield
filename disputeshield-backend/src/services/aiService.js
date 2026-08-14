import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateRebuttalWithAI = async (dispute, evidence) => {
    const model = genAI.getGenerativeModel({
        // model: "gemini-2.5-flash"
        model: "gemini-3.6-flash"
    });

    const prompt = `
You are an expert chargeback dispute assistant.

Create a professional rebuttal letter for this dispute.

DISPUTE INFORMATION:
Chargeback ID: ${dispute.chargebackId}
Amount: ${dispute.amount}
Reason Code: ${dispute.reasonCode}

SHIPPING ADDRESS:
${JSON.stringify(dispute.shippingAddress)}

EVIDENCE DETAILS:
${evidence.map((e, index) => `
Evidence ${index + 1}:

Tracking Number: ${e.trackingNumber || "Not provided"}
Customer IP: ${e.customerIp || "Not provided"}

Extracted PDF Evidence:
${e.extractedText || "No PDF text available"}
`).join("\n")}

RULES:
- Write a professional and factual rebuttal.
- Use ONLY the information provided.
- Do NOT invent evidence.
- Do NOT make unsupported claims.
- Clearly explain why the merchant is contesting the chargeback.
- Treat the dispute amount as the official chargeback amount.
- Report amounts found in evidence separately.
- If an evidence document contains a different amount, clearly identify the discrepancy.
- Never replace the dispute amount with an amount found in evidence.

IMPORTANT OUTPUT RULES:

Return ONLY the final professional rebuttal letter.

Do NOT use Markdown formatting.

Do NOT use:
**
##
###
---
[Current Date]
[Customer Name]
[Merchant Name]
or any other placeholder text.

Do not include "FINAL LETTER" or internal instructions.

Use clean plain-text business-letter formatting.

Use the actual dispute and evidence information provided.

The response must be polished, professional, concise, and ready to submit directly to the payment processor.

IMPORTANT: Generate the response as a professional chargeback rebuttal letter ready to submit to a payment processor.

Use this exact structure:

Dear Chargeback Management Team,

RE: Chargeback Dispute [use actual chargeback ID]

INTRODUCTION
Briefly state that the merchant respectfully contests the chargeback and mention the actual reason code.

TRANSACTION DETAILS
Include the relevant transaction information such as chargeback ID, dispute amount, order ID, transaction date, and customer information when available.

EVIDENCE AND FULFILLMENT
Clearly explain the evidence provided, including order records, payment information, shipping information, tracking details, delivery confirmation, customer IP, or other relevant evidence available.

ARGUMENT
Explain clearly why the chargeback claim is not supported by the available evidence. Use only information actually provided in the dispute and evidence.

CONCLUSION
Summarize why the merchant's position is supported and respectfully request reversal of the chargeback.

Sincerely,

Merchant Dispute Team

IMPORTANT OUTPUT RULES:
- Return only the final rebuttal letter.
- Use professional business-letter formatting.
- Use clear plain-text section headings.
- Do NOT use Markdown.
- Do NOT use **, ###, ---, or other Markdown symbols.
- Do NOT write "FINAL LETTER".
- Do NOT use placeholders such as [Current Date], [Customer Name], [Merchant Name], etc.
- Use actual available information instead.
- Never invent missing facts. If information is unavailable, simply omit that detail.
- Do not include explanations about being an AI.
- Do not include internal instructions or analysis.
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
};