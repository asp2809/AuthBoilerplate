const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

/**
 * @route - POST /api/users/test
 * @desc - route for testing
 * @access - private
 */
router.get("/test", (req, res) => {
  return res.json({ success: true, doc: "EH!!!!!" });
});

/**
 * @route - POST /api/users/register
 * @desc - route for registering a user
 * @access - public
 */
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (user) {
      res
        .status(400)
        .json({ success: false, errors: { email: "Email already exists!" } });
    } else {
      const newUser = new User({
        name,
        email,
        password
      });
      bcrypt.genSalt(10, (_err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(usr => res.json(usr))
            .catch(e => console.log(e));
        });
      });
    }
  });
});

/**
 * @route - POST /api/users/login
 * @desc - route for login
 * @access - public
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res
        .status(404)
        .json({ success: false, errors: { email: "User does not exist" } });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const tempUser = {
          id: user.id,
          name: user.name,
          email: user.email
        };

        jwt.sign(
          tempUser,
          process.env.SECRETORKEY,
          { expiresIn: 36000 },
          (err, token) => {
            if (err) {
              res.status(400).json({ success: false, errors: err });
            } else {
              const genToken = `Bearer ${token}`;
              res.json({ success: true, token: genToken });
            }
          }
        );
      } else {
        return res
          .status(400)
          .json({ success: false, errors: { password: "Wrong Password" } });
      }
    });
  });
});

module.exports = router;
