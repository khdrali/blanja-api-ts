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
exports.getCategoryController = exports.addCategoryController = void 0;
const category_1 = require("../models/category");
const sendResponse_1 = require("../utils/sendResponse");
const addCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req === null || req === void 0 ? void 0 : req.body;
        if (!category) {
            (0, sendResponse_1.sendResponse)(res, 400, false, "Category not be empty");
            return;
        }
        const upperCase = category.toUpperCase();
        yield (0, category_1.addCategoryModels)(upperCase);
        (0, sendResponse_1.sendResponse)(res, 200, true, "Successfully add category");
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false);
    }
});
exports.addCategoryController = addCategoryController;
const getCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, category_1.getCategoryModels)();
        (0, sendResponse_1.sendResponse)(res, 200, true, "Successfuly Get Category", result);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false);
    }
});
exports.getCategoryController = getCategoryController;
