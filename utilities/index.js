const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display" class="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildItemDetailPage = async function (data) {
  if (data) {
    return`
    <div class= vehicle-detail>
    <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
    
    <article class="vehicle-info">
    <h2>${data.inv_make} ${data.inv_model} Detail</h2>
    <span class="detail-style"><strong>Price:</strong> $${Number(data.inv_price).toLocaleString()}</span>
    <p><strong>Description:</strong> ${data.inv_description}</p>
    <span class="detail-style"><strong>color:</strong> ${data.inv_color}</span>
    <p><strong>Mileage:</strong> ${Number(data.inv_miles).toLocaleString()} miles</p>
    </article>
    </div>`
  }
  else { 
    return'<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }  
}

Util.loginPage = async function () {
 return `<div class="login"<form id="loginForm" class="loginForm">
        <input name="account_email" type="email" id="email" placeholder="Enter your email" required>
        <input name="account_password" type="password" id="password" placeholder="Enter your password" required>

        <button type="submit">Login</button>
        </form>
        <p>No account? <a href="/account/register/" title="sign up">Sign up</a> </p>
        </div>`
}

Util.buildErrorList = async function (errors) {
  if (errors) {

    let html = '<ul class="notice">'

    errors.array().forEach(error => {
      html += `<li>${error.msg}</li>`
    })

    html += "</ul>"

    return html
  }
}

Util.registerPage = async function () {
  return `
  <form id="registerForm" class="registerForm" action="/account/register" method="post">

  <label for="firstname">First Name</label>
  <input type="text" id="firstname" name="account_firstname" required>

  <label for="lastname">Last Name</label>
  <input type="text" id="lastname" name="account_lastname" required>

  <label for="email">Email Address</label>
  <input type="email" id="email" name="account_email" required>

  <label for="password">Password</label>
  <input type="password" id="password" name="account_password" required
  pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$">

  <button type="submit">Register</button>

  </form>
  <div class="registration-criterials">
  <p>all the inputs are required and that the password must be:</p>
    <ul>
    <li>12 characters in length, minimum</li>
    <li>contain at least 1 capital letter</li>
    <li>contain at least 1 number</li>
    <li>contain at least 1 special character</li>
    </ul>
  </div>
  `
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util