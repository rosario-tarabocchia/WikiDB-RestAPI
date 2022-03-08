const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require ("lodash");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = mongoose.Schema({
      title: String,
      content: String,
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get(function(req, res){
      Article.find({}, function(err, results){
        if (!err) {
          res.send(results);
        } else {
          res.send(err);
        }
      });
  })
  .post(function(req, res){

      const newArticle = new Article ({
          title: req.body.title,
          content: req.body.content,
      });

      newArticle.save()
      .then(function(){
          res.redirect("/articles");
      })
      .catch(function(err){
          res.send(err);

      });

  })
  .delete(function(req,res){

      Article.collection.drop().then(function(){
          res.redirect("/articles");

      });


  });


// app.get("/articles", function(req, res){
//     Article.find({}, function(err, results){
//       if (!err) {
//         res.send(results);
//       } else {
//         res.send(err);
//       }
//     });
// });
//
// app.post("/articles", function(req, res){
//
//     const newArticle = new Article ({
//         title: req.body.title,
//         content: req.body.content,
//     });
//
//     newArticle.save().then(function(){
//       res.redirect("/articles");
//
//     })
// });
//
// app.delete("/articles", function(req,res){
//
//     Article.collection.drop().then(function(){
//         res.redirect("/articles");
//
//     });
//
//
// });














app.listen(3000, function(){
    console.log("Server started on 3000;");
});
