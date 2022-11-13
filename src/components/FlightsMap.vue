<template>
  <div>
    <div id="flight-map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
        [54, 41],
        [40, 20],
      ],
      maxBoundsViscosity: 1,
    }).setView([50.45, 30.52], 6.3);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
    this.layers = L.layerGroup();
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
