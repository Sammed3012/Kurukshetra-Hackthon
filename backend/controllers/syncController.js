import { writeSheet } from '../config/excel.js';

export const overwriteLocalSheet = async (req, res, next) => {
  try {
    const { sheetName, data } = req.body;
    
    if (!sheetName || !Array.isArray(data)) {
      return res.status(400).json({ success: false, error: 'Please provide valid sheetName and data array' });
    }
    
    const allowedSheets = ['Users', 'Events', 'Achievements'];
    if (!allowedSheets.includes(sheetName)) {
      return res.status(400).json({ success: false, error: `Invalid sheetName. Must be one of: ${allowedSheets.join(', ')}` });
    }
    
    // Write new data to the local excel sheet
    writeSheet(sheetName, data);
    
    res.status(200).json({
      success: true,
      message: `Local Excel sheet '${sheetName}' successfully updated with ${data.length} records.`,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};
