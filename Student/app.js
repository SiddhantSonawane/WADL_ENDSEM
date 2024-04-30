const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const Student = require('./models')
const dbConfig = require('./config')

const app = express();

app.set("view engine", "ejs")

app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())

mongoose.connect(dbConfig.url)
.then(()=>{
    console.log('DB connected Successfully!')
})
.catch((err)=>{
    console.log('Erro in DB connection, ', err);
})

app.listen(3000, ()=>{
    console.log('Server listening on PORT 3000')
})

app.use("/css", express.static(path.resolve(__dirname, "static/css")))

// home page
app.get("/", (req,res)=>{
    Student.find()
    .then((student)=>{
        res.render("index", {student: student})
    })
    .catch((err)=>{
        res.status(500).send("Error Opening Home Page");
    })
})

// add marks
app.post("/addmarks", (req,res)=>{
    const data = new Student(req.body)
    console.log('here')
    data.save()
    .then(()=>{
        res.redirect("/getmarks")
    })
    .catch((err)=>{
        res.json('error in adding marks', {message: err})
    })
})

// getmarks
app.get("/getmarks", (req,res)=>{
    Student.find(req.query)
    .then((student)=>{
        res.render("table", {student: student})
    })
    .catch((err)=>{
        res.json('error in getting marks', {message: err})
    })
})

//dsbda greater than 20
app.get("/dsbdagt20", (req,res)=>{
    Student.find({dsbda_marks: { $gt : 20} })
    .then((student)=>{
        res.render("table", {student: student})
    })
    .catch((err)=>{
        res.json('error in getting marks of dsbda', {message: err})
    })
})

// all greater than 25
app.get("/allgreaterthan25", (req,res)=>{
    Student.find({dsbda_marks: { $gt : 25}, cc_marks: { $gt : 25}, cns_marks: { $gt : 25}, wad_marks: { $gt : 25}})
    .then((student)=>{
        res.render("table", {student: student})
    })
    .catch((err)=>{
        res.json('error in getting marks greater than 25', {message: err})
    })
})

// lesser than 40
app.get("/below20inwadcc", (req,res)=>{
    Student.find({wad_marks: { $lt : 20} }, {cc_marks: { $lt : 20} })
    .then((student)=>{
        res.render("table", {student: student})
    })
    .catch((err)=>{
        res.json('error in getting marks below 20', {message: err})
    })
})

//delete student
app.post("/deletestudent/:id", (req,res)=>{
    Student.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect("/getmarks")
    })
    .catch((err)=>{
        res.json('error in deleting student', {message: err})
    })
})

// update student
app.post("/updatestudent/:id", (req,res)=>{
    const id = req.params.id;
    const {updatedcc, updateddsbda, updatedwad, updatedcns} = req.body;
    // const { updatedcc, updateddsbda, updatedwad, updatedcns } = req.body;

    Student.findByIdAndUpdate(id, {
        $set:{
            wad_marks: updatedwad,
            cc_marks: updatedcc,
            cns_marks: updatedcns,
            dsbda_marks: updateddsbda
        }
    },{new: true})
    .then(()=>{
        res.redirect("/getmarks")
    })
    .catch((err)=>{
        res.json('error in updating marks', {message: err})
    })
})