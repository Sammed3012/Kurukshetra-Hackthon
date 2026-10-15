import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, '../data/data.xlsx');

// Ensure directory exists
const dir = path.dirname(FILE_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const seedData = {
  Users: [
    { id: "1", name: "House of Soluper Admin", email: "admin@soluper.com", password: "$2a$10$8K1p/a0g.vGzGclH7zQ4GOp.QZ0U05g74n5wE5VbT2q/u66E875f2", role: "admin" },
    { id: "2", name: "John Doe", email: "john@soluper.com", password: "$2a$10$8K1p/a0g.vGzGclH7zQ4GOp.QZ0U05g74n5wE5VbT2q/u66E875f2", role: "member" },
    { id: "3", name: "Jane Smith", email: "jane@soluper.com", password: "$2a$10$8K1p/a0g.vGzGclH7zQ4GOp.QZ0U05g74n5wE5VbT2q/u66E875f2", role: "user" }
  ],
  Events: [
    { id: "1", title: "Soluper Hackathon 2026", description: "The annual hackathon for builders", date: "2026-08-15", createdBy: "admin@soluper.com" },
    { id: "2", title: "AI Workshop", description: "Intro to generative AI on Google Cloud", date: "2026-07-20", createdBy: "admin@soluper.com" }
  ],
  Achievements: [
    { id: "1", title: "100+ Projects Completed", description: "Successfully delivered over 100 enterprise projects", date: "2026-01-10", createdBy: "admin@soluper.com" },
    { id: "2", title: "Top Innovator Award", description: "Recognized as the top technology innovator of the year", date: "2026-03-05", createdBy: "admin@soluper.com" }
  ]
};

// Check if excel file exists, if not, create it
export function initializeExcel() {
  if (!fs.existsSync(FILE_PATH)) {
    const wb = xlsx.utils.book_new();
    
    // Add each sheet
    Object.entries(seedData).forEach(([sheetName, data]) => {
      const ws = xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(wb, ws, sheetName);
    });
    
    xlsx.writeFile(wb, FILE_PATH);
    console.log('Excel database initialized successfully with seed data at:', FILE_PATH);
  }
}

// Read sheet data
export function readSheet(sheetName) {
  initializeExcel();
  const wb = xlsx.readFile(FILE_PATH);
  const sheet = wb.Sheets[sheetName];
  if (!sheet) return [];
  return xlsx.utils.sheet_to_json(sheet);
}

export const readExcel = readSheet;

// Write sheet data
export function writeSheet(sheetName, data) {
  initializeExcel();
  const wb = xlsx.readFile(FILE_PATH);
  const ws = xlsx.utils.json_to_sheet(data);
  wb.Sheets[sheetName] = ws;
  xlsx.writeFile(wb, FILE_PATH);
}

export const writeExcel = writeSheet;

