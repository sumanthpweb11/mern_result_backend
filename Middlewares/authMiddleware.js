import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const emptoken = req.headers.authorization.split(" ")[1];
  if (!emptoken)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided.", success: false });
  try {
    const decoded = jwt.verify(emptoken, process.env.JWT_SECRET);
    req.body.employeeId = decoded.employeeId;
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Access denied. Invalid token.", success: false });
  }
};
