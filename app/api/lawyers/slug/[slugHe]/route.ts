import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lawyer from '@/models/Lawyer';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { slugHe: string } }
) {
  try {
    await connectDB();
    const { slugHe } = params;

    const lawyer = await Lawyer.findOne({ slugHe }).lean();

    if (!lawyer) {
      return errorResponse('Lawyer not found', 404);
    }

    // Serialize the data
    const lawyerData = lawyer as any;
    const serializedLawyer = {
      _id: lawyerData._id.toString(),
      name: lawyerData.name,
      title: lawyerData.title,
      slugHe: lawyerData.slugHe,
      bio: lawyerData.bio,
      email: lawyerData.email,
      phone: lawyerData.phone,
      photoUrl: lawyerData.photoUrl,
      specialties: lawyerData.specialties,
      linkedinUrl: lawyerData.linkedinUrl,
      isActive: lawyerData.isActive,
    };

    return successResponse(serializedLawyer);
  } catch (error: any) {
    console.error('Error fetching lawyer:', error);
    return errorResponse('Failed to fetch lawyer', 500);
  }
}

