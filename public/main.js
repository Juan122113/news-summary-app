const btn = document.getElementById('btn');
const resDiv = document.getElementById('result');

const renderer = new marked.Renderer();

renderer.link = ({ href, title, text }) => {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title || ''}">${text}</a>`;
};

marked.setOptions({renderer: renderer});
    
btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.innerText = "⌛ Generando resumen...";
    resDiv.innerText = "⏳ Leyendo noticias y pidiendo resumen a Gemini...";

    try {
        const response = await fetch('/api/news');
        const data = await response.json();

        resDiv.innerHTML = marked.parse(data.summary);
    } catch (err) {
        resDiv.innerText = "❌ Error al obtener el resumen.";
    } finally {
        btn.innerText = "Generar Resumen";
        btn.disabled = false;
    }

});