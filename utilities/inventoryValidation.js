const utilities = require("./index")
const inventoryModel = require("../models/inventory-model")

const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.addClassificationRules = () => {
    return [
        // valid classification is required and cannot already exist in the DB
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlphanumeric()
            .withMessage("A valid classification is required.")
            .custom(async (classification_name) => {
                const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please Put in or use different classification")
                }
            })
    ]
}
  
validate.checkAddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
   let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/addClassification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [

    // classification_id required
    body("classification_id")
      .notEmpty()
      .isInt()
      .withMessage("Please select a classification."),

    // Make
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2, max: 50 })
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Make must be 2–50 characters and contain only letters and numbers."),

    // Model
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1, max: 50 })
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Model must contain only letters and numbers."),

    // Year
    body("inv_year")
      .notEmpty()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be between 1900 and 2099."),

    // Description
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ max: 1000 })
      .withMessage("Description is required and must be less than 1000 characters."),

    // Image Path
    body("inv_image")
      .trim()
      .notEmpty()
      .matches(/^\/images\/.+\.(jpg|jpeg|png|webp)$/)
      .withMessage("Image path must be like /images/file.jpg"),

    // Thumbnail Path
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .matches(/^\/images\/.+\.(jpg|jpeg|png|webp)$/)
      .withMessage("Thumbnail path must be like /images/file.jpg"),

    // Price
    body("inv_price")
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    // Miles
    body("inv_miles")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Mileage must be a positive number."),

    // Color
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[A-Za-z]+$/)
      .withMessage("Color must contain letters only.")
    
  ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkAddInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // rebuild dropdown with selected value
    const classificationList = await utilities.buildClassificationList(classification_id)

    res.render("inventory/addInventory", {
      title: "Add New Vehicle",
      nav,
      errors,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
    return
  }

  next()
}


/* **********************************
 * Update Inventory Data Validation Rules
 * ********************************* */
validate.updateRules = () => {
  return [

    // classification_id required
    body("classification_id")
      .notEmpty()
      .isInt()
      .withMessage("Please select a classification."),

    // Make
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2, max: 50 })
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Make must be 2–50 characters and contain only letters and numbers."),

    // Model
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1, max: 50 })
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Model must contain only letters and numbers."),

    // Year
    body("inv_year")
      .notEmpty()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be between 1900 and 2099."),

    // Description
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ max: 1000 })
      .withMessage("Description is required and must be less than 1000 characters."),

    // Image Path
    body("inv_image")
      .trim()
      .notEmpty()
      .matches(/^\/images\/.+\.(jpg|jpeg|png|webp)$/)
      .withMessage("Image path must be like /images/file.jpg"),

    // Thumbnail Path
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .matches(/^\/images\/.+\.(jpg|jpeg|png|webp)$/)
      .withMessage("Thumbnail path must be like /images/file.jpg"),

    // Price
    body("inv_price")
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    // Miles
    body("inv_miles")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Mileage must be a positive number."),

    // Color
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[A-Za-z]+$/)
      .withMessage("Color must contain letters only."),
    
    // Id
    body("inv_id")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Invalid ID")
  ]
}

/* ******************************
 * Check inventory data and return edit view or continue
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  const itemName = `${inv_make} ${inv_model}`
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // rebuild dropdown with selected value
    const classificationList = await utilities.buildClassificationList(classification_id)

    res.render("inventory/editInformation", {
      title: "Edit " + itemName,
      nav,
      errors,
      classificationList,
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
    return
  }

  next()
}

module.exports = validate