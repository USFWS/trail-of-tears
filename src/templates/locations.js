const slugify = require("underscore.string/slugify");

module.exports = loc => {
  return `<li class="${slugify(loc.properties.name)}">
    <figure>
      <img src="${loc.properties.images[0].src}" alt="${
    loc.properties.images[0].alt
  }"/>
      <figcaption>${loc.properties.images[0].caption}</figcaption>
    </figure>
    <h2>${loc.properties.name}</h2>
    <div>${loc.properties.content}</div>
  </li>`;
};
