import L from "leaflet";
import mapService from "../services/mapService";

let geojson;
let matrixData;

const getColor = (value, max) => {
  const proportion = value / max;
  return proportion > 0.75
    ? "#252525"
    : proportion > 0.5
    ? "#636363"
    : proportion > 0.25
    ? "#969696"
    : proportion > 0
    ? "#bdbdbd"
    : "#d9d9d9";
};

const styleRegion = (region, maxValue) => {
  return {
    fillColor: getColor(matrixData[region.properties.name], maxValue),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 1,
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

const updateRegionMap = async (filters, stateData) => {
  const response = await mapService.getFlightPerRegion(filters);
  matrixData = response.data;
  const maxValue = Math.max(...Object.values(Object.values(matrixData)));
  console.log(maxValue);
  geojson = L.geoJson(stateData, {
    style: (e) => styleRegion(e, maxValue),
    // onEachFeature: onEachRegion,
    pane: "regions",
  });
  return geojson;
};

export default updateRegionMap;
