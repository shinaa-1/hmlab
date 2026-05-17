import { NextResponse } from 'next/server';
import { getUserWithAccess } from '@/lib/auth';
import jwt from 'jsonwebtoken';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const userData = await getUserWithAccess(decoded.userId, decoded.email);

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}