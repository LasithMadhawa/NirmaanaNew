const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/getDataForReport", (req, res, next) => {
  console.log("This is generating reports");
  result = [];
  sorted = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  User.find().then(response => {
    console.log(response);
  });
  User.aggregate([
    {
      $project: {
        month: { $month: "$creationDate" },
        year: { $year: "$creationDate" }
      }
    }
  ]).then(response => {
    console.log(response);
    result = response;
    result.forEach(element => {
      for (var x = 0; x < 12; x++) {
        if (element.month == x + 1) {
          sorted[x] += 1;
        }
      }
    });
    console.log(sorted);
    res.status(200).json({
      data: sorted
    });
  });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const user = {
    isDesigner: req.body.isDesigner,
    skills: req.body.skills,
    description: req.body.description
  };
  User.updateOne({ _id: req.params.id }, user)
    .then(result => {
      res.status(201).json({
        message: "User Updated!",
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.put("/addtofavourites/:id", (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    { $push: { favourites: req.body.artworkId } },
    () => {
      res.status(200).json({ message: "Added to favourites" });
    }
  );
});

router.put("/addtodownloads/:id", (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { downloads: req.body.artworkId } },
    () => {
      res.status(200).json({ message: "Added to downloads" });
    }
  );
});

router.put("/removefavourites/:id", (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    { $pull: { favourites: { $in: [req.body.artworkId] } } },
    { multi: true },
    () => {
      res.status(200).json({ message: "Removed from favourites" });
    }
  );
});

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User Created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed!"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed!!"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        isAdmin: fetchedUser.isAdmin
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: "Auth failed!!!"
      });
    });
});

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  });
});

router.get("/favourites/:id", (req, res, next) => {
  User.findById(req.params.id)
    .populate({
      path: "favourites",
      populate: { path: "favourites" },
      populate: { path: "designer" }
    })
    .then(user => {
      if (user) {
        // console.log(user);
        res.status(200).json({ favourites: user.favourites });
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    });
});

router.get("/downloads/:id", (req, res, next) => {
  User.findById(req.params.id)
    .populate({
      path: "downloads",
      populate: { path: "downloads" },
      populate: { path: "designer" }
    })
    .then(user => {
      if (user) {
        // console.log(user);
        res.status(200).json({ downloads: user.downloads });
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    });
});

module.exports = router;
