import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/userModel";

export async function POST(req) {
  try {
    const { email, password, status } = await req.json(); // include status
    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({ email, password, status });

    return NextResponse.json({
      success: true,
      message: "Registered successfully",
      email: user.email,
      status: user.status,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}
