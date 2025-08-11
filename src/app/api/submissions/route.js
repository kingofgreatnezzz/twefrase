import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json')

export async function GET() {
  try {
    if (!existsSync(DATA_FILE)) {
      return Response.json({ submissions: [] })
    }

    const data = await readFile(DATA_FILE, 'utf-8')
    const submissions = JSON.parse(data)

    // Sort by timestamp (newest first)
    submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    return Response.json({ submissions })
  } catch (error) {
    console.error('Error reading submissions:', error)
    return Response.json(
      { error: 'Failed to read submissions' },
      { status: 500 }
    )
  }
}
