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
router.get("/", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildManagement))
router.get("/addClassification", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddClassification))
router.get("/addInventory", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.editInformation))
router.get("/delete/:inv_id", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.BuildDeleteItem))


// Process the add Classification data
router.post(
    "/addClassification",
    utilities.checkEmployeeOrAdmin,
    classificationValidate.addClassificationRules(),
    classificationValidate.checkAddClassificationData,
    utilities.handleErrors(invController.AddClassification)
)

// Process the add inventory data
router.post(
    "/addInventory",
    utilities.checkEmployeeOrAdmin,
    classificationValidate.addInventoryRules(),
    classificationValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
)

router.post("/update",
    utilities.checkEmployeeOrAdmin,
    classificationValidate.updateRules(),
    classificationValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

router.post("/remove",
    utilities.checkEmployeeOrAdmin,
    utilities.handleErrors(invController.removeInventory)
)

module.exports = router;