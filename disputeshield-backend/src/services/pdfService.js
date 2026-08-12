
import fs from "fs";
import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
        data: fileBuffer
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
};