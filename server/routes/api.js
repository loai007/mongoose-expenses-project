const express = require("express");
const router = express.Router();
const Expenses = require("../model/Expense");
const moment = require("moment");

router.get("/expenses", function (req, res) {
  const numberOfDatesInQuery = Object.keys(req.query).length;
  switch (numberOfDatesInQuery) {
    case 0:
      {
        Expenses.find({})
          .sort({ date: -1 })
          .exec(function (err, expenses) {
            res.send(expenses);
            res.end();
          });
      }
      break;
    case 1:
      {
        let d1 = moment(req.query["d1"]).toISOString();
        Expenses.find({ date: { $gt: d1 } }, function (err, expense) {
          res.send(expense);
          res.end();
        });
      }
      break;
    case 2:
      {
        let d1 = moment(req.query["d1"]).toISOString();
        let d2 = moment(req.query["d2"]).toISOString();
        if (d1 > d2) {
          Expenses.find(
            { date: { $gt: d2, $lt: d1 } },
            function (err, expense) {
              res.send(expense);
              res.end();
            }
          );
        } else {
          Expenses.find(
            { date: { $gt: d1, $lt: d2 } },
            function (err, expense) {
              res.send(expense);
              res.end();
            }
          );
        }
      }
      break;
  }
});

router.post("/expense", function (req, res) {
  const newExpense = new Expenses({
    item: `${req.body.item}`,
    amount: `${req.body.amount}`,
    group: `${req.body.group}`,
    date: `${req.body.date}`
      ? moment(`${req.body.date}`).format("LLLL")
      : new Date(moment().format("LLLL")),
  });
  newExpense.save();
  res.end();
});

router.put("/update/:group1", function (req, res) {
  const oldgroup = req.params.group1;
  let expenseItem;
  let expenseNewGroup = req.body.updateToGroup;
  Expenses.findOne({ group: oldgroup }, function (err, expense) {
    expense.group = expenseNewGroup;
    expenseItem = expense.item;
    expense.save();
  });
  res.send(
    "The expense item: " +
      expenseItem +
      "group was updated from " +
      oldgroup +
      "to " +
      expenseNewGroup
  );
  res.end();
});

router.get("/expenses/:group/:total", function (req, res) {
  const requestedGroup = req.params.group;
  const isTotal = req.params.total;
  if (isTotal === "true") {
    Expenses.aggregate(
      [
        {
          $match: { group: requestedGroup },
        },
        {
          $group: { _id: "$group", totalExpensePerGroup: { $sum: "$amount" } },
        },
      ],
      function (err, expense) {
        res.send(expense);
        res.end();
      }
    );
  } else {
    Expenses.find({ group: requestedGroup }, function (err, expenses) {
      res.send(expenses);
      res.end();
    });
  }
});

module.exports = router;
