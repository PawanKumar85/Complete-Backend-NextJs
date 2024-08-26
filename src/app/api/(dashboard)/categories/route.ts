import connectDB from "@/config/database";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import Category from "@/models/category";

connectDB();

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const categories = await Category.find({ user: userId });
    return NextResponse.json(
      {
        success: true,
        categories,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
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
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { title } = await req.json();

    if (!userId || !title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and user ID are required",
        },
        {
          status: 400,
        }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        {
          status: 400,
        }
      );
    }

    const user = User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const category = new Category({ user : userId, title });
    const saveCategory = await category.save();

    return NextResponse.json(
      {
        success: true,
        category: saveCategory,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
