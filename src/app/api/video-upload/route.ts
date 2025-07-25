// app/api/videos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { AppDataSource } from '@/data-source';
import { VideoSchema as Video } from '@/entities/Video'; // your Video entity

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: 'Cloudinary credentials not found' },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const originalSize = formData.get('originalSize') as string;

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'video-uploads',
          transformation: [{ quality: 'auto', fetch_format: 'mp4' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    // Initialize DB
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const videoRepo = AppDataSource.getRepository(Video);

    // Save video metadata to DB
    const video = videoRepo.create({
      title,
      description,
      publicId: result.public_id,
      originalSize,
      compressedSize: String(result.bytes),
      duration: result.duration || 0,
    });

    const savedVideo = await videoRepo.save(video);

    return NextResponse.json(savedVideo);
  } catch (error) {
    console.error('Upload video failed', error);
    return NextResponse.json({ error: 'Upload video failed' }, { status: 500 });
  }
}
