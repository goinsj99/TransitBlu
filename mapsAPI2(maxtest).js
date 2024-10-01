
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat:40.0068, lng:-105.2628},
    zoom: 13,
  });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          //var marker = new google.maps.Marker({position: pos,map:map});
        });
    }
}

function makeRoute(){
    let directionsRequest = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    if(document.getElementById("fromloc").value == "")
    {
      if (navigator.geolocation) 
      {
        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        function error()
        {
          console.log("did not work")
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            const request =
            {
              origin: pos,
              destination: document.getElementById("toloc").value,
              travelMode: google.maps.TravelMode.TRANSIT,
              unitSystem: google.maps.UnitSystem.IMPERIAL
            }
            directionsRequest.route(request, function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    //display route
                    directionsDisplay.setDirections(result);
                } else {
                    //delete route from map
                    directionsDisplay.setDirections({ routes: [] });}
            });
            
            //var marker = new google.maps.Marker({position: pos,map:map});
          
          },error,options);
      }
    }
    const request ={
        //origin:"1612 Garfield Ave, Louisville, CO 80027",
        //destination:"Economics Building, 261 UCB #212, Boulder, CO 80302",
        origin: document.getElementById("fromloc").value,
        destination: document.getElementById("toloc").value,
        travelMode: google.maps.TravelMode.TRANSIT,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }
    directionsRequest.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });}
    });
}
