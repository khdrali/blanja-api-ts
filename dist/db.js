"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const postgres_1 = __importDefault(require("postgres"));
const connect = (0, postgres_1.default)({
    host: "localhost",
    port: 5432,
    database: "recipe",
    username: "postgres",
    password: "postgres",
});
exports.default = connect;
