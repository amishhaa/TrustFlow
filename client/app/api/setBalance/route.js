import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/userModel";

export async function POST(req) {
  try {
    const { email, balance } = await req.json();

    if (!email || balance === undefined) {
      return NextResponse.json(
        { message: "Email and balance are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    user.balance = Number(balance);
    await user.save();

    return NextResponse.json({
      message: "Balance updated successfully",
      balance: user.balance,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error: " + err.message },
      { status: 500 }
    );
  }
}

