import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  fullname: { type: String, minLength: 6, trim: true, required: true },
  email: { type: String, unique: true, trim: true, required: true },
  password: { type: String, required: true, minLength: 6 },
  role: { type: String, enum: ["teacher", "student"], default: "student" },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  console.log(this.password);
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
