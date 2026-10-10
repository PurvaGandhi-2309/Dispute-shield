import fs from "fs";
import { PDFParse } from "pdf-parse";
import PDFDocument from "pdfkit";

export const extractTextFromPDF = async (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
        data: fileBuffer
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
};

export const generateRebuttalPDF = (text, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        doc.fontSize(18)
            .text("REBUTTAL LETTER", { align: "center" });

        doc.moveDown();

        doc.fontSize(11)
            .text(text, {
                align: "left",
                lineGap: 5
            });

        doc.end();

        stream.on("finish", resolve);
        stream.on("error", reject);
    });
};