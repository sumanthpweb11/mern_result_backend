import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import employeeModel from "../models/employeeModel.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// register new employee

router.post("/register", async (req, res) => {
  try {
    const employeeExists = await employeeModel.findOne({
      employeeId: req.body.employeeId,
    });
    if (employeeExists) {
      return res.status(200).send({
        message: "Employee already exists",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const newEmployee = new employeeModel(req.body);
    await newEmployee.save();
    res.status(200).send({
      message: "Registration successful , Please wait for admin approval",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      succes: false,
    });
  }
});

// login employee
router.post("/login", async (req, res) => {
  try {
    const employee = await employeeModel.findOne({
      employeeId: req.body.employeeId,
    });
    if (!employee) {
      return res.status(200).send({
        message: "Employee not found",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, employee.password);
    if (!isMatch) {
      return res.status(200).send({
        message: "Invalid password",
        success: false,
      });
    }
    if (employee.isApproved === false) {
      return res.status(200).send({
        message: "Your account is not approved yet",
        success: false,
      });
    }

    const emptoken = jwt.sign(
      { employeeId: employee._id },

      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).send({
      message: "Login successful",
      success: true,
      data: emptoken,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// get employee by id for JSONWEBTOKEN VERITIFICATION

router.post("/get-employee-by-id", authMiddleware, async (req, res) => {
  try {
    // console.log(req.body);
    const employee = await employeeModel.findOne({
      _id: req.body.employeeId,
    });
    if (!employee) {
      return res.status(200).send({
        message: "Employee not found",
        success: false,
      });
    }
    employee.password = undefined;
    res.status(200).send({
      message: "Employee found",
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// GET ALL EMPLOYEES
router.post("/get-all-employees", authMiddleware, async (req, res) => {
  try {
    const employees = await employeeModel.find({});

    res.status(200).send({
      message: "Employees fetched successfully",
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get Employee by Employee Id Number
router.post("/get-employee/:employeeId", authMiddleware, async (req, res) => {
  try {
    const employee = await employeeModel.findOne({
      employeeId: req.params.employeeId,
    });
    if (!employee) {
      return res.send({
        message: "Employee not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Employee fetched successfully",
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// update employee
router.post(
  "/update-employee/:employeeId",
  authMiddleware,
  async (req, res) => {
    try {
      const employee = await employeeModel.findOneAndUpdate(
        { employeeId: req.params.employeeId },
        req.body.payload,
        { new: true }
      );
      if (!employee) {
        return res.send({
          message: "Employee not found",
          success: false,
        });
      }
      res.status(200).send({
        message: "Employee updated successfully",
        success: true,
        data: employee,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        success: false,
      });
    }
  }
);

export default router;
