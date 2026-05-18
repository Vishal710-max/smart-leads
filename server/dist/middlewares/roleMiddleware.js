"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const ApiError_1 = require("../utils/ApiError");
const requireRole = (...roles) => {
    return (req, _res, next) => {
        if (!req.user)
            return next(new ApiError_1.ApiError(401, 'Not authenticated'));
        if (!roles.includes(req.user.role)) {
            return next(new ApiError_1.ApiError(403, 'You do not have permission to perform this action'));
        }
        next();
    };
};
exports.requireRole = requireRole;
