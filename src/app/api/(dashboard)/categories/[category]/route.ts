import connectDB from "@/config/database";
import User from "@/models/user";
import Category from "@/models/category";
import { Types } from "mongoose";
import { NextResponse, NextRequest } from "next/server";

connectDB();

export const PATCH = async (req: NextRequest, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { title } = await req.json();

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
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
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const category = await Category.findOne({
      _id: categoryId,
      user: userId,
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found for this user.",
        },
        {
          status: 404,
        }
      );
    }

    const updateCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );
    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully.",
        category: updateCategory,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred while updating the user.",
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req: NextRequest, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID.",
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
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const category = await Category.findOneAndDelete({
      _id: categoryId,
      user: userId,
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found for this user.",
        },
        {
          status: 404,
        }
      );
    }

    await Category.findByIdAndDelete(category);
    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully.",
        data: category,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "An error occurred while deleting the category.",
      },
      {
        status: 500,
      }
    );
  }
};
