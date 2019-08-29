const express = require("express");
const checkAuth = require("../middleware/check-auth");
const Payment = require("../models/payment");
const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  console.log("Enter payment");
  const payment = new Payment({
    artworkId: req.body.artworkId,
    userId: req.body.userId,
    price: req.body.price
  });
  payment.save().then(addedPayment => {
    console.log(addedPayment);
    res.status(201).json({
      message: "Payment added successfully!",
      artwork: {
        ...addedPayment
      }
    });
  });
});

router.get("/isPaid/:userId/:artworkId", (req, res, next) => {
  let artworkId = req.params.artworkId;
  let userId = req.params.userId;
  console.log(artworkId + "Oh yeah");
  Payment.find({ artworkId: artworkId, userId: userId }).then(doc => {
    console.log(doc);
    if (doc.length === 1) {
      res.json({ isPaid: true });
    } else {
      res.json({ isPaid: false });
    }
  });
});

router.get("", (req, res, next) => {
  console.log("Enter to payments");
  Payment.find().then(payments => {
    console.log(payments);
    res.status(200).json({
      message: "Payments fetched",
      payments: payments
    });
  });
});

module.exports = router;
