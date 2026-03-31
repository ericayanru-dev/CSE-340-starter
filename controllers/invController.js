const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  console.log(className)
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inventorty_Id = req.params.inventortyId
    const data = await invModel.getInventoryItemByInventoryID(inventorty_Id)
    console.log(data)
    const nav = await utilities.getNav()
    const view = await utilities.buildItemDetailPage(data)
    res.render("inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      view
    })
  } catch (error) {
    throw error
  }
}

invCont.buildManagement = async function(req, res,next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management",
    {
      title: "Managment",
      nav,
      errors: null,
      classificationSelect,
      })
  } catch (error) {
    throw error
  }
}

invCont.buildAddClassification = async function(req, res,next) {
  try {
    const nav = await utilities.getNav()
    res.render("./inventory/addClassification",
    {
      title: "Add Classification",
      nav,
      errors: null,
      })
  } catch (error) {
    throw error
  }
}

/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.AddClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classificationResult = await invModel.addClassification(
    classification_name
  )

  if (classificationResult) {
    req.flash(
      "notice",
      `Congratulations, New classification added ${classification_name}.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, Process failed.")
    res.status(501).render("inventory/addClassification", {
      title: "Add Classification",
      nav,
      errors:null
    })
  }
}

invCont.buildAddInventory = async function(req, res,next) {
  try {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/addInventory",
    {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      })
  } catch (error) {
    throw error
  }
}

/* ****************************************
*  Process Add Inventory
* *************************************** */
invCont.addInventory = async function(req, res) {
  let nav = await utilities.getNav()
  // rebuild dropdown with selected value
  const classificationList = await utilities.buildClassificationList()
  const { classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color } = req.body

  const inventoryResult = await invModel.addInventory(
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
  )

  if (inventoryResult) {
    req.flash(
      "notice",
      `Congratulations, New ${inv_make} ${inv_model} added successful.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, Process failed.")
    res.status(501).render("inventory/addInventory", {
      title: "Add Classification",
      nav,
      classificationList,
      errors:null
    })
  }
}

invCont.triggerError = async function (req, res) {
  throw new Error("Intentional Server Error")
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont


