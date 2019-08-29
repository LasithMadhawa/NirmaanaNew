const express = require("express");
const checkAuth = require("../middleware/check-auth");
const Payment = require("../models/payment");
const router = express.Router();

router.get("/getDataForReport", (req, res, next) => {
  console.log("This is generating reports - Payments");
  result = [];
  sorted = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  Payment.aggregate([
    {
      $project: {
        month: { $month: "$creationDate" },
        year: { $year: "$creationDate" },
        price: "$price"
      }
    }
  ]).then(response => {
    console.log(response);
    result = response;
    result.forEach(element => {
      for (var x = 0; x < 12; x++) {
        if (element.month == x + 1) {
          sorted[x] += element.price;
        }
      }
    });
    console.log(sorted);
    res.status(200).json({
      data: sorted
    });
  });
});

router.post("", checkAuth, (req, res, next) => {
  // console.log("Enter payment");
  const payment = new Payment({
    artworkId: req.body.artworkId,
    userId: req.body.userId,
    price: req.body.price
  });
  payment.save().then(addedPayment => {
    // console.log(addedPayment);
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
  Payment.find({ artworkId: artworkId, userId: userId }).then(doc => {
    // console.log(doc);
    if (doc.length === 1) {
      res.json({ isPaid: true });
    } else {
      res.json({ isPaid: false });
    }
  });
});

router.get("", (req, res, next) => {
  // console.log("Enter to payments");
  Payment.find().then(payments => {
    console.log(payments);
    res.status(200).json({
      message: "Payments fetched",
      payments: payments
    });
  });
});

module.exports = router;
