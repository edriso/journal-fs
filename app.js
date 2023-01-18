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
const postsData = fs.readFileSync(`${__dirname}/db/posts.json`, "utf-8");
const posts = JSON.parse(postsData);

const updatePosts = (allPosts) => {
  fs.writeFileSync(
    `${__dirname}/db/posts.json`,
    JSON.stringify(allPosts),
    "utf-8"
  );
};

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

app.post("/create-post", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
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

    updatePosts(posts);

    res.status(200).redirect("/");
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

  const newTitle = req.body.title;
  const newContent = req.body.content;
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

    updatePosts(posts);

    res.status(200).redirect("/");
  } else {
    res.status(400).redirect(`/posts/:${id}/edit`, { error: true });
  }
});

app.get("/posts/:id/delete", (req, res) => {
  const selectedPost = posts.find((post) => post.id === req.params.id * 1);

  if (selectedPost) {
    const newPosts = posts.filter((post) => post.id !== req.params.id * 1);

    updatePosts(newPosts);
  }

  setTimeout(() => {
    res.status(200).redirect("/");
  }, 200);
});

// Server
const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Server is up and running on port ${port}`);
});
