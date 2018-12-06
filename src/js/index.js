require("classlist-polyfill");

const L = require("leaflet");
const xhr = require("xhr");
const store = require("store");
const parallel = require("async/parallel");
const slugify = require("underscore.string/slugify");
const scroll = require("scroll");

const Infowindow = require("./infowindow");
const emitter = require("./mediator");

L.Icon.Default.imagePath = "./images/";

const list = document.querySelector(".locations");
const modal = document.querySelector(".modal");
const modalOptions = store.get("modal");
let locations;
let leaf;

document
  .querySelector(".modal-checkbox")
  .addEventListener("click", storeUserPreference);

if (modalOptions && modalOptions.display === false) remove(modal);
else modal.classList.add("show");

parallel([getFile.bind(null, "./data/locations.js")], init);

function init(err, results) {
  if (err) console.error(err);

  const mapDiv = document.createElement("div");
  const header = document.querySelector("header");

  document.body.addEventListener("click", removeModal);

  const locations = results[0];
  remove(list);
  mapDiv.classList.add("map");
  insertAfter(mapDiv, header);
  leaf = createMap(locations, mapDiv);
  const infowindow = new Infowindow({
    locations: locations.features,
    emitter
  });
}

function createMap(geojson, mapDiv) {
  const leaf = L.map(mapDiv, { scrollWheelZoom: false, zoomControl: false });
  const layer = L.geoJson(geojson, { onEachFeature, pointToLayer }).addTo(leaf);
  L.tileLayer(
    "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
  ).addTo(leaf);

  new L.Control.Zoom({ position: "bottomright" }).addTo(leaf);

  leaf.fitBounds(layer.getBounds(), { paddingTopLeft: [350, 0] });
  return leaf;
}

function onEachFeature(feature, layer) {
  layer.on("click", scrollToLocation);
}

function pointToLayer(feature, latlng) {
  return L.marker(latlng, {
    icon: L.icon({
      iconUrl: "./images/blue-goose.svg",
      iconSize: [60, 80],
      popupAnchor: [5, -17],
      shadowUrl: "./images/blue-goose-shadow.png",
      shadowSize: [40, 40],
      shadowAnchor: [0, 22]
    }),
    alt: "Icon representing a field station"
  });
}

function scrollToLocation(feature) {
  const props = feature.target.feature.properties;
  const el = document.querySelector(`.${slugify(props.name)}`);
  const infowindowContent = document.querySelector(".infowindow-content");
  scroll.top(infowindowContent, el.offsetTop - 10, { duration: 700 });
}

function getFile(path, cb) {
  xhr.get(path, (err, res, body) => {
    if (err) return cb(err);
    else return cb(null, JSON.parse(body));
  });
}

function remove(el) {
  var parent = el.parentNode;
  if (parent) parent.removeChild(el);
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function removeModal() {
  remove(modal);
}

function storeUserPreference(e) {
  store.set("modal", { display: false });
}
