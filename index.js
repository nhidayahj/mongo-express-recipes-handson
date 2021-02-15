const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const mongoUrl = process.env.MONGO_URL;
const MongoUtil = require("./MongoUtil");
const ObjectId = require("mongodb").ObjectId;

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

async function main() {
  let db = await MongoUtil.connect(mongoUrl, "tgc11_recipes_handson");

  // MongoDB is connected and alive

  
  
  //create 
  app.get('/cuisines/create', (req,res) => {
      res.render('cuisines/create')
  }) 

  app.post('/cuisines/create', async (req,res)=>{
      await db.collection('cuisines').insertOne({
          'type':req.body.cuisineType
      })
      res.send("Cuisine added")
  })

  //reading
  app.get('/cuisines/all', async (req,res) => {
      let cuisines = await db
      .collection('cuisines')
      .find()
      .toArray()
      //display all cuisines
      res.render('cuisines/all', {
          'type':cuisines
      })
  })
  
  //delete 
  app.get('/cuisines/:cuisine_id/delete', async (req,res) => {
      let cuisineId = req.params.cuisine_id;
      let cuisine = await db.collection('cuisines').findOne({
          '_id':ObjectId(cuisineId)
      })
      res.render('cuisines/delete', {
        "cuisine": cuisine
      })
    //   res.send("trying to  Delete")
  })

  app.post('/cuisines/:cuisine_id/delete', (req,res) => {
      db.collection('cuisines').remove({
          '_id': ObjectId(req.params.cuisine_id)
      })
      res.redirect('/cuisines/all')
  })

  app.get('/cuisines/:cuisine_id/update', async (req,res) => {
    
    let cuisines = await db.collection('cuisines').findOne({
        '_id':ObjectId(req.params.cuisine_id)
    })
    res.render('cuisines/update', {
        cuisinesType: cuisines
    })
  })

  app.post('/cuisines/:cuisine_id/update', (req,res) => {
      db.collection('cuisines').updateOne({
          '_id':ObjectId(req.params.cuisine_id)
      }, {
          '$set': {
            'type': req.body.cuisineType
          }
          
      })
      res.redirect('/cuisines/all')
  })

}

main();

app.listen(3000, () => {
  console.log("Server has started");
});
