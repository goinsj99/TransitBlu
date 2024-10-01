


function addRoute()
{
  document.getElementById("fromloc").value;
  document.getElementById("fromloc").value;
  document.getElementById("TotalTime").innerHTML;
  document.getElementById("TotalDistance").innerHTML;
//write to data base here dont Know if it really makes sense to store more 
//than the locations becouse we will have to find the time again and to have
//the on time boolean we woul dhave to change the way the whole the database works

}
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
                    var bus_info = [0,0];
                    //time folowed by distance
                    var walk_info = [0,0,5];
                    //time,distance,speed
                    if(document.getElementById("walkingSpeed").value.length > 0)
                    {
                      walk_info[2] = document.getElementById("walkingSpeed").value;
                    }
                    
                    for(var i=0; i < result.routes[0].legs[0].steps.length;i++)
                    {
                      if(result.routes[0].legs[0].steps[i].travel_mode == google.maps.TravelMode.WALKING)
                      {

                         walk_info[0] += (result.routes[0].legs[0].steps[i].duration.value)*(5/(walk_info[2]));
                         walk_info[1] += result.routes[0].legs[0].steps[i].distance.value;
                      }
                      else
                      {
                        
                        bus_info[0] += result.routes[0].legs[0].steps[i].duration.value;
                        bus_info[1] += result.routes[0].legs[0].steps[i].distance.value;
                      }

                      var time = bus_info[0] + walk_info[0];
                      var distance = (bus_info[1] + walk_info[1])/1609;
                    }
                    document.getElementById("TotalTime").innerHTML = time + " seconds";
                    document.getElementById("BusTime").innerHTML = bus_info[0] + " seconds";
                    document.getElementById("WalkingTime").innerHTML= walk_info[0] + " seconds";
                    document.getElementById("TotalDistance").innerHTML = distance + " miles";
                    document.getElementById("BusDistance").innerHTML = bus_info[1] + " meters";
                    document.getElementById("WalkingDistance").innerHTML = walk_info[1] + " meters";
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
        //origin:"600 30th St, Boulder, CO 80303",
        //destination:"Economics Building, 261 UCB #212, Boulder, CO 80302",
        origin: document.getElementById("fromloc").value,
        destination: document.getElementById("toloc").value,
        travelMode: google.maps.TravelMode.TRANSIT,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }
    directionsRequest.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          var bus_info = [0,0];
          //time folowed by distance
          var walk_info = [0,0,5];
          //time,distance,speed
          if(document.getElementById("walkingSpeed").value.length > 0)
          {
            walk_info[2] = document.getElementById("walkingSpeed").value;
          }
          
          for(var i=0; i < result.routes[0].legs[0].steps.length;i++)
          {
            if(result.routes[0].legs[0].steps[i].travel_mode == google.maps.TravelMode.WALKING)
            {

                walk_info[0] += (result.routes[0].legs[0].steps[i].duration.value)*(5/(walk_info[2]));
                walk_info[1] += result.routes[0].legs[0].steps[i].distance.value;
            }
            else
            {
              
              bus_info[0] += result.routes[0].legs[0].steps[i].duration.value;
              bus_info[1] += result.routes[0].legs[0].steps[i].distance.value;
            }

            var time = bus_info[0] + walk_info[0];
            var distance = (bus_info[1] + walk_info[1])/1609;
          }
          document.getElementById("TotalTime").innerHTML = time + " seconds";
          document.getElementById("BusTime").innerHTML = bus_info[0] + " seconds";
          document.getElementById("WalkingTime").innerHTML= walk_info[0] + " seconds";
          document.getElementById("TotalDistance").innerHTML = distance + " miles";
          document.getElementById("BusDistance").innerHTML = bus_info[1] + " miles";
          document.getElementById("WalkingDistance").innerHTML = walk_info[1] + " miles";
          //display route
          directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });}
    }); 
}

function makeFavRoute(){
  let directionsRequest = new google.maps.DirectionsService();
  let directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  const request ={
    //Pull from data base here 










      origin:"600 30th St, Boulder, CO 80303",
      destination:"Economics Building, 261 UCB #212, Boulder, CO 80302",
      travelMode: google.maps.TravelMode.TRANSIT,
      unitSystem: google.maps.UnitSystem.IMPERIAL
  }
  directionsRequest.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        var bus_info = [0,0];
        //time folowed by distance
        var walk_info = [0,0,5];
        //time,distance,speed
        if(document.getElementById("walkingSpeed").value.length > 0)
        {
          walk_info[2] = document.getElementById("walkingSpeed").value;
        }
        
        for(var i=0; i < result.routes[0].legs[0].steps.length;i++)
        {
          if(result.routes[0].legs[0].steps[i].travel_mode == google.maps.TravelMode.WALKING)
          {

              walk_info[0] += (result.routes[0].legs[0].steps[i].duration.value)*(5/(walk_info[2]));
              walk_info[1] += result.routes[0].legs[0].steps[i].distance.value;
          }
          else
          {
            
            bus_info[0] += result.routes[0].legs[0].steps[i].duration.value;
            bus_info[1] += result.routes[0].legs[0].steps[i].distance.value;
          }

          var time = bus_info[0] + walk_info[0];
          var distance = (bus_info[1] + walk_info[1])/1609;
          
        }
        document.getElementById("TotalTime").innerHTML = secondsToDhms(time);
        document.getElementById("BusTime").innerHTML = secondsToDhms(bus_info[0]);
        document.getElementById("WalkingTime").innerHTML=secondsToDhms(walk_info[0]);
        document.getElementById("TotalDistance").innerHTML = distance + " meters";
        document.getElementById("BusDistance").innerHTML = bus_info[1] + " meters";
        document.getElementById("WalkingDistance").innerHTML = walk_info[1] + " meters";
        //display route
        directionsDisplay.setDirections(result);
      } else {
          //delete route from map
          directionsDisplay.setDirections({ routes: [] });}
  });
}

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600*24));
  var h = Math.floor(seconds % (3600*24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
  }