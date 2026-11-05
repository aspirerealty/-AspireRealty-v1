/**
 * Google Sheet receiver for website leads.
 *
 * Setup (once): open the Google Sheet → Extensions → Apps Script → replace
 * everything with this file → set SECRET below → Deploy → New deployment →
 * type "Web app", Execute as "Me", Who has access "Anyone" → Deploy →
 * authorise → copy the Web app URL into lead-config.php ('sheet_url'), and
 * the same SECRET into 'sheet_secret'.
 */
const SECRET = 'PASTE-THE-SAME-SECRET-AS-IN-lead-config.php';

const HEADERS = ['Date & time', 'Name', 'Mobile', 'Email', 'Project', 'Reason', 'Message', 'Form', 'Page'];

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: 'bad json' });
  }
  if (data.secret !== SECRET) return reply({ ok: false, error: 'forbidden' });

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#f3f5f8');
      sheet.setFrozenRows(1);
    }
    // Leading ' keeps values as text (mobile numbers, and stops "=..." formulas).
    const text = (v) => "'" + String(v == null ? '' : v);
    sheet.appendRow([
      data.time || new Date(),
      data.name, text(data.phone), data.email, data.project, data.reason,
      text(data.message), data.source, data.page,
    ].map((v) => (v == null ? '' : v)));
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
