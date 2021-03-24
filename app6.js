var express=require("express");
var app6=express();
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser: true, useUnifiedTopology: true});
app6.use(express.static("public"));
app6.use(bodyParser.urlencoded({extended: true}));
app6.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);

var blogSchema=new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now},
});
var blog=mongoose.model("blog", blogSchema);
//RESTful ROUTES
app6.get("/", function(req, res){
	res.redirect("/blogs");
});
//INDEX route
app6.get("/blogs", function(req, res){
	blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index.ejs", {blogs: blogs});
		}
	});
});
//NEW route
app6.get("/blogs/new", function(req, res){
	res.render("new.ejs");
});
//CREATE route
app6.post("/blogs", function(req, res){
	blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new.ejs");
		}else{
			res.redirect("/blogs");
		}
	});
});
//SHOW route
app6.get("/blogs/:id", function(req, res){
	blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.render("show.ejs", {Blog: foundBlog})
		}
	});
});
//EDIT route
app6.get("/blogs/:id/edit", function(req, res){
	blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit.ejs", {Blog: foundBlog});
		}
	});
});
//UPDATE route
app6.put("/blogs/:id", function(req, res){
	blog.findByIdAndUpdate(req.params.id, req.body.Blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});
//DELETE route
app6.delete("/blogs/:id", function(req, res){
	blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

app6.listen(3000, function(){
	console.log("RESTful blog Server started!");
});