// Función para crear la barra de progreso tricolor
const createProgressBar = (p1, px, p2) => {
    return `
    <div class="w-full h-2.5 flex rounded-full overflow-hidden bg-slate-700 mt-4">
        <div style="width: ${p1}%" class="bg-blue-500 transition-all" title="Local: ${p1}%"></div>
        <div style="width: ${px}%" class="bg-slate-400 transition-all" title="Empate: ${px}%"></div>
        <div style="width: ${p2}%" class="bg-emerald-500 transition-all" title="Visitante: ${p2}%"></div>
    </div>
    <div class="flex justify-between text-[10px] mt-1 text-slate-400 font-medium">
        <span>1: ${p1}%</span>
        <span>X: ${px}%</span>
        <span>2: ${p2}%</span>
    </div>`;
};

async function loadPredictions() {
    try {
        // En un entorno real, aquí harías: const response = await fetch('data.json');
        // Para que funcione localmente sin servidor, simulamos la data:
        const response = await fetch('data.json');
        const matches = await response.json();
        
        const grid = document.getElementById('matchGrid');
        const searchInput = document.getElementById('teamSearch');
        const countBadge = document.getElementById('matchCount');

        const renderMatches = (data) => {
            grid.innerHTML = '';
            countBadge.innerText = `${data.length} Partidos`;
            
            data.forEach(m => {
                const card = document.createElement('div');
                card.className = 'glass-card rounded-xl p-5 flex flex-col justify-between';
                
                // Dividir el string "Equipo A 1-2 Equipo B"
                const teams = m.Match.split(/\s\d+-\d+\s/);
                const score = m.Match.match(/\d+-\d+/);

                card.innerHTML = `
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-xs font-bold text-blue-400 tracking-tighter">2. BUNDESLIGA</span>
                        <span class="text-xs text-slate-500 italic">Prediction</span>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <div class="w-1/3 text-right font-semibold text-sm">${teams[0]}</div>
                        <div class="bg-slate-900 px-3 py-1 rounded text-xs font-mono font-bold text-white border border-slate-700">
                            ${score ? score[0] : 'VS'}
                        </div>
                        <div class="w-1/3 text-left font-semibold text-sm">${teams[1]}</div>
                    </div>
                    ${createProgressBar(m.Prob_1, m.Prob_X, m.Prob_2)}
                `;
                grid.appendChild(card);
            });
        };

        // Filtro en tiempo real
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = matches.filter(m => m.Match.toLowerCase().includes(term));
            renderMatches(filtered);
        });

        renderMatches(matches);

    } catch (error) {
        console.error("Error cargando el JSON:", error);
        document.getElementById('matchGrid').innerHTML = `<p class="text-red-400">Error al cargar datos. Asegúrate de que data.json exista.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadPredictions);