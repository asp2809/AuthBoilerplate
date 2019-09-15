const expressJWT = require("express-jwt");

const jwt = () => {
  return expressJWT({ secret: process.env.SECRETORKEY }).unless({
    path: ["/api/users/login", "/api/users/register"]
  });
};

module.exports = jwt;
