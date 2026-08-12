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
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
};