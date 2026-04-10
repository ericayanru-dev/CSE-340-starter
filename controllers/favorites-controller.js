const favoritesModel = require("../models/favorites-model")
const utilities = require("../utilities/index")

const favCont= {}

favCont.addFavorite = async function (req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  try {
      await favoritesModel.addFavorite(account_id, inv_id)
      const exists = await favoritesModel.checkFavorite(account_id, inv_id)

        if (exists) {
        return res.redirect(`/inv/detail/${inv_id}`)
        }

    req.flash("notice", "Added to favorites")
    return res.redirect(`/inv/detail/${inv_id}`)

  } catch (error) {
    // Other errors
    req.flash("notice", "Something went wrong")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
}


favCont.removeFavorite = async function (req, res) {
  const account_id = res.locals.accountData.account_id
  const { inv_id } = req.body

  const result = await favoritesModel.removeFavorite(account_id, inv_id)


  return res.redirect(`/inv/detail/${inv_id}`)
}

/* ***************************
 *  Build inventory by favorite  view
 * ************************** */
favCont.buildFavorites = async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  const data = await favoritesModel.getFavoritesByAccount(account_id)
  console.log(data)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  console.log(className)
  res.render("./account/favorites", {
    title: "My Favorites",
    nav,
    grid,
  })
}

module.exports = favCont