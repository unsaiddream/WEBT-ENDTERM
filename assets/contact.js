function validateField(field) {
  const value = field.value.trim();
  if (!value) return field.name === "genre" ? "Choose a genre." : "Please fill in this field.";
  if (field.maxLength > 0 && value.length > field.maxLength) return `Use no more than ${field.maxLength} characters.`;
  if (field.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter an email like name@example.com.";
  if (["name", "artist", "city"].includes(field.name) && value.length < 2) return "Enter at least 2 characters.";
  if (field.name === "reason" && value.length < 10) return "Write at least 10 characters about the artist.";
  if (field.name === "genre" && !["Pop", "Hip-hop", "Electronic", "Alternative", "Jazz", "Other"].includes(value)) return "Choose a genre from the list.";
  return "";
}

function showFieldError(field) {
  const message = validateField(field);
  document.getElementById(`${field.id}-error`).textContent = message;
  field.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return message === "";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#suggestion-form");
  const status = document.querySelector("#form-status");
  const fields = Array.from(form.querySelectorAll("input, select, textarea"));
  let submitted = false;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
    let firstInvalid = null;
    for (const field of fields) {
      if (!showFieldError(field) && !firstInvalid) firstInvalid = field;
    }
    status.textContent = "";
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    const artist = form.elements.artist.value.trim();
    const city = form.elements.city.value.trim();
    const genre = form.elements.genre.value;
    // User input stays text, never HTML.
    status.textContent = `Suggestion ready: ${artist} from ${city} (${genre}). This is a preview; nothing was sent or saved.`;
  });

  for (const field of fields) {
    field.addEventListener("input", () => {
      status.textContent = "";
      if (submitted) showFieldError(field);
      if (field.name === "reason") document.querySelector("#reason-count").textContent = field.value.length;
    });
    field.addEventListener("change", () => {
      status.textContent = "";
      if (submitted) showFieldError(field);
    });
    field.addEventListener("blur", () => {
      if (field.value.trim() || submitted) showFieldError(field);
    });
  }
});
