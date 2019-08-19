/*!
 * By:
 * Martin Borg
 */

// tslint:disable: quotemark
const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(source?: string): string {
  if (!source) {
    return '';
  }

  return String(source).replace(/[&<>"'\/]/g, s => entityMap[s]);
}

export { escapeHtml };
