import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;
