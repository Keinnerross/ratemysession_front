import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
  
  // Delete auth cookies
  response.cookies.delete('authToken');
  response.cookies.delete('userData');
  
  return response;
}