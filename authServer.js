require("dotenv").config();
const express = require("express");
const app = express();
const JWT = require("jsonwebtoken");
const verifyToken = require("./middleware/auth");

const PORT = process.env.PORT || 5000;
app.use(express.json());

// database
let users = [
  {
    id: 1,
    username: "Kai",
    refreshToken: null,
  },
  {
    id: 2,
    username: "Cai",
    refreshToken: null,
  },
];

// app
const generateToken = (payload) => {
  const { id, username } = payload;
  // Create JWT
  const accessToken = JWT.sign(
    { id, username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15s",
    }
  );
  const refreshToken = JWT.sign(
    { id, username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return { accessToken, refreshToken };
};

const updateRefreshToken = (username, refreshToken) => {
  users = users.map((user) => {
    if (user.username === username)
      return {
        ...user,
        refreshToken,
      };

    return user;
  });
};

app.post("/login", (req, res) => {
  const { username } = req.body;

  const user = users.find((user) => user.username === username);
  if (!user) return res.sendStatus(401);

  const tokens = generateToken(user);
  updateRefreshToken(username, tokens.refreshToken);

  // console.log("users:", users);
  // console.log("tokens:", tokens);

  return res.status(200).json(tokens);
});

app.post("/token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const user = users.find((user) => user.refreshToken === refreshToken);
  if (!user) return res.sendStatus(403);

  try {
    const decoded = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("decoded", decoded);
    const tokens = generateToken(user);
    updateRefreshToken(user.username, tokens.refreshToken);

    return res.status(200).json(tokens);
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
});

app.delete("/logout", verifyToken, (req, res) => {
  const user = users.find((user) => user.id === req.userId);
  updateRefreshToken(user.username, null);

  return res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
