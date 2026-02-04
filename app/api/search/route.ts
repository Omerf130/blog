import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');

    if (!query || query.trim().length === 0) {
      return successResponse({ posts: [], total: 0 });
    }

    // Build search query
    const searchQuery = {
      status: 'published',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { summary: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ],
    };

    // Get total count
    const total = await Post.countDocuments(searchQuery);

    // Fetch posts
    const postsRaw = await Post.find(searchQuery)
      .populate('categories', 'name slugHe')
      .populate('authorLawyerId', 'name title slugHe')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-content') // Don't send full content in search results
      .lean();

    // Serialize data
    const posts = postsRaw.map((post: any) => ({
      _id: post._id.toString(),
      title: post.title,
      summary: post.summary,
      slugHe: post.slugHe,
      publishedAt: post.publishedAt,
      categories: post.categories?.map((cat: any) => ({
        _id: cat._id.toString(),
        name: cat.name,
        slugHe: cat.slugHe,
      })),
      authorLawyerId: post.authorLawyerId ? {
        _id: post.authorLawyerId._id.toString(),
        name: post.authorLawyerId.name,
        title: post.authorLawyerId.title,
        slugHe: post.authorLawyerId.slugHe,
      } : undefined,
    }));

    return successResponse({ posts, total, query });
  } catch (error: any) {
    console.error('Search error:', error);
    return errorResponse('Failed to perform search', 500);
  }
}

