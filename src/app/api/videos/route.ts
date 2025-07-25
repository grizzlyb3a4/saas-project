import { NextResponse } from 'next/server'
import { AppDataSource } from '@/data-source' // adjust this path if needed

export async function GET() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    const videoRepo = AppDataSource.getRepository("Video")
    const videos = await videoRepo.find({
      order: { createdAt: "DESC" }
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}