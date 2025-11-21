import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/userModel";

// Hardcoded maintainers: email: password
const MAINTAINERS = {
  "maintainer@gmail.com": "m",
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // --- CHECK MAINTAINER FIRST ---
    if (MAINTAINERS[email]) {
      if (MAINTAINERS[email] !== password) {
        return NextResponse.json(
          { success: false, message: "Incorrect password" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Login successful (Maintainer)",
        email,
        status: 0,   // <--- MAINTAINER ROLE
        balance: 0,
      });
    }

    // --- CHECK NORMAL USERS ---
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      email: user.email,
      status: user.status,
      balance: user.balance
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}



