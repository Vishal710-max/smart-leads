"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnv = (key, fallback) => {
    const value = process.env[key] ?? fallback;
    if (!value)
        throw new Error(`Missing environment variable: ${key}`);
    return value;
};
exports.env = {
    PORT: parseInt(getEnv('PORT', '5000'), 10),
    MONGODB_URI: getEnv('MONGODB_URI'),
    JWT_SECRET: getEnv('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
    NODE_ENV: getEnv('NODE_ENV', 'development'),
};
