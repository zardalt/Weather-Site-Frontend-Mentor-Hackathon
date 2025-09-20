export function noSearchResult() {
  document.querySelector('main').innerHTML = `
    <p class = "search-result-none">No search result found!</p>
  `;

  const d = document.querySelector('.search-result-none').style;

  d.margin = "0 auto";
  d.fontSize = "1.25em";
  d.fontWeight = "700";
}