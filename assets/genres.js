$(function () {
  const rows = $(".table tbody").children("tr");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $("#genre-search").on("input", function () {
    const query = $(this).val().trim().toLowerCase();
    let count = 0;
    rows.each(function () {
      const matches = $(this).text().toLowerCase().includes(query);
      $(this).toggle(matches);
      if (matches) count++;
    });
    $("#genre-count").text(count ? `${count} cities` : "No matching cities. Try another genre or clear the search.");
  });

  $(".listening-note button").on("click", function () {
    const button = $(this);
    const content = button.closest(".listening-note").find("div");
    const opening = button.attr("aria-expanded") !== "true";
    button.attr("aria-expanded", String(opening));
    // Remove the hidden attribute before animating; restore it after closing.
    content.stop(true, true);
    if (opening) {
      content.removeAttr("hidden").hide().slideDown(reducedMotion ? 0 : 180);
    } else {
      content.slideUp(reducedMotion ? 0 : 180, function () {
        $(this).attr("hidden", "");
      });
    }
  });
});
