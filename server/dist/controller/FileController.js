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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const FileUpload = require("../models").
;
const postFileUpload = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = ValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let info = {
        name: req.body.name,
        description: req.body.description,
        quantity_on_stock: req.body.quantity_on_stock,
    };
    const product = yield Product.create(info);
    res.status(200).send(product);
}));
const getFiles = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () { }));
const deleteImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { imageName } = req.query;
    console.log(req.query);
    let company = yield prisma.companyProfile.findUnique({
        where: {
            id,
        },
    });
    const image = yield prisma.images.findFirst({
        where: {
            path: imageName,
        },
    });
    if (!image)
        return res.status(404).json({ message: "The image is not Found!!" });
    yield prisma.images.delete({
        where: {
            id: image.id,
        },
    });
    const newimage = company.images.filter((data) => data !== image.path);
    company = yield prisma.companyProfile.update({
        where: { id },
        data: {
            images: newimage,
        },
    });
    const oldPath = image.path;
    const path = oldPath.split("/");
    // Remove the File from the file storage
    if (oldPath && oldPath.includes("image")) {
        unlinkSync("public/CompanyProfile/" + path[2]);
    }
    res.status(200).json({ message: "SuccessFully Delete the Images !!!" });
}));
exports = { getFiles, deleteImage };
