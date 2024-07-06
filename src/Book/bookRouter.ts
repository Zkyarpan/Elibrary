import express from "express";
import multer from "multer";
import path from "node:path";

import authenticate from "../middlewares/authenticate";
import {
  createBook,
  updateBook,
  listBooks,
  getSingleBook,
  deleteBook,
} from "./bookController";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 1e7 }, // 10 MB
});

// Routes
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRouter.patch(
  "/:id",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

bookRouter.get("/", listBooks);
bookRouter.get("/:id", getSingleBook);
bookRouter.delete("/:id", authenticate, deleteBook);

export default bookRouter;
