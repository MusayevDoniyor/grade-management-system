import jwt from "jsonwebtoken";
import { response } from "../utils/response.js";
import User from "../model/user.model.js";

const protect = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer ")) {
      return response(res, 401, "Invalid token");
    }

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id).select("-password");
    console.log(req.user);

    if (!req.user) {
      return response(res, 401, "User not found");
    }

    next();
  } catch (error) {
    return response(res, 401, "Error on checking token!");
  }
};

export default protect;
