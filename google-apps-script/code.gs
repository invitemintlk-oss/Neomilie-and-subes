/**
 * Subes & Neomilie — Wedding RSVP + Wishes backend (Google Apps Script)
 *
 * Paste this whole file into Extensions > Apps Script of the spreadsheet:
 * https://docs.google.com/spreadsheets/d/1wY39t5pK6E9FfM-kDqV7zK6cX2xeKqixJJZNC6WU-qk/edit
 *
 * - Sheets "RSVP" and "Wishes" are created automatically (with styled headers)
 *   on the first submission, or immediately if you run setupSheets() once.
 * - POST  ?sheet=RSVP | Wishes   -> appends a row
 * - GET   ?sheet=Wishes          -> returns approved wishes as JSON (for the website)
 * - GET   (no params)            -> health check
 */

const SPREADSHEET_ID = '1wY39t5pK6E9FfM-kDqV7zK6cX2xeKqixJJZNC6WU-qk';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Phone', 'Attendance', 'No. of Guests', 'Message / Notes'],
    widths: [170, 220, 150, 160, 120, 360],
    color: '#1F4D3A',
  },
  WISHES: {
    name: 'Wishes',
    headers: ['Timestamp', 'Guest Name', 'Message', 'Show on Website'],
    widths: [170, 220, 480, 140],
    color: '#1F4D3A',
  },
};

/* ----------------------------- Entry points ----------------------------- */

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const p = parsePayload_(e);
    const key = normaliseSheetKey_(p.sheet);
    if (!key) return json_({ ok: false, error: 'Invalid sheet. Use "RSVP" or "Wishes".' });

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, SHEETS[key]);

    let row;
    if (key === 'RSVP') {
      const name = clean_(p.name, 120);
      if (!name) return json_({ ok: false, error: 'Name is required.' });
      row = [
        new Date(),
        name,
        clean_(p.phone, 40),
        clean_(p.attendance, 40) || 'Joyfully Accepts',
        clean_(p.guests, 10) || '1',
        clean_(p.message || p.dietary || p.notes, 1000),
      ];
    } else {
      const name = clean_(p.name, 120);
      const message = clean_(p.message, 1500);
      if (!name || !message) return json_({ ok: false, error: 'Name and message are required.' });
      row = [new Date(), name, message, true];
    }

    sheet.appendRow(row);
    const last = sheet.getLastRow();
    sheet.getRange(last, 1).setNumberFormat('dd/MM/yyyy hh:mm a');
    if (key === 'WISHES') sheet.getRange(last, 4).insertCheckboxes().check();

    return json_({ ok: true, row: last });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    const key = normaliseSheetKey_(e && e.parameter ? e.parameter.sheet : '');
    if (key !== 'WISHES') {
      return json_({ ok: true, message: 'Subes & Neomilie wedding endpoint is running.' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, SHEETS.WISHES);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return json_({ ok: true, wishes: [] });

    const values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    const wishes = values
      // Untick "Show on Website" in the sheet to hide a wish.
      .filter(function (r) { return r[1] && r[2] && r[3] !== false; })
      .map(function (r) {
        return {
          name: String(r[1]),
          message: String(r[2]),
          createdAt: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
        };
      })
      .reverse()
      .slice(0, 100);

    return json_({ ok: true, wishes: wishes });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/** Optional: run once from the editor to create both sheets right away. */
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getOrCreateSheet_(ss, SHEETS.RSVP);
  getOrCreateSheet_(ss, SHEETS.WISHES);
}

/* ------------------------------- Helpers -------------------------------- */

function normaliseSheetKey_(value) {
  const v = String(value || '').trim().toUpperCase();
  if (v === 'RSVP') return 'RSVP';
  if (v === 'WISHES' || v === 'WISH') return 'WISHES';
  return null;
}

function getOrCreateSheet_(ss, def) {
  let sheet = ss.getSheetByName(def.name);
  if (!sheet) sheet = ss.insertSheet(def.name);

  // Write / repair headers if row 1 is empty or different.
  const current = sheet.getLastColumn() > 0
    ? sheet.getRange(1, 1, 1, def.headers.length).getValues()[0]
    : [];
  const needsHeaders = def.headers.some(function (h, i) { return current[i] !== h; });

  if (needsHeaders) {
    if (sheet.getLastRow() > 0 && String(current[0] || '') !== '' && current[0] !== def.headers[0]) {
      sheet.insertRowBefore(1); // keep any existing data, put headers on top
    }
    sheet.getRange(1, 1, 1, def.headers.length)
      .setValues([def.headers])
      .setFontWeight('bold')
      .setFontColor('#FFFFFF')
      .setBackground(def.color)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(1, 34);
    sheet.setFrozenRows(1);
    def.widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
    const msgCol = def.name === 'Wishes' ? 3 : 6;
    sheet.getRange(2, msgCol, Math.max(sheet.getMaxRows() - 1, 1), 1).setWrap(true);
  }

  // Remove the default empty "Sheet1" if it is still there.
  const sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && ss.getSheets().length > 1 && sheet1.getLastRow() === 0) {
    ss.deleteSheet(sheet1);
  }

  return sheet;
}

function parsePayload_(e) {
  const params = (e && e.parameter) || {};
  if (Object.keys(params).length > 0) return params;

  const body = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch (_ignored) {
    const out = {};
    body.split('&').forEach(function (pair) {
      if (!pair) return;
      const i = pair.indexOf('=');
      const k = decodeURIComponent((i >= 0 ? pair.slice(0, i) : pair).replace(/\+/g, ' '));
      const v = decodeURIComponent((i >= 0 ? pair.slice(i + 1) : '').replace(/\+/g, ' '));
      out[k] = v;
    });
    return out;
  }
}

function clean_(value, maxLen) {
  let s = String(value == null ? '' : value).trim().slice(0, maxLen);
  // Prevent spreadsheet formula injection.
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
