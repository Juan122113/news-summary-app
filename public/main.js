const btn = document.getElementById('btn');
const resDiv = document.getElementById('resultado');
    
btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.innerText = "⌛ Generando resumen...";
    resDiv.innerText = "⏳ Leyendo noticias y pidiendo resumen a Gemini...";

    try {
        // btn.disabled = true;
        const response = await fetch('/api/news');
        const data = await response.json();

                // const formattedText = data.summary
                //     .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Negritas
                //     .replace(/^\s*[\-\*]\s+/gm, '• ')        // Viñetas
                //     .replace(/---/g, '<hr style="border:0; border-top:1px solid #eee; margin:20px 0;">') // Líneas
                //     .replace(/^\. (.*)/gm, '<li>$1</li>') // Puntos que empiezan con "."
                //     .replace(/\n/g, '<br>');

                resDiv.innerHTML = marked.parse(data.summary);
            } catch (err) {
                resDiv.innerText = "❌ Error al obtener el resumen.";
            } finally {
                btn.innerText = "Generar Resumen con Gemini";
                btn.disabled = false;
            }
    });

//  async function cargarNoticias() {
    
            
    
        // }