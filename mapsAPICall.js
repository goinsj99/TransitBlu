//File for interacting with google maps API and displaying map in page.
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
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,}
      const autocompleteFrom = new google.maps.places.Autocomplete(document.getElementById("fromloc"), options);
      const autocompleteTo = new google.maps.places.Autocomplete(document.getElementById("toloc"), options);
}

function makeRoute(){
    let directionsRequest = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();
    initMap();
    directionsDisplay.setMap(map);
    if(document.getElementById("mapPanel").innerHTML!=""){
      document.getElementById("mapPanel").innerHTML="";
    }
    document.getElementById("mapPanel").style.display = 'none';
    document.getElementById("showPanel").style.display = 'block';
    directionsDisplay.setPanel(document.getElementById("mapPanel"));
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
                      var distance = (bus_info[1] + walk_info[1])/1000;
                    }
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
          //display route
          directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });}
    });
}

function makeFavRoute(origin, destination){
  console.log('making route');
  document.getElementById("fromloc").value = origin;
  document.getElementById("toloc").value = destination;
  initMap();
  let directionsRequest = new google.maps.DirectionsService();
  let directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  if(document.getElementById("mapPanel").innerHTML!=""){
    document.getElementById("mapPanel").innerHTML="";
  }
  document.getElementById("mapPanel").style.display = 'none';
  document.getElementById("showPanel").style.display = 'block';
  directionsDisplay.setPanel(document.getElementById("mapPanel"));
  if(origin == "")
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
            destination: destination,
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
                var distance = (bus_info[1] + walk_info[1]);
              }
              //display route
              directionsDisplay.setDirections(result);
            } else {
                //delete route from map
                directionsDisplay.setDirections({ routes: [] });}
              });
            },error,options);
        }
      }
    else
  {
  const request ={
    //Pull from data base here
      origin: origin,
      destination: destination,
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
          var distance = (bus_info[1] + walk_info[1]);
        }
        //display route
        directionsDisplay.setDirections(result);
      } else {
          //delete route from map
          directionsDisplay.setDirections({ routes: [] });}
      });
    }
  }
function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600*24));
  var h = Math.floor(seconds % (3600*24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  function getTime(time){
    let matches = time.match(/\d+/g);
    let day = time.match("day" || "days");
    let number = 0;
    if(matches.length==1){
      number = parseInt(matches[0]);
    }
    console.log("days: ", day);
    if(matches.length==2){
      if(!day){
      number = (parseInt(matches[0])*60)+parseInt(matches[1]);
      }
      else{
        number = (parseInt(matches[0])*1440)+parseInt(matches[1]*60);
      }
    }
    return number*60;
  }

function showDirections(){
  let jst = document.querySelectorAll('[jstcache="82"]');
  let modifier = 1.0;
  let timeRemoved = 0;
  let timeMod = 0;
  let time = 0;
  if(document.getElementById("walkingSpeed").value>0){
    modifier = (3/document.getElementById("walkingSpeed").value);
  }
  for(let i = 1;i<jst.length;i++){
    time=getTime(jst[i].innerHTML);
    timeMod=Math.ceil(time*modifier);
    jst[i].innerHTML=secondsToDhms(timeMod);
    timeRemoved+=time-timeMod;
  }
  jst[0].innerHTML=secondsToDhms(getTime(jst[0].innerHTML)-timeRemoved);
  document.getElementById("mapPanel").style.display = 'block';
  document.getElementById("showPanel").style.display = 'none';
  }
