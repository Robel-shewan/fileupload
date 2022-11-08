import asyncHandler from "express-async-handler";
import { unlinkSync } from "fs";
import multer from "multer";
import { mkdir } from "fs";
import path from "path";

import FileUpload from "../models/fileupload"

const storage = multer.diskStorage({
  destination(req, file, cb) {
    mkdir("./public/ProductsImages", (err) => {
      cb(null, "./public/ProductsImages");
    });
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

var maxSize = 1 * 1000 * 1000;

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

export const postFileUpload = asyncHandler(async (req: any, res: any, next) => {
 
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(418)
        .send({ message: "The file size is too large !!!" });
    }
    let pic = `/${req.file.path}`;
    pic = pic.split("/public")[1];

    let file = {
      name: req.file.originalname,
      size: req.file.size,
      date:Date.now()
    };

  const newfile= await FileUpload.create(file);
  res.status(200).send(newfile);
});

export const getFiles = asyncHandler(async (req: any, res: any, next) => {
  const files = await FileUpload.findAll();
  res.status(200).send(files);
});

export const deleteImage = asyncHandler(async (req: any, res: any, next) => {
  const { id } = req.params;

  let file = await FileUpload.findUnique({
    where: {
      id,
    },
  });

  if (!file)
    return res.status(404).json({ message: "The file is not Found!!" });

  await FileUpload.delete({
    where: {
      id: file.id,
    },
  });

  const oldPath = file.fileName;
  const path = oldPath.split("/");

  // Remove the File from the file storage
  if (oldPath && oldPath.includes("image")) {
    unlinkSync("upload/" + path[2]);
  }
  res.status(200).json({ message: "SuccessFully Delete the Images !!!" });
});
