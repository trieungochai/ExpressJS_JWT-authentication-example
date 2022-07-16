require("dotenv").config();
const express = require("express");
const app = express();
const JWT = require("jsonwebtoken");

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

  return { refreshToken, accessToken };
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

  console.log(users);

  return res.status(200).json(tokens);
});

app.post("/token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const user = users.find((user) => user.refreshToken === refreshToken);
  if (!user) return res.sendStatus(403);

  try {
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const tokens = generateToken(user);
    updateRefreshToken(user.username, tokens.refreshToken);

    return res.status(200).json(tokens);
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
