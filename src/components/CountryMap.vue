<template>
  <div id="map"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import countryData from "../assets/countries.json";

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

    var map = L.map("map", {
      zoomControl: false,
      maxZoom: 5,
      minZoom: 2,
      maxBounds: [
        [-50, -180],
        [75, 180],
      ],
      maxBoundsViscosity: 1
    }).setView([50.45, 30.52], 3);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 5,
      minZoom: 2,
      noWrap: true,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    function style() {
      return {
        fillColor: "#BD0026",
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
      });
      layer.bringToFront();
    }

    function resetHighlight(e) {
      geojson.resetStyle(e.target);
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
      });
    }

    var geojson;
    geojson = L.geoJson(countryData, {
      style: style,
      onEachFeature: onEachFeature,
    }).addTo(map);
  },
};
</script>

<style scoped>
#map {
  height: 500px;
  width: 600px;
  max-width: 100%;
  max-height: 100%;
}
</style>
