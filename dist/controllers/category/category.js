"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoryController = exports.getCategoryController = exports.addCategoryController = void 0;
const category_1 = require("../../models/category/category");
const sendResponse_1 = require("../../utils/sendResponse");
const addCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req === null || req === void 0 ? void 0 : req.body;
        if (!category) {
            res
                .status(400)
                .json((0, sendResponse_1.errorResponse)(req, "Category not be empty", 400, "error"));
            return;
        }
        const upperCase = category.toUpperCase();
        yield (0, category_1.addCategoryModels)(upperCase);
        res
            .status(200)
            .json((0, sendResponse_1.sendResponses)(req, null, "Successfully add category", 200));
    }
    catch (error) {
        let message = "Internal Server Error";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(500).json((0, sendResponse_1.errorResponse)(req, message, 500, "error"));
    }
});
exports.addCategoryController = addCategoryController;
const getCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, category_1.getCategoryModels)();
        res
            .status(200)
            .json((0, sendResponse_1.sendResponses)(req, result, "Successfuly Get Category", 200));
    }
    catch (error) {
        let message = "Internal Server Error";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(500).json((0, sendResponse_1.errorResponse)(req, message, 500, "error"));
    }
});
exports.getCategoryController = getCategoryController;
const UpdateCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req === null || req === void 0 ? void 0 : req.body;
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        const updateCategory = {
            id: id,
            category: category,
        };
        if (!id) {
            res === null || res === void 0 ? void 0 : res.status(400).json((0, sendResponse_1.errorResponse)(req, "params id is required", 500, "error"));
        }
        const result = yield (0, category_1.UpdateCategoryModels)(updateCategory);
        if (result.length === 0) {
            res
                .status(404)
                .json((0, sendResponse_1.errorResponse)(req, "Category not found", 404, "error"));
        }
        res === null || res === void 0 ? void 0 : res.status(200).json((0, sendResponse_1.sendResponses)(req, null, "Successfuly Update Category", 200));
    }
    catch (error) {
        let message = "Internal Server Error";
        if (error instanceof Error) {
            message = error.message;
        }
        res === null || res === void 0 ? void 0 : res.status(500).json((0, sendResponse_1.errorResponse)(req, message, 500, "error"));
    }
});
exports.UpdateCategoryController = UpdateCategoryController;
