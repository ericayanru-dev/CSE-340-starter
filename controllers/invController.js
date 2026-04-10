const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const favoritesModel = require("../models/favorites-model")

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

    const account_id = res.locals.accountData?.account_id
    let isFavorite = false
    if (account_id) {
      isFavorite = await favoritesModel.checkIfFavorite(account_id, inventorty_Id)
    }
    const view = await utilities.buildItemDetailPage(data, isFavorite)
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
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/management",
    {
      title: "Managment",
      nav,
      errors: null,
      classificationList,
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
      errors: null,
      classificationList
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

//**modify inventory item */
invCont.editInformation = async function (req, res, next) {
  try {
    const inventoryId = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const itemData = await invModel.getInventoryItemByInventoryID(inventoryId)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/editInformation",
    {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
      })
  } catch (error) {
    throw error
  }
}

/* ****************************************
*  Process update Inventory item
* *************************************** */
invCont.updateInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  const { classification_id,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    // rebuild dropdown with selected value
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/editInformation", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

//**delete confirmation view */
invCont.BuildDeleteItem = async function (req, res, next) {
  try {
    const inventoryId = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const itemData = await invModel.getInventoryItemByInventoryID(inventoryId)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm",
    {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
      })
  } catch (error) {
    throw error
  }
}

/* ****************************************
*  Process delete Inventory item
* *************************************** */
invCont.removeInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  const inventoryId = parseInt(req.body.inv_id)

  const deleteResult = await invModel.removeInventory(
    inventoryId)

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

module.exports = invCont


