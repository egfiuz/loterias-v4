// Endereço da sua inteligência no Google Cloud
const API_URL = "https://loterias-v4-957072274278.southamerica-east1.run.app";

async function gerarJogo(tipo) {
    // 1. Identifica qual card atualizar
    const cardId = tipo === 'mega' ? 'resultado-mega' : 'resultado-loto';
    const display = document.getElementById(cardId);

    if (display) {
        display.innerHTML = '<span style="color: #888;">Consultando nuvem...</span>';
    }

    try {
        // 2. Chama a API v4
        const response = await fetch(API_URL);
        const data = await response.json();

        // 3. Lógica para exibir os números sorteados
        // Pegamos os números dentro de data.jogos[tipo]
        const numerosSorteados = data.jogos[tipo];
        
        if (display && numerosSorteados) {
            // .join(' - ') coloca um traço entre os números para ficar bonito
            display.innerHTML = `<b style="color: #00ff88; font-size: 1.2rem;">${numerosSorteados.join(' - ')}</b>`;
        } else {
            display.innerHTML = `<b style="color: #00ff88;">${data.mensagem}</b>`;
        }

    } catch (error) {
        console.error("Erro na conexão:", error);
        if (display) display.innerText = "Erro ao conectar.";
    }
}
// FUNÇÃO DA FECHADURA
function fazerLogin(event) {
    // ... (todo o código da função que passei acima)
}

// FUNÇÃO DO MOTOR
async function gerarPalpiteMegaSena() {
    // ... (todo o código da função que passei acima)
}