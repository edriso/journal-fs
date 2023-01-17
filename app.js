const fs = require("fs");

const express = require("express");

const app = express();

// for body-parser
app.use(express.urlencoded({ extended: true }));
// Static Middleware
app.use(express.static("public"));
// using ejs template
app.set("view engine", "ejs");

// Reading All Posts
const postsData = fs.readFileSync(`${__dirname}/db/posts.json`, "utf-8");
const posts = JSON.parse(postsData);

// Routes
app.get("/", (req, res) => {
  res.status(200).render("index", { posts });
});

// Writing post
// fs.writeFileSync(`${__dirname}/db/posts.json`, posts, "utf-8");
// fs.writeFile(`${__dirname}/db/posts.json`, posts, "utf-8", (err) => {
//   if (err) console.log(err);
// });

// Server
const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Server is up and running on port ${port}`);
});
