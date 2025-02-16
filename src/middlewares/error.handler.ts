const errorHandler = (err, req, res, next) => {
    let statusCode = 400;
    let message = err.message ?? "Internal Server Error";

    // 🔹 Handle Mongoose Validation Errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val: { message: string }) => val.message).join(", ");
    }

    // 🔹 Handle MongoDB Duplicate Key Error
    else if (err.code === 11000) {
        statusCode = 409; // Conflict
        const key = Object.keys(err.keyValue)[0];
        message = `${key} already exists. Please use a different value.`;
    }

    // 🔹 Handle Mongoose Cast Errors (Invalid ObjectId)
    else if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // 🔹 Handle Express Validation Errors (like express-validator)
    else if (err.errors && Array.isArray(err.errors)) {
        statusCode = 400;
        message = err.errors.map(error => error.msg).join(", ");
    }

    // 🔹 Handle JWT Authentication Errors
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token, please log in again.";
    }

    else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Session expired, please log in again.";
    }

    // 🔹 Send the error response
    res.status(statusCode).json({
        success: false,
        message,
    });
};
export { errorHandler }