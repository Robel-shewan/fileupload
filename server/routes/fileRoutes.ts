import { deleteImage, getFiles } from "./../controller/FileController";
import express from "express";
import e from "express";

const router = express.Router();

router.route("/").get(getFiles);

router.route("/:id").delete(deleteImage);

export default router;
