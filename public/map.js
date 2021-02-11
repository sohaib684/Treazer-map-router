var greenIcon = L.icon({
    iconUrl: "leaf-red.png",
    shadowUrl: "leaf-shadow.png",

    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  let map = L.map("map").setView([0, 0], 1);

  const latitude = document.querySelector(".lat");
  const longitude = document.querySelector(".long");

  let route = "";
  let closest_shop = "";

  latitude.value = 57.6792;
  longitude.value = 11.949;

  let shops_loc = [
    L.latLng(57.74, 11.94),
    L.latLng(57.64, 12.05),
    L.latLng(57.75, 11.85),
    L.latLng(57.85, 12.04),
  ];

  let shop_distance = [];

  function render() {

    let current_loc = L.latLng(latitude.value, longitude.value);

    map.eachLayer((layer) => {
      map.removeLayer(layer);
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(map);

    let current_loc_marker = L.marker([latitude.value, longitude.value], {
      draggable: "true",
    }).addTo(map);

    current_loc_marker.on("dragend", (e) => {
      let position = current_loc_marker.getLatLng();

      latitude.value = position.lat;
      longitude.value = position.lng;

      current_loc = L.latLng(latitude.value, longitude.value);
      
      map.removeControl(route);

      shop_distance = [];

      shops_loc.forEach((shop) => {
        let distance =
          Math.pow(shop.lat - current_loc.lat, 2) +
          Math.pow(shop.lng - current_loc.lng, 2);

        shop_distance.push(distance);
      });


      closest_shop =
        shops_loc[shop_distance.indexOf(Math.min(...shop_distance))];

      route = L.Routing.control({
        waypoints: [current_loc, closest_shop],
        createMarker: function () {
          return null;
        },
        routeWhileDragging: true,
      }).addTo(map);
    });

    shops_loc.forEach((shop) => {
      L.marker([shop.lat, shop.lng], { icon: greenIcon }).addTo(map);

      let distance =
        Math.pow(shop.lat - current_loc.lat, 2) +
        Math.pow(shop.lng - current_loc.lng, 2);

      shop_distance.push(distance);
    });

    closest_shop =
      shops_loc[shop_distance.indexOf(Math.min(...shop_distance))];

    route = L.Routing.control({
      waypoints: [current_loc, closest_shop],
      createMarker: function () {
        return null;
      },
      routeWhileDragging: true,
    }).addTo(map);

    route.on("routeselected", function (e) {
      var route = e.route;
      latitude.value = route.inputWaypoints[0].latLng.lat;
      longitude.value = route.inputWaypoints[0].latLng.lng;
    });
  }

  render();

  longitude.addEventListener("change", (e) => {
    render();
  });

  latitude.addEventListener("change", (e) => {
    render();
  });