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

const onEachRegion = (region, layer, onRegionHover, onRegionClick) => {
  layer.on({
    add: (e) => (e.target.id = region.properties.name),
    mouseover: () =>
      onRegionHover([region.properties.name, region.properties.name]),
    mouseout: () => onRegionHover([]),
    click: () =>
      onRegionClick([region.properties.name, region.properties.name]),
  });
};

const updateRegionMap = async (
  matrixData,
  maxValue,
  stateData,
  choropleth,
  onRegionHover,
  onRegionClick
) => {
  geojson = L.geoJson(stateData, {
    style: (e) => styleRegion(e, matrixData, maxValue, choropleth),
    onEachFeature: (region, layer) =>
      onEachRegion(region, layer, onRegionHover, onRegionClick),
    pane: "regions",
  });
  return geojson;
};

export default updateRegionMap;
