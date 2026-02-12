import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads directory exists
    const publicDir = join(process.cwd(), 'public')
    const uploadDir = join(publicDir, 'uploads')
    
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Directory exists
    }

    // Sanitize filename or use unique name
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`
    const path = join(uploadDir, filename)
    
    await writeFile(path, buffer)
    
    const url = `/uploads/${filename}`
    
    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
