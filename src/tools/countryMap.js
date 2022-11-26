import L from "leaflet";

let geojson;

const style = () => {
  return {
    weight: 3,
    opacity: 1,
    color: "#737373",
    dashArray: "3",
    fillOpacity: 0,
  };
};

const setCountryMap = (stateData) => {
  geojson = L.geoJson(stateData, {
    style: style,
    pane: "countries",
  });
  return geojson;
};

export default setCountryMap;
