(function () {

  'use strict';

  adjustHeight();
  window.addEventListener("resize", adjustHeight);

  function adjustHeight() {
    const mapSize = document.querySelector("#map"),
      contentSize = document.querySelector("#content"),
      removeHeight = document.querySelector("#footer").offsetHeight,
      resize = window.innerHeight - removeHeight;

    if (window.innerWidth >= 768) {
      contentSize.style.height = `${resize}px`;
      mapSize.style.height = `${resize}px`;
    } else {
      contentSize.style.height = `${resize * 0.25}px`;
      mapSize.style.height = `${resize * 0.75}px`;
    }
  }

  const button = document.querySelector("#legend button")
  button.addEventListener("click", function () {
      const legend = document.querySelector(".leaflet-legend")
      legend.classList.toggle("show-legend")
  })

  // map options
  const options = {
    scrollWheelZoom: true,
    zoomSnap: 0.1,
    dragging: true,
    zoomControl: false,
    // center: [39.6, -94.46],
    // zoom: 4,
    // Manually set zoom and center to avoid map spanning the world
    // or set bounds on a predefined extent, map.fitBounds([[40, -100], [-40, -70]])
  };

  // create the Leaflet map
  const map = L.map("map", options);

  map.fitBounds([[45, -125], [30, -65]]) // diagonal corners on the bounding rectangle

  // request tiles and add to map
  const tiles = L.tileLayer(
    "http://{s}.tile.stamen.com/toner-background/{z}/{x}/{y}.{ext}", {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: "abcd",
      ext: "png",
    }
  ).addTo(map);

  // AJAX request for GeoJSON data
  fetch("data/nation_states.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (nations) {
      console.log(nations);

        Papa.parse('data/us-owid_covid_data.csv', {
          download: true,
          header: true,
          complete: function(data) {

            // data is accessible to us here
            console.log('data: ', data);

            // note that counties is also accessible here
            console.log('nations: ', nations);

            // create function to join data and counties
                        processData(nations, data);
                      }
                    }); // end of Papa.parse()
                  })
                  .catch(function (error) {
                      console.log(`Ruh roh! An error has occurred`, error);
                  });
});
