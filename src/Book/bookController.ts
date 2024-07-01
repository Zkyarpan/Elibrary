import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";
import { uploadToCloudinary, getFilePath } from "../utils/fileUpload";

const createBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, genre } = req.body;
    const files = req.files as { [filename: string]: Express.Multer.File[] };

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const coverImagePath = getFilePath(files.coverImage[0].filename);
    const coverImageUrl = await uploadToCloudinary(
      coverImagePath,
      "book-covers",
      files.coverImage[0].filename,
      coverImageMimeType as string
    );

    const bookFilePath = getFilePath(files.file[0].filename);
    const bookFileUrl = await uploadToCloudinary(
      bookFilePath,
      "book-files",
      files.file[0].filename,
      "pdf",
      "raw"
    );

    const newBook = await bookModel.create({
      title,
      genre,
      author: req.userId,
      coverImage: coverImageUrl,
      file: bookFileUrl,
    });

    res.status(200).json({
      status: 200,
      success: true,
      id: newBook._id,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while uploading the files"));
  }
};

const updateBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, genre } = req.body;
    const bookId = req.params.id;
    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    if (book.author.toString() !== req.userId) {
      return next(createHttpError(403, "You cannot update others' book."));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let coverImageUrl = book.coverImage;
    let bookFileUrl = book.file;

    if (files.coverImage) {
      const coverImagePath = getFilePath(files.coverImage[0].filename);
      const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
      coverImageUrl = await uploadToCloudinary(
        coverImagePath,
        "book-covers",
        files.coverImage[0].filename,
        coverImageMimeType as string
      );
    }

    if (files.file) {
      const bookFilePath = getFilePath(files.file[0].filename);
      bookFileUrl = await uploadToCloudinary(
        bookFilePath,
        "book-pdfs",
        files.file[0].filename,
        "pdf",
        "raw"
      );
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: bookId },
      {
        title,
        description,
        genre,
        coverImage: coverImageUrl,
        file: bookFileUrl,
      },
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    return next(createHttpError(500, "Error while updating the book"));
  }
};

const listBooks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const book = await bookModel.find({});
  res.json(book);
  res.json({});
  try {
  } catch (error) {
    return next(createHttpError(500, "Error while fetching books"));
  }
};

export { createBook, updateBook, listBooks };
