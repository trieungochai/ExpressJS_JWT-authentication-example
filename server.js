require("dotenv").config();
const express = require("express");
const app = express();

const verifyToken = require("./middleware/auth");

const PORT = process.env.PORT || 3000;
app.use(express.json());

// database
const posts = [
  {
    userId: 1,
    post: "Kai's Post",
  },
  {
    userId: 2,
    post: "Cai's post",
  },
  {
    userId: 2,
    post: "Chi's post",
  },
];

// app
app.get("/posts", verifyToken, (req, res) => {
  return res
    .status(200)
    .json(posts.filter((post) => post.userId === req.userId));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
