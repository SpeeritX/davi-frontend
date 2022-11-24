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

const updateFlightPaths = async (filters) => {
  const flights = await fetchFlights(filters);
  const layers = L.layerGroup([], { pane: "flights" });

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

  flights.forEach((flight) => {
    const positions = JSON.parse(
      flight["latitude, longitude"].replaceAll("'", '"')
    );
    layers.addLayer(
      L.polyline([positions[0], positions[positions.length - 1]], {
        opacity: 0.3,
        color: "blue",
        weight: 1,
        pane: "flights",
      })
    );
  });

  flights.forEach((flight) => {
    const positions = JSON.parse(
      flight["latitude, longitude"].replaceAll("'", '"')
    );
    const lines = splitFlightLine(positions);

    lines.map((path) => {
      layers.addLayer(
        L.polyline(path, {
          opacity: 0.3,
          color: "orange",
          weight: 1,
          pane: "flights",
        })
      );
    });
    // path.map((point) =>
    //   L.circleMarker(point, { radius: 1, color })
    //     .on("click", () => onClick(flight, positions))
    //     .addTo(map)
    // );
  });
  return layers;
};
export default updateFlightPaths;
