/**
 * Google Sheets and Drive API Service
 */

// Helper to make Google API requests with proper auth headers
async function googleFetch(url, accessToken, options = {}) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.error?.message || `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

/**
 * List spreadsheet files from Google Drive
 */
export async function listSpreadsheets(accessToken) {
  const url = `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name,webViewLink,modifiedTime)&orderBy=modifiedTime desc&pageSize=20`;
  const result = await googleFetch(url, accessToken);
  return result.files || [];
}

/**
 * Create a new spreadsheet with Users, Events, and Achievements sheets
 */
export async function createDatabaseSpreadsheet(accessToken, title = 'HOUSEOFSOLUPER Database') {
  const url = 'https://sheets.googleapis.com/v4/spreadsheets';
  const body = {
    properties: {
      title
    },
    sheets: [
      {
        properties: {
          title: 'Users',
          gridProperties: { rowCount: 100, columnCount: 10 }
        }
      },
      {
        properties: {
          title: 'Events',
          gridProperties: { rowCount: 100, columnCount: 10 }
        }
      },
      {
        properties: {
          title: 'Achievements',
          gridProperties: { rowCount: 100, columnCount: 10 }
        }
      }
    ]
  };

  const spreadsheet = await googleFetch(url, accessToken, {
    method: 'POST',
    body: JSON.stringify(body)
  });

  // Now, initialize headers for each sheet
  const spreadsheetId = spreadsheet.spreadsheetId;
  await writeSheetValues(accessToken, spreadsheetId, 'Users!A1:D1', [['id', 'name', 'email', 'role']]);
  await writeSheetValues(accessToken, spreadsheetId, 'Events!A1:F1', [['id', 'title', 'description', 'date', 'time', 'location']]);
  await writeSheetValues(accessToken, spreadsheetId, 'Achievements!A1:D1', [['id', 'title', 'description', 'date']]);

  return spreadsheet;
}

/**
 * Get sheet tabs/metadata for a spreadsheet
 */
export async function getSpreadsheetDetails(accessToken, spreadsheetId) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  return googleFetch(url, accessToken);
}

/**
 * Read values from a specific sheet range
 */
export async function readSheetValues(accessToken, spreadsheetId, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const result = await googleFetch(url, accessToken);
  return result.values || [];
}

/**
 * Write/Over-write values to a sheet range
 */
export async function writeSheetValues(accessToken, spreadsheetId, range, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
  return googleFetch(url, accessToken, {
    method: 'PUT',
    body: JSON.stringify({ values })
  });
}

/**
 * Append values to a sheet
 */
export async function appendSheetValues(accessToken, spreadsheetId, range, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
  return googleFetch(url, accessToken, {
    method: 'POST',
    body: JSON.stringify({ values })
  });
}

/**
 * Clear a sheet range (except headers usually, or complete)
 */
export async function clearSheetValues(accessToken, spreadsheetId, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`;
  return googleFetch(url, accessToken, {
    method: 'POST'
  });
}

/**
 * Overwrite a complete sheet with new rows (preserving headers)
 * @param {string} accessToken
 * @param {string} spreadsheetId
 * @param {string} sheetName 'Users', 'Events', or 'Achievements'
 * @param {Array<string>} headers e.g. ['id', 'name', 'email', 'role']
 * @param {Array<Array<any>>} rows e.g. [[1, 'Alice', 'alice@email.com', 'admin'], ...]
 */
export async function overwriteSheet(accessToken, spreadsheetId, sheetName, headers, rows) {
  // First clear the existing sheet values
  await clearSheetValues(accessToken, spreadsheetId, `${sheetName}!A1:Z500`);
  
  // Combine headers and rows
  const allValues = [headers, ...rows];
  
  // Write new data starting from A1
  return writeSheetValues(accessToken, spreadsheetId, `${sheetName}!A1`, allValues);
}
