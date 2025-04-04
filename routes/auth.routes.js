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
        500,
        "All fields required 'fullname - email - password'"
      );

    const isUserExists = await User.findOne({ email });
    if (isUserExists)
      return response(res, 500, "User already exists with this email!");

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
      throw Error("All fields required 'fullname - email - password'");
    }

    const user = await User.findOne({ email });
    if (!user) return response(res, 404, "User not found");

    const isPasswordCorrect = await user.comparePassword(user.password);
    if (!isPasswordCorrect) return response(res, 404, "User not found");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

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
    secure: true,
    sameSite: "strict",
  });

  return response(res, 200, null, { message: "Logged out successfully" });
});

export default router;
