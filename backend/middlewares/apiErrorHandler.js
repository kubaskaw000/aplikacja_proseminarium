import notFoundException from "../exceptions/notFoundException.js";
import validationException from "../exceptions/validationException.js";

function apiErrorHandler(err, req, res, next) {
  if (err instanceof validationException) {
    res.status(err.getCode()).send({ err, status: "failed" });
  } else if (err instanceof notFoundException) {
    res.status(err.getCode()).send({ err, status: "failed" });
  } else {
    next(err);
  }
}

export default apiErrorHandler;
