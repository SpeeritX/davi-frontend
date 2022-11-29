import L from "leaflet";
import FlightsService from "../services/flightsService";

const fetchFlights = async (filters) => {
  const response = await FlightsService.getFlights(filters);
  return response.data;
};

const splitFlightLine = (path) => {
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

const updateFlightPaths = async (
  filters,
  shortestPaths,
  showFlightPaths,
  pathsOpacity
) => {
  const flights = await fetchFlights(filters);
  const layers = L.layerGroup([], { pane: "flights" });

  if (shortestPaths) {
    flights.forEach((flight) => {
      const positions = JSON.parse(
        flight["latitude, longitude"].replaceAll("'", '"')
      );
      layers.addLayer(
        L.polyline([positions[0], positions[positions.length - 1]], {
          opacity: pathsOpacity / 100,
          color: "black",
          weight: 1,
          pane: "flights",
        })
      );
    });
  }
  if (showFlightPaths) {
    flights.forEach((flight) => {
      const positions = JSON.parse(
        flight["latitude, longitude"].replaceAll("'", '"')
      );
      const lines = splitFlightLine(positions);

      lines.map((path) => {
        layers.addLayer(
          L.polyline(path, {
            opacity: pathsOpacity / 100,
            color: "#7c009b", //#c51b8a //#7e68af
            weight: 1,
            pane: "flights",
          })
        );
      });
    });
  }
  return layers;
};
export default updateFlightPaths;
