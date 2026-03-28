const pool = require("../database/index.js")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryItemByInventoryID(inventory_id) {
  try {
    const data = await pool.query(`
    SELECT * FROM public.inventory
    WHERE inv_id = $1`,
      [inventory_id])
    return data.rows[0];
  }
  catch (error) {
    console.error("getInventoryItemByInventoryId error " + error)
    throw error
  }
}

/* *****************************
*   Add classification
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    throw error
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const email = await pool.query(sql, [classification_name])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add to Inventory
* *************************** */
async function addInventory(
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
) {
  try {
    const sql = `
      INSERT INTO inventory (
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `

    return await pool.query(sql, [
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
    ])
  } catch (error) {
    throw error
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryItemByInventoryID, checkExistingClassification, addClassification, addInventory}