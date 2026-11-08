function getCity(cityId) {
  return cities.find((city) => city.id === cityId);
}

function loadSavedArtists() {
  try {
    const saved = JSON.parse(localStorage.getItem("music-map-saved") || "[]");
    return Array.isArray(saved) ? saved.filter((id) => artists.some((artist) => artist.id === id)) : [];
  } catch {
    return [];
  }
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function matchesArtist(artist, query, cityId, genre) {
  const city = getCity(artist.city);
  const text = `${artist.name} ${city.name} ${city.country} ${artist.genre}`.toLowerCase();
  return text.includes(query.trim().toLowerCase()) &&
    (!cityId || artist.city === cityId) && (!genre || artist.genre === genre);
}

function setupArtists() {
  const list = document.querySelector("#artist-list");
  if (!list) return;

  const filters = document.querySelector("#artist-filters");
  const search = document.querySelector("#artist-search");
  const cityFilter = document.querySelector("#city-filter");
  const genreFilter = document.querySelector("#genre-filter");
  const savedOnly = document.querySelector("#saved-only");
  let savedArtists = loadSavedArtists();

  for (const city of cities) {
    cityFilter.add(new Option(city.name, city.id));
  }
  const genres = [...new Set(artists.map((artist) => artist.genre))];
  genres.forEach((genre) => genreFilter.add(new Option(genre, genre)));
  const requestedCity = new URLSearchParams(window.location.search).get("city");
  if (cities.some((city) => city.id === requestedCity)) cityFilter.value = requestedCity;

  function renderArtists() {
    list.replaceChildren();
    const results = artists.filter((artist) =>
      matchesArtist(artist, search.value, cityFilter.value, genreFilter.value) &&
      (!savedOnly.checked || savedArtists.includes(artist.id))
    );
    document.querySelector("#artist-count").textContent = `${results.length} of ${artists.length} artists`;
    if (results.length === 0) {
      list.append(createTextElement("li", "col-12", "No artists match. Try another search or clear the filters."));
    }
    results.forEach((artist) => {
      const city = getCity(artist.city);
      const item = createTextElement("li", "col-md-6 col-xl-4 artist-column", "");
      const card = createTextElement("article", "panel h-100", "");
      card.append(
        createTextElement("p", "eyebrow", `${city.name} · ${city.country}`),
        createTextElement("h2", "h5", artist.name),
        createTextElement("p", "text-muted-custom", artist.description),
        createTextElement("p", "genre-pill", artist.genre)
      );
      const button = createTextElement("button", "btn btn-outline-primary btn-sm", savedArtists.includes(artist.id) ? "Remove from saved" : "Save artist");
      button.type = "button";
      button.dataset.artist = artist.id;
      button.setAttribute("aria-label", `${button.textContent}: ${artist.name}`);
      button.setAttribute("aria-pressed", String(savedArtists.includes(artist.id)));
      card.append(button);
      item.append(card);
      list.append(item);
    });
  }

  filters.addEventListener("submit", (event) => event.preventDefault());
  search.addEventListener("input", renderArtists);
  cityFilter.addEventListener("change", renderArtists);
  genreFilter.addEventListener("change", renderArtists);
  savedOnly.addEventListener("change", renderArtists);
  filters.addEventListener("reset", (event) => {
    event.preventDefault();
    search.value = "";
    cityFilter.value = "";
    genreFilter.value = "";
    savedOnly.checked = false;
    renderArtists();
  });
  list.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-artist]");
    if (!button) return;
    const id = button.dataset.artist;
    const removing = savedArtists.includes(id);
    savedArtists = removing ? savedArtists.filter((saved) => saved !== id) : [...savedArtists, id];
    let message = removing ? "Artist removed from saved." : "Artist saved in this browser.";
    try {
      localStorage.setItem("music-map-saved", JSON.stringify(savedArtists));
    } catch {
      message = "Browser storage is unavailable. Your selection lasts until you leave this page.";
    }
    renderArtists();
    document.querySelector("#save-status").textContent = message;
    const nextButton = list.querySelector(`button[data-artist="${id}"]`);
    if (nextButton) nextButton.focus();
    else savedOnly.focus();
  });
  renderArtists();
}

function setupMap() {
  const map = document.querySelector(".map-picture");
  if (!map) return;

  for (const city of cities) {
    const card = document.getElementById(city.id);
    const link = createTextElement("a", "d-inline-block mt-3", `Artists from ${city.name}`);
    link.href = `artists.html?city=${city.id}`;
    card.append(link);
    card.tabIndex = -1;
  }

  function selectCity(id, moveFocus) {
    const city = getCity(id);
    if (!city) return;
    document.querySelectorAll(".city-card").forEach((card) => card.classList.toggle("selected-city", card.id === id));
    map.querySelectorAll(".map-pin").forEach((pin) => {
      if (pin.hash === `#${id}`) pin.setAttribute("aria-current", "location");
      else pin.removeAttribute("aria-current");
    });
    document.querySelector("#map-status").textContent = `${city.name}, ${city.country}: ${city.genres.join(" and ")}.`;
    if (moveFocus) document.getElementById(id).focus();
  }

  map.addEventListener("click", (event) => {
    const pin = event.target.closest(".map-pin");
    if (pin) selectCity(pin.hash.slice(1), true);
  });
  window.addEventListener("hashchange", () => selectCity(window.location.hash.slice(1), false));
  selectCity(window.location.hash.slice(1), false);
}

document.addEventListener("DOMContentLoaded", () => {
  setupArtists();
  setupMap();
});
