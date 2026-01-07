import { PDFDocument, StandardFonts } from 'pdf-lib';

const A4 = { w: 595.28, h: 841.89 };
const MARGIN = { top: 56, right: 48, bottom: 56, left: 48 };
const LINE_GAP = 6;

type Node = any;

function getTextFromChildren(children: any[]): string {
  if (!Array.isArray(children)) return '';
  return children
    .map((c) => (typeof c?.text === 'string' ? c.text : ''))
    .join('');
}

function normalizeText(s: string) {
  return (s ?? '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function wrapText(params: {
  text: string;
  font: any;
  size: number;
  maxWidth: number;
}) {
  const { text, font, size, maxWidth } = params;
  const words = (text ?? '').split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    const width = font.widthOfTextAtSize(next, size);
    if (width <= maxWidth) current = next;
    else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

export async function renderEditorJsonToPdfBuffer(
  content: any,
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = Array.isArray(content) ? content : [];

  let page = pdfDoc.addPage([A4.w, A4.h]); // ✅ let
  let cursorY = A4.h - MARGIN.top; // ✅ let
  const maxWidth = A4.w - MARGIN.left - MARGIN.right;

  const newPage = () => {
    page = pdfDoc.addPage([A4.w, A4.h]); // ✅ reassign OK
    cursorY = A4.h - MARGIN.top;
  };

  for (const p of pages) {
    if (p?.type !== 'page') continue;

    // sang trang mới cho mỗi "page" node (tuỳ bạn)
    newPage();

    const nodes: Node[] = Array.isArray(p.children) ? p.children : [];
    for (const node of nodes) {
      const raw = getTextFromChildren(node?.children ?? []);
      const text = normalizeText(raw);

      // line break
      if (!text) {
        cursorY -= 12;
        if (cursorY < MARGIN.bottom) newPage();
        continue;
      }

      const size = Number(node?.children?.[0]?.fontSize ?? 12);
      const lineHeight = Math.ceil(size * 1.25) + LINE_GAP;

      const lines = wrapText({ text, font, size, maxWidth });

      for (const line of lines) {
        if (cursorY - lineHeight < MARGIN.bottom) newPage();

        page.drawText(line, {
          x: MARGIN.left,
          y: cursorY,
          size,
          font,
        });

        cursorY -= lineHeight;
      }

      cursorY -= 6;
      if (cursorY < MARGIN.bottom) newPage();
    }
  }

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}
