(function() {

    window.addEventListener("load", init);

    /**
     * Initializes the page, adding event listeners to the buttons.
     */
    function init() {
      let addForm = document.getElementById("make-route");
      var favBtn = document.getElementById("add-favorite");

      addForm.addEventListener("submit", async (event) => {
        window.sessionStorage.removeItem("routeID");
        let favBtn = document.getElementById("add-favorite")
        favBtn.disabled = false;
        let id = await addRoute(event);
        window.sessionStorage.setItem("routeID", id.id);
      });

      favBtn.addEventListener("click", async () => {
        let id = sessionStorage.getItem("routeID");
        let favArr = await newRouteArray(id);
        await newFavoriteRoute(favArr);
      })

      let getForm = document.getElementById("route-hover");
      getForm.addEventListener("mouseover", displayFavoriteRoutes);
    }

    /**
     * Displays the favorite routes retrieved for the user, listing them out as
     * clickable text.
     */
    async function displayFavoriteRoutes() {
      if (window.sessionStorage.getItem("username")) {
        let res = await getRoutes();
        let menu = document.getElementById('route-list');
        menu.innerHTML = "";
        res.forEach(element => {
          var container = document.createElement('div');
          var newRoute = document.createElement('a');
          newRoute.setAttribute("href", "#");
          newRoute.setAttribute("onclick", "makeFavRoute('" + element.departure + "', '" + element.arrival +"')");
          var name = document.createTextNode(element.departure + ", " + element.arrival);
          newRoute.appendChild(name);
          container.append(newRoute);
          menu.appendChild(container);
        });
      }
    }

    /**
     * Makes a post request to the bus API, adding a new route to the database.
     * @param {Event} event Form submit event, used for event.target (the form)
     * @returns {Object} response object containing current users table, only for testing purposes.
     */
    async function addRoute(event) {
      event.preventDefault();
      try {
        let form = new FormData(event.target);
        let res = await fetch("/newRoute", {
          method: "POST",
          body: form
        });
        res = await statusCheck(res);
        res = await res.json();
        return res.response;
      } catch (err) {
        return "Unsuccessful fetch request";
      }
    }

    /**
     * Gets the favorite routes for the current user.
     * @returns {Object} List of the routes in the users favorites.
     */
    async function getRoutes() {
      try {
        let username = window.sessionStorage.getItem("username");
        let res = await fetch("/favorites/full/" + username);
        res = await statusCheck(res);
        res = await res.json();
        return res.response;
      } catch (err) {
        return "Unsuccessful fetch request";
      }
    }

    /**
     * Adds a given id to the array of favorite route ids for the user.
     * @param {Number} id Id of the route to be added to the users favorites.
     * @returns {Array} Array of favorite routes.
     */
    async function newRouteArray(id) {
      try {
        let username = window.sessionStorage.getItem("username");
        let res = await fetch("/favorites/ids/" + username);
        res = await statusCheck(res);
        res = await res.json();
        await res.fav_routes.push(id);
        return res.fav_routes;
      } catch (err) {
        return [];
      }
    }

    /**
     * Adds a route to a user's favorite routes.
     * @param {Array} newArr New Array of the user's favorite route id's.
     * @returns {String} Text message if unsuccessful
     */
    async function newFavoriteRoute(newArr) {
      try {
        let data = new FormData();
        let username = window.sessionStorage.getItem("username");
        data.append("fav_routes", newArr);
        data.append("username", username);
        let res = await fetch("/updateUser", {
          method: "POST",
          body: data
        });
        res = await statusCheck(res);
      } catch (err) {
        return "Unsuccessful fetch request";
      }
    }

    /**
     * Checks that the status of the response from an API call is good.
     * @param {*} response Response from the API call.
     * @returns {Response} Response from the API call.
     */
    async function statusCheck(response) {
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response;
    }

    /**
     * Changes the password for a user.
     * @param {String} password New password for the user.
     * @returns {String} Text message if unsuccessful.
     */
    async function newPassWord(password) {
      try {
        let data = new FormData();
        let username = window.sessionStorage.getItem("username");
        data.append("password", password);
        data.append("username", username);
        await fetch("/updateUser", {
          method: "POST",
          body: data
        });
      } catch (err) {
        return "Unsuccessful fetch request";
      }
    }

})();