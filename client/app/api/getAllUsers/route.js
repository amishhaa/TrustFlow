import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/userModel";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find().select("-password");

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

