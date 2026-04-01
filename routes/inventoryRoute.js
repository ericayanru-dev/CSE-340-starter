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
router.get("/", utilities.handleErrors(invController.buildManagement))
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInformation))


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

router.post("/update",
    classificationValidate.updateRules(),
    classificationValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

module.exports = router;