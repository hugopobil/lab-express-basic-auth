const router = require("express").Router();
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/register", (req, res, next) => {
  console.log(req.body);

  User.create(req.body)
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;

  const renderWithErrors = () => {
    res.render("login.hbs", {
      username,
      errors: true,
    });
  };

  User.findOne({ username })
    .then((user) => {
      if (user) {
        return user.checkPassword(password).then((match) => {
          if (match) {
            console.log("Te has logueado bien!!");
            res.redirect(`/profile/${user._id}`);
          } else {
            console.log("Email o contraseña incorrectos"); // contraseña incorrecta
            renderWithErrors();
          }
        });
      } else {
        console.log("Email o contraseña incorrectos"); // no existe usuario con ese email
        renderWithErrors();
      }
    })
    .catch((err) => next(err));
  });

router.get("/profile/:id", (req, res, next) => {
  const id = req.params.id;

  User.findById(id)
    .then((user) => {
      res.render("profile", { user });
    })
    .catch((err) => next(err));
});

module.exports = router;
