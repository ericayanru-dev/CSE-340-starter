const utilities = require("../utilities/");
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

const account = {};

/* ****************************************
*  Deliver login view
* *************************************** */
account.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    let login = await utilities.loginPage()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}
account.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  let register = await utilities.registerPage()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
account.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    let login = await utilities.loginPage()
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      login,
      errors: null
    })
  } else {
    let register = await utilities.registerPage()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      register,
      errors:null
    })
  }
}


/* ****************************************
*  Process Login
* *************************************** */
account.loginAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const regResult = await accountModel.loginAccount(
    account_email,
    account_password
  )

  if (regResult) {
    let login = await utilities.loginPage()
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      login
    })
  } else {
    let register = await utilities.registerPage()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      register
    })
  }
}

module.exports = account