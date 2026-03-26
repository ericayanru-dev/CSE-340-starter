const utilities = require("../utilities/");
const registerModels = require("../models/account-model")

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
    login
  })
}
account.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  let register = await utilities.registerPage()
  let error = await utilities.buildErrorList()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    error,
    register
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
account.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await registerModels.registerAccount(
    account_firstname,
    account_lastname,
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