import connectDB from "@/config/database";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import validator from "email-validator";
import { Types } from "mongoose";

connectDB();
export const GET = async (req: NextRequest) => {
  try {
    const users = await User.find({}).select("-password");
    return NextResponse.json(
      {
        users,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    if (!validator.validate(email)) {
      return NextResponse.json(
        {
          message: "Invalid email address",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return NextResponse.json(
        {
          status: 400,
          message: "Email or username already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    const saveUser = await newUser.save();
    return NextResponse.json(
      {
        message: "User created successfully",
        data: saveUser,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    const { userId, username } = reqBody;

    if (!userId || !username) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          message: "Invalid user ID",
        },
        {
          status: 400,
        }
      );
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    ).select("-password");

    if (!updateUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        data: updateUser,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          message: "Invalid user ID or userid required",
        },
        {
          status: 400,
        }
      );
    }

    const deleteUser = await User.findByIdAndDelete(userId).select("-password");
    if (!deleteUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "User deleted successfully",
        data: deleteUser,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
};
