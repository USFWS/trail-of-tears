const ARROW_RIGHT = "&#9650;";
const ARROW_LEFT = "&#9660;";

const slugify = require("underscore.string/slugify");
const template = require("../templates/locations");

const Infowindow = function(data) {
  this.locations = data.locations;
  this.active = data.initialView || true;
  this.emitter = data.emitter;

  this.container = create("aside", "infowindow-container", document.body);
  this.toggleBtn = create("button", "infowindow-toggle", this.container);
  this.toggleBtn.innerHTML = this.active ? ARROW_RIGHT : ARROW_LEFT;
  this.content = create("section", "infowindow-content", this.container);
  this.list = create("ul", "infowindow-list", this.content);

  // this.list.innerHTML = template({ locations: this.locations, slugify });
  this.list.innerHTML = this.locations.map(template).join("");
  this.toggleBtn.addEventListener("click", this.toggle.bind(this));
  if (this.active) this.show();
};

module.exports = Infowindow;

Infowindow.prototype.show = function() {
  // if (!this.active) emitter.emit('infowindow:show', -200);
  this.active = true;
  this.toggleBtn.innerHTML = ARROW_LEFT;
  this.container.classList.add("active");
};

Infowindow.prototype.hide = function() {
  // if (this.active) emitter.emit('infowindow:hide', 200);
  this.active = false;
  this.toggleBtn.innerHTML = ARROW_RIGHT;
  this.container.classList.remove("active");
};

Infowindow.prototype.toggle = function() {
  // const eventName = (this.active) ? 'infowindow:hide' : 'infowindow:show';
  // const distance = (this.active) ? 200 : -200;
  this.toggleBtn.innerHTML = this.active ? ARROW_RIGHT : ARROW_LEFT;
  this.container.classList.toggle("active");
  this.active = !this.active;
  // emitter.emit(eventName, distance);
};

function create(tagName, className, container) {
  const el = document.createElement(tagName);
  if (className) el.classList.add(className);
  if (container) container.appendChild(el);
  return el;
}
