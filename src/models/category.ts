import mongoose from "mongoose";

const categoryScehma = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.category || mongoose.model("category", categoryScehma);
export default Category;
