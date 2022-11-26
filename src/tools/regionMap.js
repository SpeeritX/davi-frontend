import L from "leaflet";

let geojson;

const getColor = (value, max) => {
  const proportion = value / max;
  return proportion > 2 / 3
    ? "#969696"
    : proportion > 1 / 3
    ? "#bdbdbd"
    : proportion > 0
    ? "#d9d9d9"
    : "#f0f0f0";
};

const styleRegion = (region, matrixData, maxValue, choropleth) => {
  return {
    fillColor: choropleth
      ? getColor(matrixData[region.properties.name], maxValue)
      : "#f0f0f0",
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

const updateRegionMap = async (matrixData, maxValue, stateData, choropleth) => {
  geojson = L.geoJson(stateData, {
    style: (e) => styleRegion(e, matrixData, maxValue, choropleth),
    // onEachFeature: onEachRegion,
    pane: "regions",
  });
  return geojson;
};

export default updateRegionMap;
