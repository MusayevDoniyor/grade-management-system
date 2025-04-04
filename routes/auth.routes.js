import { Router } from "express";
import errorHandler from "../handler/error.handler.js";
import User from "../model/user.model.js";
import { response } from "../utils/response.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/register",
  errorHandler(async (req, res) => {
    const { fullname, email, password, role = "student" } = req.body;

    if (!fullname || !email || !password)
      return response(
        res,
        400,
        "All fields required 'fullname - email - password'"
      );

    const isUserExists = await User.findOne({ email });
    if (isUserExists)
      return response(res, 409, "User already exists with this email!"); // 409 - Conflict

    const newUser = new User({ fullname, email, password, role });
    await newUser.save();

    response(res, 201, null, {
      message: "User successfully registered",
      user: {
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
      },
    });
  })
);

router.post(
  "/login",
  errorHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return response(res, 400, "All fields required 'email - password'");
    }

    const user = await User.findOne({ email });
    if (!user) return response(res, 404, "User not found");

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return response(res, 401, "User password is incorrect"); // 401 - Unauthorized

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
    });

    response(res, 200, null, {
      message: "User successfully logged in",
      user: { fullname: user.fullname, email: user.email, role: user.role },
      token,
    });
  })
);

router.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response(res, 200, null, { message: "Logged out successfully" });
});

export default router;
