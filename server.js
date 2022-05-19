// const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const api = require("./server/routes/api");

const request = require("request");
const mongoose = require("mongoose");
const Expense = require("./server/model/Expense");
const data = require("./expenses.json");

mongoose.connect("mongodb://localhost/mongoose-Expenses-Project");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 4000;
app.listen(port, function () {
  console.log(`Server running on ${port}`);
});

app.use("/", api);

// for (d of data) {
//   let expense = new Expense({
//     amount: d.amount,
//     group: d.group,
//     date: d.date,
//     item: d.item,
//   });
//   expense.save();
// }
// console.log("Done");
