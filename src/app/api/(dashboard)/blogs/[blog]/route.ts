import connectDB from "@/config/database";
import Blog from "@/models/blog";
import Category from "@/models/category";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export const GET = async (req: NextRequest, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

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

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID",
        },
        {
          status: 400,
        }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog ID",
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

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found for this user and category.",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: blog,
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
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
};

export const PATCH = async (req: NextRequest, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const { title, description } = await req.json();

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

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog ID",
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

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found for this user.",
        },
        {
          status: 404,
        }
      );
    }

    const updateBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        description,
      },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Blog updated successfully.",
        data: updateBlog,
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
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req: NextRequest, context: { params: any }) => {
  const blogId = context.params.blog;
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

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog ID",
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

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found for this user.",
        },
        {
          status: 404,
        }
      );
    }

    await Blog.findByIdAndDelete(blogId);

    return NextResponse.json(
      {
        success: true,
        message: "Blog deleted successfully.",
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
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
};
