import pdf from 'pdf-parse'
import fs from 'fs'

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Read the PDF file from the filesystem
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse the PDF data using pdf-parse
    const pdfData = await pdf(buffer)
    return pdfData.text.trim()
  } catch (error) {
    console.error("Error extracting text from PDF:", error)
    throw new Error("Failed to extract text from PDF")
  }
}
