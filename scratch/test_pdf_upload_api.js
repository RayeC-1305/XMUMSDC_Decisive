import { PDFParse } from "pdf-parse";
import { cvAgent } from "../services/cv_agent.js";

async function testPdfParseDirect() {
  console.log("==========================================");
  console.log("TESTING PDF BUFFER EXTRACTION WITH PDFPARSE");
  console.log("==========================================");

  // Minimal valid PDF containing text
  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 147 >>
stream
BT
/F1 12 Tf
50 700 Td
(Nurul Huda - Senior Accounts Executive) Tj
0 -20 Td
(- Reconciled monthly general ledgers in SAP ERP system.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000440 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
517
%%EOF`;

  const pdfBuffer = Buffer.from(pdfString);
  console.log("Buffer size:", pdfBuffer.length, "bytes");

  // Call with { data: pdfBuffer }
  const parser = new PDFParse({ data: pdfBuffer });
  const pdfRes = await parser.getText();
  const extractedText = typeof pdfRes === "string" ? pdfRes : (pdfRes?.text || "");
  await parser.destroy();

  console.log("EXTRACTED TEXT FROM PDF:\n", extractedText);

  // Send through CVAgent
  const persona = await cvAgent.analyzeResume(extractedText);
  console.log("\nPARSED PERSONA:");
  console.log("NAME:", persona.name);
  console.log("TITLE:", persona.display_title);
  console.log("DOMAIN:", persona.ml_metadata.domain_classified);
  console.log("TASKS:", persona.atomic_tasks.map(t => t.name));
  console.log("SKILLS:", persona.baseline_skills);
}

testPdfParseDirect().catch(console.error);
