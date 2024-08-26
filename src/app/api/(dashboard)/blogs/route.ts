import User from "@/models/user";
import Category from "@/models/category";
import Blog from "@/models/blog";
import connectDB from "@/config/database";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeyword = searchParams.get("searchKeyword") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID or userid required",
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
          message: "Invalid category ID or categoryid required",
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

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    // TODO:
    if (searchKeyword) {
      filter.$or = [
        {
          title: { $regex: searchKeyword, $options: "i" },
        },
        {
          description: { $regex: searchKeyword, $options: "i" },
        },
      ];
    }

    // TODO:
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }

    // TODO:
    const skip = (page - 1) * limit;
    

    const blogs = await Blog.find(filter).sort({
      createdAt: "asc",
    });
    return NextResponse.json(
      {
        success: true,
        message: "Blogs fetched successfully.",
        data: blogs,
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

export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const { title, description } = await req.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID or userid required",
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
          message: "Invalid category ID or categoryid required",
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

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and description are required",
        },
        {
          status: 400,
        }
      );
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully.",
        data: newBlog,
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
