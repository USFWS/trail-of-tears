require('classlist-polyfill');

const L = require('leaflet');
const xhr = require('xhr');
const parallel = require('async/parallel');
const objectAssign = require('object-assign');
const slugify = require('underscore.string/slugify');
const scroll = require('scroll');

const Infowindow = require('./infowindow');
const emitter = require('./mediator');

L.Icon.Default.imagePath = './images/';

const list = document.querySelector('.locations');
let locations;
let leaf;

parallel([
  getFile.bind(null, './data/locations.js')
], init);

function init(err, results) {
  if (err) console.error(err);

  const mapDiv = document.createElement('div');
  const header = document.querySelector('header');
  const locations = results[0];
  remove(list);
  mapDiv.classList.add('map');
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
  const toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
  	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  	subdomains: 'abcd',
  	minZoom: 0,
  	maxZoom: 20,
  	ext: 'png'
  }).addTo(leaf);

  new L.Control.Zoom({ position: 'bottomright' }).addTo(leaf);

  leaf.fitBounds(layer.getBounds(), { paddingTopLeft: [350, 0] });
  return leaf;
}

function onEachFeature(feature, layer) {
  // layer.bindPopup(feature.properties.name);
  layer.on('click', scrollToLocation);
}

function pointToLayer(feature, latlng) {
  return L.marker(latlng, {
    icon: L.icon({
      iconUrl: './images/blue-goose.svg',
      iconSize: [60, 80],
      popupAnchor: [5, -17],
      shadowUrl: './images/blue-goose-shadow.png',
      shadowSize: [40, 40],
      shadowAnchor: [0, 22]
    }),
    alt: 'Icon representing a field station'
  });
}

function scrollToLocation(feature) {
  const props = feature.target.feature.properties;
  const el = document.querySelector(`.${slugify(props.name)}`);
  const infowindowContent = document.querySelector('.infowindow-content');
  scroll.top(infowindowContent, el.offsetTop - 10, { duration: 700 });
}

function getFile (path, cb) {
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
