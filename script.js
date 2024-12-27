

const express = require("express");
const { copyFileSync } = require("fs");
const app = express();
const port = 8080;

const path = require("path"); // for using ejs require path

const { v4: uuidv4 } = require("uuid"); // npm i uuid

const methodOvverride = require("method-override");
//
app.use(methodOvverride("_method"));

app.use(express.urlencoded({ extended: true }));// for parsing data coming from frontend or client side
app.use(express.json()); // for parsing data coming from frontend or client side

app.set("view engine", "ejs"); // ?????????
// By passing "view engine" as the key and "ejs" as the value, you configure Express to use EJS as the 
// template engine for rendering views. 
// app.set() is a method in Express used to set application-wide variables or settings that can be accessed throughout your app.
app.set("views", path.join(__dirname, "views")); // for joining view folder where our templates are located

app.use(express.static(path.join(__dirname, "public")));  // for joining public folder where css is defined


let posts= [
    {
        id: uuidv4(),
        username: "asif",
        content: "I love coding!",
    },
    {
        id: uuidv4(),
        username: "Karun",
        content: "coding is fun!",
    },
    {
        id: uuidv4(),
        username: "lakshit",
        content: "I love computers!",
    },
];



app.get("/posts", (req, res) => {  // main page
    res.render("index.ejs", {posts} ); // sending data via posts array to our main templete index.ejs
});


app.get("/posts/new", (req, res) => { // a form will appears where new post details will be submitted
    res.render("new.ejs");
});


app.post("/posts", (req, res) => { // on submition of form it which will send post request here
    // console.log(req.body); // post request contains data in the req.body

    let {username, content} = req.body;
    let id = uuidv4(); // creating new unique id's which will be provided to newly created posts on  submition form
    posts.push({id, username, content});

    res.redirect("/posts"); //(GET request) this will redirect response to /posts which is a our 1st GET request
    // redirected to main page
    // res.send("POST request working"); // after using res.redirect you can't use this again
});


app.get("/posts/:id", (req, res) => { //  showing your detailed post via id
    let { id } = req.params;
    console.log( {id} );
    let post = posts.find((p) => id === p.id);  // find function of arrays in javascript to check
//  find p (data in "posts" array), check for every individual post if p has id equal to req.params id
    console.log(post);
    res.render("show.ejs", {post}); // sending/rendering post details to show.ejs templete
    // res.send("id get request is working");
});


app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id); // find post with id so taat you could update its content
    post.content = newContent; // post content gets changed/resetted to new content
    console.log(post);
    res.redirect("/posts");
    // res.send("patch request working");
});


app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    
    let post = posts.find((p) => id === p.id); // find post with id
    // post.content = newContent; // post content gets changed/resetted to new content
    res.render("edit.ejs", { post });
});


app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id); // this function removed from the post whose id matched from the posts array
    res.redirect("/posts"); // elements whose id doesnot matches gets added to new array posts resulting in deletion of single post
    // res.send("delete success");

});


app.listen(port, () => {
    console.log(`listening to your port : ${port}`)
});




