document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!keyword) {
    alert("Digite um produto para buscar.");
    return;
  }

  resultsDiv.innerHTML = "<p>Carregando...</p>";

  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      return;
    }

    resultsDiv.innerHTML = data.results.map(p => `
      <div class="result-card">
        ${p.image ? `<img src="${p.image}" alt="${p.title}"/>` : ""}
        <h3>${p.title}</h3>
        ${p.rating ? `<p>⭐ ${p.rating}</p>` : ""}
        ${p.reviews ? `<p>${p.reviews} avaliações</p>` : ""}
        ${p.link ? `<a href="${p.link}" target="_blank">Ver na Amazon</a>` : ""}
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = "<p>Erro ao buscar produtos.</p>";
  }
});
