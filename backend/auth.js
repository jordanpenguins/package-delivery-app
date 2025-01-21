/**
 * 
 * @module auth
 * @description This module is used to check if the user is authenticated or not
 * 
 * 
 */
let isAuthenticated = false;


/**
 * This function is used to set the authenticated state of the user
 * 
 * @param {boolean} state 
 * @returns {void}
 * 
 */

function setAuthenticated(state) {
    isAuthenticated = state;
  }

/**
 * This function is used to get the authenticated state of the user
 * 
 * @returns {boolean} Returns the authenticated state of the user
 */
  
function getAuthenticated() {
    return isAuthenticated;
}


/**
 * This function is a middleware function that checks if the user is authenticated or not
 * It redirects the user to the login page if the user is not authenticated
 * otherwise it calls the next middleware function
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns {void}
 */

function isAuthenticatedMiddleware(req, res, next) {
    console.log(isAuthenticated)
    if (getAuthenticated()) {
        next();
    } else {
        res.redirect('/33787778/Jordan/login')
    }
}
  
module.exports = {
    setAuthenticated,
    getAuthenticated,
    isAuthenticatedMiddleware
};