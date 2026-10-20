const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require('./models/listing.js');
const path = require("path");
const method_override = require("method-override");
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Join the current directory name with the 'views' folder
app.set('views', path.join(__dirname, 'views'));
app.use(method_override("_method"));
app.use(express.static(path.join(__dirname, "public")));


// 3. Set the public folder path for static files (CSS, images, etc.)
// app.express.static(path.join(__dirname, 'public'));
// app.use(express.static(path.join(__dirname, 'public')));


let MONGOOSE_URL = 'mongodb://127.0.0.1:27017/wanderlust';
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGOOSE_URL);
  console.log("connect to monogo");
};

app.get("/", (req,res)=>{
    console.log("connected");
    res.send("working");
});


app.get("/listings", async(req,res)=>{
const allListing = await Listing.find({});
res.render("listings/index.ejs", {allListing} );
});



//new listing route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

//edit route
app.get("/listings/:id/edit",  async(req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});
//put or updateRequest
//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//Delete route
app.delete("/listings/:id", async(req,res)=>{
     let { id } = req.params;
     const Deletelisting = await Listing.findByIdAndDelete(id);
     console.log(Deletelisting);
     res.redirect("/listings");
});

//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

app.listen(8080 ,()=>{
    console.log("working");
});