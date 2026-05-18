"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../utils/ApiError");
const validateRequest = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map((e) => e.msg).join(', ');
        return next(new ApiError_1.ApiError(422, message));
    }
    next();
};
exports.validateRequest = validateRequest;
