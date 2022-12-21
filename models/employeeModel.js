import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const employeeModel = mongoose.model("employees", employeeSchema);

export default employeeModel;
