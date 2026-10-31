import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const documentProcessingService = {
  /**
   * Extract plain text from an uploaded document buffer or file path
   */
  async extractText(filePath, fileType, originalFilename) {
    try {
      const ext = path.extname(originalFilename || filePath).toLowerCase();

      if (ext === '.pdf' || fileType === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text || '';
      }

      if (
        ext === '.docx' ||
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value || '';
      }

      // TXT, CSV, JSON, Markdown
      const raw = fs.readFileSync(filePath, 'utf-8');
      return raw || '';
    } catch (err) {
      console.error(`Document text extraction failed for ${filePath}:`, err.message);
      // Fallback: Read as UTF-8 string
      try {
        return fs.readFileSync(filePath, 'utf-8');
      } catch {
        return '';
      }
    }
  },

  /**
   * Divide large text into meaningful logical sections/chunks
   */
  chunkText(text, maxChunkChars = 1200) {
    if (!text || text.trim().length === 0) return [];
    
    // Split by double newlines (paragraphs) or markdown headers
    const paragraphs = text.split(/\n\s*\n/);
    const chunks = [];
    let currentChunk = '';
    let currentSection = 'Executive Summary';

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;

      // Detect header
      if (trimmed.startsWith('#') || trimmed.match(/^[0-9]+\.\s+[A-Z]/)) {
        currentSection = trimmed.slice(0, 50).replace(/[#*]/g, '').trim();
      }

      if ((currentChunk + '\n\n' + trimmed).length > maxChunkChars) {
        if (currentChunk.trim()) {
          chunks.push({
            text: currentChunk.trim(),
            section: currentSection,
          });
        }
        currentChunk = trimmed;
      } else {
        currentChunk = currentChunk ? `${currentChunk}\n\n${trimmed}` : trimmed;
      }
    }

    if (currentChunk.trim()) {
      chunks.push({
        text: currentChunk.trim(),
        section: currentSection,
      });
    }

    return chunks;
  },
};

export default documentProcessingService;
