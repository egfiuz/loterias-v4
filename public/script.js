// Endereço da sua inteligência no Google Cloud
const API_URL = "https://loterias-v4-957072274278.southamerica-east1.run.app/api";

async function gerarJogo(tipo) {
    // 1. Identifica qual card atualizar (mega ou loto)
    const cardId = tipo === 'mega' ? 'resultado-mega' : 'resultado-loto';
    const display = document.getElementById(cardId);

    if (display) {
        display.innerHTML = '<span style="color: #888;">Consultando nuvem...</span>';
    }

    try {
        // 2. Chama a API v4
        const response = await fetch(API_URL);
        const data = await response.json();

        // 3. Exibe a resposta vinda do Google Cloud
        if (display) {
            display.innerHTML = `<b style="color: #00ff88;">${data.mensagem}</b>`;
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        if (display) display.innerText = "Erro ao conectar.";
    }
}