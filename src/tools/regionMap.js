import L from "leaflet";
import mapService from "../services/mapService";

let geojson;
let matrixData;

const getColor = (value) => {
  return value > 1000
    ? "#800026"
    : value > 500
    ? "#BD0026"
    : value > 200
    ? "#E31A1C"
    : value > 100
    ? "#FC4E2A"
    : value > 50
    ? "#FD8D3C"
    : value > 20
    ? "#FEB24C"
    : value > 10
    ? "#FED976"
    : value > 0
    ? "#FFEDA0"
    : "#FFFFFF";
};

const styleRegion = (region) => {
  return {
    fillColor: getColor(matrixData[region.properties.name]),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
};

// const highlightFeature = (e) => {
//   const layer = e.target;

//   layer.setStyle({
//     weight: 5,
//     color: "#666",
//     dashArray: "",
//     fillOpacity: 0.7,
//   });
//   layer.bringToFront();
// };

// const resetRegionHighlight = (e) => {
//   geojson.resetStyle(e.target);
//   e.target.bringToBack();
// };

// const onEachRegion = (region, layer) => {
//   layer.on({
//     mouseover: highlightFeature,
//     mouseout: (e) => resetRegionHighlight(e),
//   });
// };

const setUpRegionMap = async (stateData) => {
  const response = await mapService.getFlightPerRegion({
    date_1: "2022-02-22",
    date_2: "2022-06-22",
  });
  matrixData = response.data;
  geojson = L.geoJson(stateData, {
    style: (e) => styleRegion(e),
    // onEachFeature: onEachRegion,
    pane: "regions",
  });
  return geojson;
};

export default setUpRegionMap;
