import User from "../../auth/Model/User";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(req) {
  // Extract the auth-token header
  const token = req.headers.get('auth-token');

  // Verify token
  if (!token) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  try {
    // Verify the token and extract userId
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB without the password field
    const user = await User.findById(userId).select("-password");

    // Return the user data
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }
}
