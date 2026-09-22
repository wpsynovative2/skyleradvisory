/**
 * Skyler Advisory — enquiry handler.
 *
 * Receives enquiries from the Next.js site (app/api/enquiry/route.ts),
 * appends them to a Google Sheet, and emails the team plus an
 * acknowledgement to the person who enquired.
 *
 * Setup: see google-apps-script/README.md
 */

// ---------------------------------------------------------------------------
// Configuration — set these in Project Settings → Script properties, or edit
// the fallbacks below directly.
// ---------------------------------------------------------------------------
function getConfig() {
  var props = PropertiesService.getScriptProperties();
  return {
    // Google Sheet that receives the rows. Leave blank to use the sheet this
    // script is bound to.
    SHEET_ID: props.getProperty('SHEET_ID') || '',
    SHEET_NAME: props.getProperty('SHEET_NAME') || 'Enquiries',

    // Where the notification goes. Comma-separate multiple addresses.
    NOTIFY_EMAIL: props.getProperty('NOTIFY_EMAIL') || 'info@skyleradvisory.com',

    // Shared secret. Must match GOOGLE_SCRIPT_TOKEN in the site's .env.local.
    // Leave blank to disable the check.
    TOKEN: props.getProperty('TOKEN') || '',

    // Send an auto-reply to the enquirer.
    SEND_ACKNOWLEDGEMENT: (props.getProperty('SEND_ACKNOWLEDGEMENT') || 'true') === 'true',

    COMPANY_NAME: 'Skyler Advisory',
    COMPANY_PHONE: '+91 98197 24955',
    COMPANY_EMAIL: 'info@skyleradvisory.com',
    COMPANY_SITE: 'https://skyleradvisory.com'
  };
}

var HEADERS = [
  'Timestamp',
  'Name',
  'Phone',
  'Email',
  'Property Requirement',
  'Project Type',
  'Preferred Location',
  'Message',
  'Consent',
  'Source',
  'Page URL',
  'User Agent'
];

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    var config = getConfig();
    var data = parseRequest(e);

    if (config.TOKEN && data.token !== config.TOKEN) {
      return jsonResponse({ ok: false, message: 'Unauthorized' });
    }

    if (!data.name || !data.phone || !data.email) {
      return jsonResponse({ ok: false, message: 'Missing required fields' });
    }

    appendRow(config, data);
    sendTeamEmail(config, data);

    if (config.SEND_ACKNOWLEDGEMENT) {
      sendAcknowledgement(config, data);
    }

    return jsonResponse({ ok: true, message: 'Enquiry recorded' });
  } catch (error) {
    console.error('doPost failed: ' + error);
    return jsonResponse({ ok: false, message: String(error) });
  }
}

/** Lets you confirm the deployment is live by opening the URL in a browser. */
function doGet() {
  return jsonResponse({ ok: true, message: 'Skyler Advisory enquiry endpoint is live.' });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseRequest(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (error) {
      // Fall through to form-encoded parameters.
    }
  }
  return (e && e.parameter) || {};
}

function getSheet(config) {
  var spreadsheet = config.SHEET_ID
    ? SpreadsheetApp.openById(config.SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error('No spreadsheet found. Set SHEET_ID in Script properties.');
  }

  var sheet = spreadsheet.getSheetByName(config.SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(config.SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var header = sheet.getRange(1, 1, 1, HEADERS.length);
    header.setFontWeight('bold');
    header.setBackground('#282360');
    header.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function appendRow(config, data) {
  var sheet = getSheet(config);

  sheet.appendRow([
    data.submittedAt ? new Date(data.submittedAt) : new Date(),
    data.name || '',
    data.phone || '',
    data.email || '',
    data.requirement || '',
    data.projectType || '',
    data.location || '',
    data.message || '',
    data.consent || '',
    data.source || '',
    data.pageUrl || '',
    data.userAgent || ''
  ]);

  sheet.autoResizeColumns(1, Math.min(HEADERS.length, 8));
}

function rowsHtml(data) {
  var rows = [
    ['Name', data.name],
    ['Phone', data.phone],
    ['Email', data.email],
    ['Property Requirement', data.requirement],
    ['Project Type', data.projectType],
    ['Preferred Location', data.location],
    ['Message', data.message],
    ['Consent Given', data.consent],
    ['Source', data.source],
    ['Page', data.pageUrl]
  ];

  return rows
    .filter(function (row) {
      return row[1];
    })
    .map(function (row) {
      return (
        '<tr>' +
        '<td style="padding:10px 14px;border-bottom:1px solid #eee;color:#525252;font-size:13px;width:180px;">' +
        escapeHtml(row[0]) +
        '</td>' +
        '<td style="padding:10px 14px;border-bottom:1px solid #eee;color:#020101;font-size:14px;font-weight:600;">' +
        escapeHtml(row[1]) +
        '</td>' +
        '</tr>'
      );
    })
    .join('');
}

function sendTeamEmail(config, data) {
  var subject = 'New Enquiry: ' + data.name + ' — ' + (data.projectType || 'Website');

  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;background:#f6f6f9;padding:28px;">' +
    '<div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e6ee;">' +
    '<div style="background:#282360;padding:22px 28px;">' +
    '<h1 style="margin:0;color:#ffffff;font-size:18px;letter-spacing:.5px;">New Website Enquiry</h1>' +
    '<p style="margin:6px 0 0;color:#ebcd6c;font-size:12px;letter-spacing:2px;text-transform:uppercase;">' +
    escapeHtml(config.COMPANY_NAME) +
    '</p>' +
    '</div>' +
    '<table style="width:100%;border-collapse:collapse;">' +
    rowsHtml(data) +
    '</table>' +
    '<div style="padding:18px 28px;background:#fafafa;color:#7a7a7a;font-size:12px;">' +
    'Received ' +
    escapeHtml(formatDate(data.submittedAt)) +
    '</div>' +
    '</div></div>';

  MailApp.sendEmail({
    to: config.NOTIFY_EMAIL,
    subject: subject,
    htmlBody: html,
    replyTo: data.email || config.COMPANY_EMAIL,
    name: config.COMPANY_NAME + ' Website'
  });
}

function sendAcknowledgement(config, data) {
  if (!data.email) return;

  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;background:#f6f6f9;padding:28px;">' +
    '<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e6ee;">' +
    '<div style="background:#282360;padding:24px 28px;">' +
    '<h1 style="margin:0;color:#ffffff;font-size:20px;">Thank you for reaching out</h1>' +
    '</div>' +
    '<div style="padding:26px 28px;color:#333;font-size:14px;line-height:1.7;">' +
    '<p style="margin:0 0 14px;">Dear ' +
    escapeHtml(data.name) +
    ',</p>' +
    '<p style="margin:0 0 14px;">Thank you for your enquiry with ' +
    escapeHtml(config.COMPANY_NAME) +
    '. We have received your details and a member of our team will contact you shortly.</p>' +
    '<p style="margin:0 0 6px;color:#7a7a7a;font-size:13px;">For anything urgent, reach us directly:</p>' +
    '<p style="margin:0 0 20px;font-size:14px;"><strong>' +
    escapeHtml(config.COMPANY_PHONE) +
    '</strong> &nbsp;|&nbsp; ' +
    escapeHtml(config.COMPANY_EMAIL) +
    '</p>' +
    '<p style="margin:0;color:#525252;">Warm regards,<br/><strong>' +
    escapeHtml(config.COMPANY_NAME) +
    '</strong></p>' +
    '</div>' +
    '<div style="padding:16px 28px;background:#fafafa;color:#9a9a9a;font-size:11px;">' +
    'This is an automated acknowledgement. Please do not reply to this email.' +
    '</div>' +
    '</div></div>';

  MailApp.sendEmail({
    to: data.email,
    subject: 'We have received your enquiry — ' + config.COMPANY_NAME,
    htmlBody: html,
    name: config.COMPANY_NAME
  });
}

function formatDate(value) {
  var date = value ? new Date(value) : new Date();
  return Utilities.formatDate(date, 'Asia/Kolkata', "dd MMM yyyy 'at' hh:mm a") + ' IST';
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Run once from the editor to verify Sheet + email wiring. */
function testSubmission() {
  var result = doPost({
    postData: {
      contents: JSON.stringify({
        token: getConfig().TOKEN,
        submittedAt: new Date().toISOString(),
        name: 'Test Enquiry',
        phone: '+91 90000 00000',
        email: 'test@example.com',
        requirement: 'Buy',
        projectType: 'Residential Project',
        location: 'Andheri East',
        message: 'This is a test submission.',
        consent: 'Yes',
        source: 'Apps Script test',
        pageUrl: 'https://skyleradvisory.com/'
      })
    }
  });
  console.log(result.getContent());
}
