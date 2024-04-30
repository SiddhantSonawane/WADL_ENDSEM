const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Student = require("./models");
const dbConfig = require("./config");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(dbConfig.url)
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(() => {
    console.log("Could not connect to database", err);
    process.exit();
  });

app.use("/css", express.static(path.resolve(__dirname, "static/css")));

app.get("/", (req, res) => {
  Student.find()
    .then((student) => {
      res.render("index", { student: student });
    })
    .catch((err) => {
      res.status(500).send("Error fetching student data");
    });
});

app.post("/addmarks", (req, res) => {
  var myData = new Student(req.body);
  myData
    .save()
    .then((item) => {
      console.log("item saved to database");
      res.redirect("/getMarks");
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

app.get("/getMarks", (req, res) => {
  console.log(req.query);
  Student.find(req.query)
    .then((student) => {
      res.render("table", { student: student });
    })
    .catch((err) => {
      res.json({ message: "err" });
    });
});

app.get("/dsbdaGreaterThan20", (req, res) => {
  Student.find({ dsbda_marks: { $gt: 20 } })
    .then((student) => {
      res.render("table", { student: student });
    })
    .catch((err) => {
      res.json({ message: "err" });
    });
});

app.get("/allgreaterthan25", (req, res) => {
  Student.find({ wad_marks: { $gt: 25 }, cc_marks: { $gt: 25 }, dsbda_marks: { $gt: 25 }, cns_marks: { $gt: 25 }, ai_marks:{ $gt: 25 } })
    .then((student) => {
      res.render("table", { student: student });
    })
    .catch((err) => {
      res.json({ message: "err" });
    });
});

app.get("/below40WadCc", (req, res) => {
  Student.find({ wad_marks: { $lt: 40 }, cc_marks: { $lt: 40 } })
    .then((student) => {
      res.render("table", { student: student });
    })
    .catch((err) => {
      console.error("Error fetching students:", err);
      res.status(500).json({ error: "Error fetching students" });
    });
});


app.post("/deleteStudent/:id", (req, res) => {
  Student.findByIdAndDelete(req.params.id).then((student) => {
    console.log("Deleted Successfully");
    res.redirect("/getMarks");
  });
});

app.post("/updateMarks/:id", (req, res) => {
  const id = req.params.id;
  const { updatedWadMarks, updatedDsbdaMarks, updatedCnsMarks, updatedCcMarks, updatedAiMarks } = req.body;

  Student.findByIdAndUpdate(id, { 
    $set: {
      wad_marks: updatedWadMarks,
      dsbda_marks: updatedDsbdaMarks,
      cns_marks: updatedCnsMarks,
      cc_marks: updatedCcMarks,
      ai_marks: updatedAiMarks
    }
  }, { new: true })
    .then((updatedStudent) => {
      console.log("Marks updated successfully");
      res.redirect("/getMarks");
    })
    .catch((err) => {
      console.error("Error updating marks:", err);
      res.status(500).send("Error updating marks");
    });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});