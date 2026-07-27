"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(`${req.method} ${req.url} - Error caught: ${err.message}`, err);
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || undefined;
    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Failed';
        errors = Object.values(err.errors || {}).map((e) => e.message);
    }
    // Handle Mongoose Cast Error (e.g. invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid resource ID format';
    }
    // Handle MongoDB Duplicate Key Error (code 11000)
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate key error: Resource already exists';
        const keys = Object.keys(err.keyValue || {});
        errors = keys.map(key => `${key} must be unique`);
    }
    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};
exports.errorHandler = errorHandler;
