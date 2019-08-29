const express = require("express");
const multer = require("multer");

const Artwork = require("../models/artwork");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/octet-stream": "rar"
};

// const ZIP_MIME_TYPE_MAP = {
//   "zipFile/rar": "rar"
// };

// const imgStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("Invalid mime type oooii");
//     if (isValid) {
//       error = null;
//     }
//     cb(null, "backend/images");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname
//       .toLowerCase()
//       .split(" ")
//       .join("-");
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, name + "-" + Date.now() + "." + ext);
//   }
// });

// const zipStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const isValid = ZIP_MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("Invalid mime type yakoo");
//     if (isValid) {
//       error = null;
//     }
//     cb(error, "backend/files");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname
//       .toLowerCase()
//       .split(" ")
//       .join("-");
//     const ext = ZIP_MIME_TYPE_MAP[file.mimetype];
//     cb(null, name + "-" + Date.now() + "." + ext);
//   }
// });

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).fields([
    { name: "image", maxCount: 1 },
    { name: "zipFile", maxCount: 1 }
  ]),
  // multer({ storage: zipStorage }).array("zipFile"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const artwork = new Artwork({
      title: req.body.title,
      preview: req.body.preview,
      imagePath: url + "/images/" + req.files.image[0].filename,
      zipFilePath: url + "/images" + req.files.zipFile[0].filename,
      tags: JSON.parse(req.body.tags),
      designer: req.userData.userId,
      price: parseInt(req.body.price)
    });
    artwork.save().then(addedArtwork => {
      res.status(201).json({
        message: "Artwork added successfully!",
        artwork: {
          ...addedArtwork,
          id: addedArtwork._id
        }
      });
    });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).fields([
    { name: "image", maxCount: 1 },
    { name: "zipFile", maxCount: 1 }
  ]),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    let zipFilePath = req.body.zipFilePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.files[0].filename;
      zipFilePath = url + "/images" + req.files.zipFile[0].filename;
    }
    const artwork = new Artwork({
      _id: req.body._id,
      title: req.body.title,
      preview: req.body.preview,
      imagePath: imagePath,
      zipFilePath: zipFilePath,
      tags: JSON.parse(req.body.tags),
      designer: req.userData.userId,
      price: parseInt(req.body.price)
    });
    Artwork.updateOne(
      { _id: req.params.id, designer: req.userData.userId },
      artwork
    ).then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Updated Successfully" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    });
  }
);

router.get("", (req, res, next) => {
  Artwork.find()
    .populate("designer")
    .then(documents => {
      res.status(200).json({
        message: "Artworks fetched successfully",
        artworks: documents
      });
    });
});

router.get("/searchByTag", (req, res, next) => {
  let tag = req.query.searchTag;
  Artwork.find({ "tags.value": tag })
    .populate("designer")
    .then(documents => {
      res.status(200).json({
        message: "Artworks fetched successfully",
        artworks: documents
      });
    });
});

router.get("/searchByDesigner", (req, res, next) => {
  let designerId = req.query.designer;
  Artwork.find({ designer: designerId })
    .populate("designer")
    .then(documents => {
      res.status(200).json(documents);
    });
});

router.get("/:id", (req, res, next) => {
  Artwork.findById(req.params.id)
    .populate("designer")
    .then(artwork => {
      if (artwork) {
        res.status(200).json(artwork);
      } else {
        res.status(404).json({ message: "Artwork not found" });
      }
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Artwork.deleteOne({ _id: req.params.id }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Post Deleted!" });
    } else {
      res.status(401).json({ message: "Deletion Unsuccessful" });
    }
  });
});

module.exports = router;
