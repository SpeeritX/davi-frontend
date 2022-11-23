<template>
  <div>
    <div id="flight-map"></div>
  </div>
</template>

<script>
import mapService from "../services/mapService";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import stateData from "../assets/states.json";
import grayscale from "../tools/TileLayer.Grayscale";

export default {
  name: "FlightsMap",
  props: ["flights"],
  data() {
    return {
      map: null,
      layers: null,
    };
  },
  async mounted() {
    // Fix icons path (leaflet doesn't support webpack by deafult)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    // Prepare map
    this.map = L.map("flight-map", {
      zoomControl: false,
      maxZoom: 11,
      minZoom: 6,
      maxBounds: [
        [54, 40],
        [41, 20],
      ],
      maxBoundsViscosity: 1,
    }).setView([50.45, 30.52], 6.3);
    this.layers = L.layerGroup();
    const response = await mapService.getFlightPerRegion({
      date_1: "2022-02-22",
      date_2: "2022-06-22",
    });
    const matrixData = response.data;
    grayscale(L);
    L.tileLayer
      .grayscale("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        noWrap: true,
        maxBounds: [
          [54, 40],
          [41, 20],
        ],
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(this.map);
    this.layers = L.layerGroup();
    function getColor(d) {
      return d > 1000
        ? "#800026"
        : d > 500
        ? "#BD0026"
        : d > 200
        ? "#E31A1C"
        : d > 100
        ? "#FC4E2A"
        : d > 50
        ? "#FD8D3C"
        : d > 20
        ? "#FEB24C"
        : d > 10
        ? "#FED976"
        : d > 0
        ? "#FFEDA0"
        : "#FFFFFF";
    }
    function style(feature) {
      return {
        fillColor: getColor(matrixData[feature.properties.name]),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    }

    function highlightFeature(e) {
      const layer = e.target;

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

    let geojson;
    geojson = L.geoJson(stateData, {
      style: style,
      onEachFeature: onEachFeature,
    }).addTo(this.map);
  },
  async updated() {
    this.layers.removeFrom(this.map);
    this.layers.clearLayers();

    // -- Flights --
    const splitFlightLine = (path) => {
      // Splits flight paths if the distance between two points is too long
      const distance = (point1, point2) => {
        const distanceX = point1[0] - point2[0];
        const distanceY = point1[1] - point2[1];
        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      };
      const splittedPaths = [];
      let start = 0;
      for (let i = 1; i < path.length; ++i) {
        if (distance(path[i], path[i - 1]) > 2) {
          splittedPaths.push(path.slice(start, i));
          start = i;
        }
      }
      splittedPaths.push(path.slice(start, path.length));
      return splittedPaths;
    };

    // const sliceWithStep = (data, step) => {
    //   // Decreases points density to increase performance
    //   let i = 0;
    //   const processedData = [];
    //   while (i < data.length) {
    //     processedData.push(data[i]);
    //     i += step;
    //   }
    //   if (i < data.length - 1) {
    //     processedData.append(data[data.length - 1]);
    //   }
    //   return processedData;
    // };

    // Draw grey lines
    this.flights.forEach((flight) => {
      const positions = JSON.parse(
        flight["latitude, longitude"].replaceAll("'", '"')
      );
      this.layers.addLayer(
        L.polyline([positions[0], positions[positions.length - 1]], {
          opacity: 0.3,
          color: "blue",
          weight: 1,
        })
      );
    });

    // Draw Fligths
    this.flights.forEach((flight) => {
      const positions = JSON.parse(
        flight["latitude, longitude"].replaceAll("'", '"')
      );
      const lines = splitFlightLine(positions);
      // // Random color for each path
      // const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

      lines.map((path) => {
        this.layers.addLayer(
          L.polyline(path, {
            opacity: 0.3,
            color: "orange",
            weight: 1,
          })
        );
      });
      // // Add circle for each point
      // path.map((point) =>
      //   L.circleMarker(point, { radius: 1, color })
      //     .on("click", () => onClick(flight, positions))
      //     .addTo(map)
      // );
    });
    this.layers.addTo(this.map);
  },
};
</script>

<style scoped>
#flight-map {
  width: 100%;
  height: 100%;
}
</style>
