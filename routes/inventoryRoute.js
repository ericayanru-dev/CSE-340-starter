// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const classificationValidate = require('../utilities/inventoryValidation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventortyId", utilities.handleErrors(invController.buildByInventoryId))
router.get("/error", utilities.handleErrors(invController.triggerError))
router.get("/management", utilities.handleErrors(invController.buildManagement))
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))

// Process the add Classification data
router.post(
    "/addClassification",
    classificationValidate.addClassificationRules(),
    classificationValidate.checkAddClassificationData,
    utilities.handleErrors(invController.AddClassification)
)

// Process the add inventory data
router.post(
    "/addInventory",
    classificationValidate.addInventoryRules(),
    classificationValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
)
    
module.exports = router;