import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  grade: { type: Number, min: 0, max: 100, required: true },
});

const Grade = mongoose.model("Subject", gradeSchema);
export default Grade;
