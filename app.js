const fs = require("fs");

const express = require("express");

const app = express();

// for body-parser
app.use(express.urlencoded({ extended: true }));
// Static Middleware
// app.use(express.static(`${__dirname}/public`));
// using ejs template
app.set("view engine", "ejs");

// Reading All Posts
let posts = JSON.parse(fs.readFileSync(`${__dirname}/db/posts.json`));

// Routes
app.get("/", (req, res) => {
  const query = req.query.q;

  let allPosts = posts;

  if (query) {
    allPosts = posts.filter(
      (post) =>
        post.title.indexOf(query) > -1 || post.content.indexOf(query) > -1
    );
  }

  res.status(200).render("index", { posts: allPosts, query });
});

app.get("/posts/:id", (req, res) => {
  const selectedPost = posts.find((post) => post.id === req.params.id * 1);

  if (selectedPost) {
    res.status(200).render("post-details", { post: selectedPost });
  } else {
    res.status(404).redirect("/");
  }
});

app.get("/create-post", (req, res) => {
  res.render("create-post");
});

app.post("/posts", (req, res) => {
  const title = req.body.title.trim();
  const content = req.body.content.trim();
  const img = req.body.img;

  if (title && content) {
    const date = new Date();

    const newPost = {
      id: date.valueOf(),
      title,
      content,
      img,
      date: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    posts.push(newPost);

    fs.writeFile(`${__dirname}/db/posts.json`, JSON.stringify(posts), (err) => {
      res.status(200).redirect("/");
    });
  } else {
    res.status(400).redirect("/create-post");
  }
});

app.get("/posts/:id/edit", (req, res) => {
  const selectedPost = posts.find((post) => post.id === req.params.id * 1);

  if (selectedPost) {
    res.status(200).render("edit-post", { post: selectedPost });
  } else {
    res.status(404).redirect("/");
  }
});

app.post("/posts/:id/edit", (req, res) => {
  const id = req.params.id * 1;
  const selectedPost = posts.find((post) => post.id === id);

  const newTitle = req.body.title.trim();
  const newContent = req.body.content.trim();
  const newImg = req.body.img;

  if (selectedPost && newTitle && newContent) {
    const editedPost = {
      ...selectedPost,
      title: newTitle,
      content: newContent,
      img: newImg,
    };

    const postIndex = posts.findIndex((post) => post.id === id * 1);
    posts[postIndex] = editedPost;

    fs.writeFile(`${__dirname}/db/posts.json`, JSON.stringify(posts), (err) => {
      res.status(200).redirect("/");
    });
  } else {
    res.status(400).redirect(`/posts/:${id}/edit`, { error: true });
  }
});

app.get("/posts/:id/delete", (req, res) => {
  const selectedPost = posts.find((post) => post.id === req.params.id * 1);

  if (selectedPost) {
    posts = posts.filter((post) => post.id !== req.params.id * 1);

    fs.writeFile(`${__dirname}/db/posts.json`, JSON.stringify(posts), (err) => {
      res.status(200).redirect("/");
    });
  }
});

// Server
const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Server is up and running on port ${port}`);
});
