# Music Map

Music Map is a five-page website about artists and music from six cities. This endterm continues [the midterm](https://github.com/unsaiddream/WEBT-MIDTERM) with the same pages, map, Bootstrap layout and blue-and-white design.

Live site: https://unsaiddream.github.io/WEBT-ENDTERM/

## Group member

- Sanzhar Karaulov

## Pages

- `index.html` — home and featured cities
- `map.html` — city pins and links to filtered artist lists
- `artists.html` — artist search, city and genre filters, saved artists
- `genres.html` — searchable comparison table and listening notes
- `contact.html` — suggestion form with a local preview

## Run locally

Open `index.html` in a browser. All libraries and the map are included locally; no installation or API key is needed. For consistent saved-list behaviour, use a local web server or the published site. For example, run `python3 -m http.server 8000` in this folder and open http://localhost:8000.

The site has no backend. Suggestions are validated and previewed on the page; they are not sent or stored. Saved artists use this browser's local storage, so another device or browser has a separate list. If storage is blocked, saving still works until the page is left.

## Endterm features and how to test them

1. **Artist search:** open Artists and type `nas`, `Almaty` or `electronic`. The list and result count update as you type. An unmatched search shows an empty message.
2. **City and genre filters:** choose Tokyo and Electronic. Yellow Magic Orchestra should remain. Search, city, genre and saved-only filters work together. Clear filters restores all six artists.
3. **Saved artists:** save an artist, enable Saved artists only, then reload. The artist should stay saved. Remove the artist while viewing saved items; its card disappears. Saved buttons also work from the keyboard.
4. **City map:** select Almaty's pin. Its card is highlighted and the city summary changes. Follow Artists from Almaty; the artist page opens with Almaty selected. City links and direct hashes such as `map.html#tokyo` also work.
5. **Genre search:** on Genres, enter `electronic`. Tokyo and Berlin remain. Clear the search to restore the table.
6. **Listening notes:** open Electronic music or Pop and hip-hop. The notes slide open and closed, and the button's expanded state changes. Reduced-motion settings disable the animation duration.
7. **Suggestion form:** submit it empty to see field-specific errors. Names, artists and cities need at least two characters; email needs a valid format; a genre must be selected; the recommendation needs 10–500 characters. Fix the fields and preview again. The preview appears only after every field passes. Editing a field clears the old preview. Text such as `<b>Artist</b>` is displayed as text.
8. **Mobile navigation:** narrow the browser and use the menu button. All five links remain available, and forms and cards stack on small screens.

## Code guide

| File | Purpose |
| --- | --- |
| `assets/data.js` | City and artist arrays shared by the map and artist pages |
| `assets/app.js` | Artist rendering, combined filters, saved-list storage and map selection |
| `assets/contact.js` | Validation rules, nearby error messages, character count and preview |
| `assets/genres.js` | jQuery table search and expandable listening notes |
| `assets/style.css` | Original styles with small additions for controls and feedback |

### JavaScript

`getCity(cityId)` returns a city from the array. `matchesArtist(artist, query, cityId, genre)` returns whether an artist matches the current filters. `createTextElement(tag, className, text)` creates reusable elements without treating text as HTML. `loadSavedArtists()` reads stored IDs and checks that they belong to known artists.

`renderArtists()` removes the previous cards with `replaceChildren()` and creates cards for the current results. `for...of` fills the city selector and adds city links; `forEach()` creates artist cards and genre options. `filter()` produces the result list and removes saved IDs.

Native event handlers use `addEventListener()` for `DOMContentLoaded`, `input`, `change`, `click`, `reset`, `submit`, `blur` and `hashchange`. Submit handlers use `event.preventDefault()` to keep the form on the page. The delegated artist click handler uses `event.target.closest()` because the buttons are recreated after filtering.

### Validation

`validateField(field)` returns an error message or an empty string. `showFieldError(field)` updates the nearby message, invalid styling and `aria-invalid`, and returns a boolean. The submit handler checks every field and focuses the first invalid one. Input and change handlers recheck fields after an attempted submission.

### jQuery

`assets/genres.js` uses ID selectors (`#genre-search`), class and descendant selectors (`.listening-note button`), and traversal with `children()`, `closest()` and `find()`. It handles `input` and `click` events. `toggle()` filters table rows, while `slideDown()` and `slideUp()` reveal and hide listening notes. `stop(true, true)` finishes an active animation before the next toggle.

## Checks

Browser checks cover combined filters, empty results, saved-list persistence and removal, map-to-artist navigation, jQuery search and notes, invalid and valid form submission, safe text rendering, and mobile navigation. All five pages were checked at 1440px and 390px for horizontal overflow and browser errors.

## Credits

Map shapes come from [geo-countries](https://github.com/datasets/geo-countries), based on Natural Earth data. Bootstrap and jQuery are included in `assets/vendor/` with their licenses. Artist and genre entries are examples, not complete descriptions of each city's music.
