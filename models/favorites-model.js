const pool = require("../database/")

async function addFavorite(account_id, inv_id) {
    try {
        const sql = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    RETURNING *
  `
        return await pool.query(sql, [account_id, inv_id])
    } catch (error) {
        throw error
    }
}

async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT i.* FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
  `
  return (await pool.query(sql, [account_id])).rows
}

async function checkFavorite(account_id, inv_id) {
  const sql = `
    SELECT * FROM favorites
    WHERE account_id = $1 AND inv_id = $2
  `
  const result = await pool.query(sql, [account_id, inv_id])
  return result.rowCount
}

async function removeFavorite(account_id, inv_id) {
  const sql = `
    DELETE FROM favorites
    WHERE account_id = $1 AND inv_id = $2
    RETURNING *
  `
  const result = await pool.query(sql, [account_id, inv_id])
  return result.rowCount
}
async function checkIfFavorite(account_id, inv_id) {
  const sql = `
    SELECT * FROM favorites
    WHERE account_id = $1 AND inv_id = $2
  `
  const result = await pool.query(sql, [account_id, inv_id])
  return result.rowCount > 0
}

module.exports = {
  addFavorite,
  getFavoritesByAccount,
    removeFavorite,
  checkFavorite,
  checkIfFavorite
}