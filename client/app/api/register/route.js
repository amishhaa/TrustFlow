import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/userModel";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    await User.create({ email, password });

    return NextResponse.json({ message: "Registered successfully" });
  } catch (err) {
    return NextResponse.json({ message: "Error: " + err.message }, { status: 500 });
  }
}
