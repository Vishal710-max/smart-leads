"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const asyncWrapper_1 = require("../utils/asyncWrapper");
const env_1 = require("../config/env");
const signToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, {
        expiresIn: env_1.env.JWT_EXPIRES_IN,
    });
};
exports.register = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { name, email, password, role } = req.body;
    const existing = await User_1.User.findOne({ email });
    if (existing)
        throw new ApiError_1.ApiError(409, 'Email already in use');
    const user = await User_1.User.create({ name, email, password, role });
    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const token = signToken(payload);
    res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
});
exports.login = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError_1.ApiError(401, 'Invalid email or password');
    }
    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const token = signToken(payload);
    res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
});
exports.getMe = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const user = await User_1.User.findById(req.user?.id).select('-password');
    if (!user)
        throw new ApiError_1.ApiError(404, 'User not found');
    res.json({ success: true, user });
});
