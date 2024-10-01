//Javascript for the login functionality
"use strict";
let current_username;
(function() {

  window.addEventListener("load", init);

  //Adds an event listener to the add user form, pointing to the api call function.
  async function init() {
    let addForm = document.getElementById("add-form");
    addForm.addEventListener("submit", async function (event) {
      let res = await addUser(event);
      if(typeof(res) == 'string'){
        window.alert('Error');
      } else {
        window.alert('Successfully Registered');
      }
    });

    //Adds an event listener to the login form, pointing to the api call function.
    let loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async function (event) {
      let res = await login(event);
      if (typeof(res) == 'string') {
        window.alert('Incorrect Username or Password');
      } else {
        window.alert('Successfully logged in');
        document.getElementById("homeLink").click();
      }
      window.sessionStorage.setItem('username', res.username);
    });
  }

  /**
   * Makes a post request to the bus API, adding a new user from the formdata.
   * Username and password are necessary fields for the post request.
   * @param {Event} event Form submit event, used for event.target (the form)
   * @returns {String} Success message from API
   */
  async function addUser(event) {
    //Prevents the page from clearing when the form is submitted
    event.preventDefault();
    try {
      //converts the filled out form into a form data object
      let form = new FormData(event.target);
      //creates a post request to the API with the formData as the body
      let res = await fetch("/newUser", {
        method: "POST",
        body: form
      });
      //ensures the response from the API is ok, throws error if not.
      res = await statusCheck(res);
      //converts the json response to an object
      res = await res.json();
      //returns the object
      return res.response;
    } catch (err) {
      return "Unsuccessful fetch request";
    }
  }

  /**
   * Makes a post request to the bus API, logging in a user
   * Username and password are necessary fields for the post request.
   * @param {Event} event Form submit event, used for event.target (the form)
   * @returns response object containing the users info.
   */
  async function login(event) {
    //Prevents the page from clearing when the form is submitted
    event.preventDefault();
    try {
      let form = new FormData(event.target);
      let res = await fetch("/login", {
        method: "POST",
        body: form
      });
      //ensures the response from the API is ok, throws error if not.
      res = await statusCheck(res);
      //converts the json response to an object
      res = await res.json();
      //returns the object
      return res.response;
    } catch (err) {
      return "Unsuccessful fetch request";
    }
  }

  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

})();

function logOut(){
  window.sessionStorage.clear();
}