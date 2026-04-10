// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/accountValidation')
const favCont = require("../controllers/favorites-controller")

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
router.get("/logout", utilities.handleErrors(accountController.logout))
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateView))
router.get("/favorites", utilities.checkLogin, utilities.handleErrors(favCont.buildFavorites))

// get registration details//
router.post('/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Process the login data
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)
    
// Process account info update
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

router.post("/favorite",
    utilities.checkLogin,
  utilities.handleErrors(favCont.addFavorite)
)

router.post(
  "/favorite/remove",
  utilities.checkLogin,
  utilities.handleErrors(favCont.removeFavorite)
)

module.exports = router;