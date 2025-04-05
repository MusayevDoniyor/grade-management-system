import { response } from "../utils/response.js";

const checkRole = (req, res, next) => {
  if (req.user.role === "student") {
    return response(res, 401, "You don't have access");
  }

  next();
};

export default checkRole;
