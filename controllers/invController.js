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

invCont.triggerError = async function (req, res) {
  throw new Error("Intentional Server Error")
}

module.exports = invCont


