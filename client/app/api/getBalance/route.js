import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; 
import User from "@/lib/userModel";   // ← EXACT PATH YOU GAVE

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      balance: user.balance,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server Error: " + err.message },
      { status: 500 }
    );
  }
}

