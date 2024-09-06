import { NextResponse } from "next/server";
import User from "../Model/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectdatabase } from "@/app/Mongodb/database";

export const POST = async (request) => {
  const { email, password } = await request.json();
  try {
    await connectdatabase();
    if (!email || !password)
      return NextResponse.json({ error: "provide all details" });

    const user = await User.findOne({ email });

    if (!user)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return NextResponse.json({ token }, { status: 201 });
    } else {
      return NextResponse.json(
        { error: "Email and password not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
};
