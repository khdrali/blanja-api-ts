"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, "uploads/images/");
        }
        else if (file.mimetype.startsWith("video/")) {
            cb(null, "uploads/videos/");
        }
        else {
            cb(new Error("File harus berupa gambar atau video"), "");
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // Nama file unik
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/")) {
        cb(null, true);
    }
    else {
        cb(new Error("File harus berupa gambar atau video"), false);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
exports.default = upload;
