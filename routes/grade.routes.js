import { Router } from "express";
import errorHandler from "../handler/error.handler.js";
import protect from "../middleware/protect.middleware.js";
import checkRole from "../middleware/checkRole.middleware.js";
import { response } from "../utils/response.js";
import User from "../model/user.model.js";
import Grade from "../model/grade.model.js";
import Subject from "../model/subject.model.js";

const router = Router();

router.post(
  "/:id/add-grade",
  protect,
  checkRole,
  errorHandler(async (req, res, next) => {
    const teacher = req.user;
    console.log(teacher);
    const { grade, subject_id } = req.body;

    if (!grade || !subject_id) {
      return response(res, 400, "All fields required 'grade - subject'");
    }

    if (grade < 0 || grade > 100) {
      return response(res, 400, "Grade must be between 0 and 100");
    }

    const subject = await Subject.findById(subject_id);
    if (!subject) {
      return response(res, 404, "Subject not found");
    }

    const student = await User.findById(req.params.id);
    if (!student) {
      return response(res, 404, "Student not found");
    }

    const studentGrade = new Grade({
      grade,
      student: student._id,
      subject: subject_id,
      teacher: teacher.id,
    });
    await studentGrade.save();

    return response(res, 201, null, {
      message: "Grade added successfully for student",
      grade: studentGrade,
    });
  })
);

router.get(
  "/:id",
  protect,
  checkRole,
  errorHandler(async (req, res, next) => {
    const teacher = req.user;
    console.log(teacher);

    const student = await User.findById(req.params.id);
    if (!student) {
      return response(res, 404, "Student not found");
    }

    const grades = await Grade.find({ student: student.id }).populate([
      {
        path: "subject",
        select: "name",
      },
      {
        path: "student",
        select: "fullname",
      },
      {
        path: "teacher",
        select: "fullname",
      },
    ]);

    return response(res, 200, null, {
      message: "Grades fetched successfully",
      student: {
        id: student._id,
        fullname: student.fullname,
        email: student.email,
      },
      grades,
    });
  })
);

export default router;
