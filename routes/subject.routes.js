import { Router } from "express";
const router = Router();
import { response } from "../utils/response.js";
import User from "../model/user.model.js";
import Subject from "../model/subject.model.js";
import errorHandler from "../handler/error.handler.js";
import protect from "../middleware/protect.middleware.js";
import checkRole from "../middleware/checkRole.middleware.js";

router.post(
  "/",
  protect,
  checkRole,
  errorHandler(async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
      return response(res, 400, "All fields required 'name'");
    }

    const teacher = await User.findById(req.user._id).populate(
      "fullname email"
    );
    if (!teacher) {
      return response(res, 400, "Teacher not found!");
    }

    const subject = new Subject({
      name,
      teacher,
    });
    await subject.save();

    return response(res, 201, null, {
      message: "Subject added successfully",
      subject,
    });
  })
);

router.get(
  "/",
  errorHandler(async (req, res, next) => {
    const subjects = await Subject.find().populate("teacher", "fullname email");

    return response(res, 200, null, {
      message: "successful get",
      subjects,
    });
  })
);

export default router;
