import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

const MARGIN = 15;
const PAGE_WIDTH = 210; // A4 mm
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const DISCLAIMER = 'This is informational guidance only and does not constitute formal legal advice. For serious legal matters, please consult a qualified advocate.';

function newDoc() {
  return new jsPDF({ unit: 'mm', format: 'a4' });
}

function addHeader(doc, title) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text('VakilAI', MARGIN, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Personal Indian Legal Advisor', MARGIN, 24);

  doc.setDrawColor(201, 169, 110);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 28, PAGE_WIDTH - MARGIN, 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  const titleLines = doc.splitTextToSize(title, CONTENT_WIDTH);
  doc.text(titleLines, MARGIN, 37);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text(`Generated ${format(new Date(), 'PPpp')}`, MARGIN, 37 + titleLines.length * 5 + 3);

  return 37 + titleLines.length * 5 + 10;
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(150, 150, 150);
    const lines = doc.splitTextToSize(`Disclaimer: ${DISCLAIMER}`, CONTENT_WIDTH);
    doc.text(lines, MARGIN, PAGE_HEIGHT - 12);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 12, { align: 'right' });
  }
}

function writeParagraph(doc, text, y, { fontSize = 10, font = 'normal', color = [40, 40, 40], lineHeight = 5 } = {}) {
  doc.setFont('helvetica', font);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  for (const line of lines) {
    if (y > PAGE_HEIGHT - 22) {
      doc.addPage();
      y = MARGIN;
    }
    doc.text(line, MARGIN, y);
    y += lineHeight;
  }
  return y;
}

/** Strips the light markdown VakilAI responses use (bold, headings) down to plain text. */
function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();
}

export function exportTextToPdf(title, bodyText, filename) {
  const doc = newDoc();
  let y = addHeader(doc, title);
  y = writeParagraph(doc, bodyText, y + 3);
  addFooter(doc);
  doc.save(filename || `${title.replace(/[^a-z0-9]+/gi, '_')}.pdf`);
}

export function exportConversationToPdf(title, messages) {
  const doc = newDoc();
  let y = addHeader(doc, title);

  for (const msg of messages || []) {
    if (y > PAGE_HEIGHT - 30) {
      doc.addPage();
      y = MARGIN;
    }
    const speaker = msg.role === 'assistant' ? 'VakilAI' : 'You';
    const timestamp = msg.timestamp ? format(new Date(msg.timestamp), 'MMM d, h:mm a') : '';
    y = writeParagraph(doc, `${speaker}${timestamp ? '  ·  ' + timestamp : ''}`, y + 4, {
      fontSize: 9.5, font: 'bold', color: msg.role === 'assistant' ? [160, 120, 60] : [60, 60, 60]
    });
    y = writeParagraph(doc, stripMarkdown(msg.content || ''), y + 1, { fontSize: 10 });
  }

  addFooter(doc);
  doc.save(`${title.replace(/[^a-z0-9]+/gi, '_')}.pdf`);
}
