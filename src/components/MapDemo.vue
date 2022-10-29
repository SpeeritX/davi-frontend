<template>
  <div id="map"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MapDemo",
  async mounted() {
    // Fix icons path (leaflet doesn't support webpack by deafult)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    var map = L.map("map").setView([51.505, -0.09], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    L.marker([51.5, -0.09])
      .addTo(map)
      .bindPopup("<b>Hello world!</b><br />I am a popup.")
      .openPopup();

    L.circle([51.508, -0.11], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 500,
    })
      .addTo(map)
      .bindPopup("I am a circle.");

    L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047],
    ])
      .addTo(map)
      .bindPopup("I am a polygon.");

    var popup = L.popup()
      .setLatLng([51.513, -0.09])
      .setContent("I am a standalone popup.")
      .openOn(map);

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    }

    map.on("click", onMapClick);
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
