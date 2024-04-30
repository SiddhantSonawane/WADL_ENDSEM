const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const Song = require('./models')
const mongoose = require('mongoose')

const app = express();

app.set("view engine", "ejs")

app.use(bodyparser.urlencoded({extended: true}))

app.use(bodyparser.json())


mongoose
    .connect("mongodb://localhost:27017/music")
    .then(() => {
        console.log('DB connected')
    })
    .catch((err) => {
        console.log('error in connection ', err)
        process.exit();
    })


app.use("/css", express.static(path.resolve(__dirname, "static/css")))

app.get("/", (req,res) => {
    res.render("index", {music: null})
})

app.listen(3000, ()=>{
    console.log('Server listening on PORT 3000')
})


// insert song
app.post("/addsong", async (req,res) => {
    const song = new Song(req.body);
    await song
    .save()
    .then(()=>{
        res.redirect("/listsongs")
    })
    .catch((err)=>{
        res.json({message: "error in inserting song ", err})
    })
})

//get all songs
app.get("/listsongs", async(req,res) => {
    Song.find(req.query)
    .then((music) => {
        res.render("index", {music: music})
    })
    .catch((err)=>{
        res.json({message: "error in fetching all songs ", err})
    })
})

// list songs by music director
app.get("/songsByDirector/:director", async(req,res)=>{
    Song.find({Music_director: req.params.director})
    .then((music) => {
        res.render("index", {music: music})
    })
    .catch((err)=>{
        res.json({message: "error in fetching songs by director ", err})
    })
})

// list songs by director and singer
app.get("/songsByDirectorAndSinger/:director/:singer", async(req,res) => {
    Song.find({
        Music_director: req.params.director,
        singer: req.params.singer
    })
    .then((music) => {
        res.render("index", {music: music})
    })
    .catch((err)=>{
        res.json({message: "error in fetching songs by director and singer ", err})
    })
})

// delete song by id
app.post("/deletesong/:id", async(req,res) => {
    Song.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect("/listsongs")
    })
    .catch((err)=>{
        res.json({message: "error in deleting song", err})
    })
})

// add to favouriteSongs
app.post("/addtofav/:id", async (req,res)=> {
    const song = await Song.findById(req.params.id)
    if(!song)
    {
        return res.status(404).send("Song not found")
    }

    song.favorite = true
    await song.save()
    .then(()=>{
        res.redirect("/listFavoriteSongs")
    })
    .catch((err)=>{
        res.json({message: "error in marking song favourite", err})
    })
})

// get favourite songs
app.get("/listFavoriteSongs", async (req,res) => {
    Song.find({favorite: true})
    .then((favouriteSongs) => {
        res.render("favouriteSongs", {favouriteSongs: favouriteSongs})
    })
    .catch((err)=>{
        res.json({message: "error in fetching favourite songs", err})
    })
})

// list song by singer and film
app.get("/songsBySingerAndFilm/:singer/:film", async(req,res) => {
    Song.find({
        singer: req.params.singer,
        Film : req.params.film
    })
    .then((music)=>{
        res.render("index", {music: music})
    })
    .catch((err)=>{
        res.json({message: "error in fetching songs by singer and film", err})
    })
})

// update song by actor n actress

app.post("/updatesong/:id", async(req,res)=>{
    const song = await Song.findById(req.params.id)
    if(!song)   
    {
        return res.status(404).send("Song not found")
    }

    song.actor = req.body.actor
    song.actress = req.body.actress

    await song.save()
    .then(()=>{
        res.redirect("/listsongs")
    })
    .catch((err)=>{
        res.json({message: "error in updating song", err})
    })
})