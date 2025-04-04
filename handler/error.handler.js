import { response } from "../utils/response.js";

const errorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      return response(res, 500, err.message);
    });
  };
};

export default errorHandler;
