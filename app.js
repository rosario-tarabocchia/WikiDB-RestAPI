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

      Article.collection.drop()
      .then(function(){
          res.redirect("/articles");

      })
      .catch(function(err){
        res.send(err);
      });
  });

  app.route("/articles/:articleID")
  .get(function(req, res){
      Article.findOne({title: req.params.articleID}, function (err, result){
        if (result) {
            res.send(result)
        } else {
            res.send("No articles found with that title.")
        };
    });
  })
  .put(function(req, res){
      Article.replaceOne(
        {title: req.params.articleID},
        {title: req.body.title, content: req.body.content},
        function(err){
          if(!err){
              res.send("Update Complete");
          } else {
              res.send(err);
          }
        }
      );
  })
  .patch(function(req,res){
      Article.updateOne(
        {title: req.params.articleID},
        {$set: req.body},
        function(err){
          if(!err){
          res.send("Update successful");
          } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function(req,res){
      Article.deleteOne(
        {title: req.params.articleID},
        function(err){
          if(!err){
          res.send("Delete successful");
          } else {
          res.send(err);

        }
      }
    );
  });

app.listen(3000, function(){
    console.log("Server started on 3000;");
});
