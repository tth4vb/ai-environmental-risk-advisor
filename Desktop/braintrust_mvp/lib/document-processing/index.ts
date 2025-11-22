import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import xlsx from 'xlsx'

export async function extractText(buffer: Buffer, fileType: string): Promise<string> {
  try {
    switch (fileType) {
      case 'pdf':
        return await extractPdfText(buffer)
      case 'docx':
        return await extractDocxText(buffer)
      case 'xlsx':
      case 'xls':
        return await extractXlsxText(buffer)
      case 'txt':
      case 'md':
      case 'js':
      case 'ts':
      case 'tsx':
      case 'jsx':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'go':
      case 'rs':
        return buffer.toString('utf-8')
      default:
        throw new Error(`Unsupported file type: ${fileType}`)
    }
  } catch (error: any) {
    throw new Error(`Failed to extract text: ${error.message}`)
  }
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer)
  return data.text
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

async function extractXlsxText(buffer: Buffer): Promise<string> {
  const workbook = xlsx.read(buffer, { type: 'buffer' })
  let text = ''

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName]
    text += `\n\n=== ${sheetName} ===\n\n`
    text += xlsx.utils.sheet_to_txt(worksheet)
  })

  return text.trim()
}

export function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext || ''
}
