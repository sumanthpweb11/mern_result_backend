import express from "express";
import studentModel from "../models/studentModel.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Add New Student
router.post("/add-student", authMiddleware, async (req, res) => {
  try {
    const studentExists = await studentModel.findOne({
      rollNo: req.body.rollNo,
    });

    // const studentClass = await studentModel.findOne({ class: req.body.class });
    if (studentExists) {
      return res.status(200).send({
        message: "Student already exists",
        success: false,
      });
    }

    const newStudent = new studentModel(req.body);
    await newStudent.save();
    res.status(200).send({
      message: "Student added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      succes: false,
    });
  }
});

// get all students
router.post("/get-all-students", authMiddleware, async (req, res) => {
  try {
    const students = await studentModel.find(req?.body ? req.body : {});
    res.status(200).send({
      message: "Students fetched successfully",
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// get student by rollNo
router.post("/get-student/:rollNo", authMiddleware, async (req, res) => {
  try {
    const student = await studentModel.findOne({
      rollNo: req.params.rollNo,
    });
    if (!student) {
      return res.send({
        message: "Student not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Student fetched successfully",
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// update student
router.post("/update-student/:rollNo", authMiddleware, async (req, res) => {
  try {
    const student = await studentModel.findOneAndUpdate(
      { rollNo: req.params.rollNo },
      // {
      //   "$set": {
      //     "rollNo": req.params.rollNo,
      //     "class": req.params.class,
      //   },
      // },

      req.body,
      { new: true }
    );
    if (!student) {
      return res.send({
        message: "Student not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Student updated successfully",
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// delete student
router.post("/delete-student/:rollNo", authMiddleware, async (req, res) => {
  try {
    const student = await studentModel.findOneAndDelete({
      rollNo: req.params.rollNo,
    });
    if (!student) {
      return res.send({
        message: "Student not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Student deleted successfully",
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

export default router;
