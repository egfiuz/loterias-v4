// A URL mágica do nosso servidor no Google Cloud
const API_URL = "https://loterias-v4-957072274278.southamerica-east1.run.app";

// --- CONTROLE VISUAL DOS MODAIS ---
function abrirModal() {
    document.getElementById('modal-login').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-login').style.display = 'none';
}

function trocarParaCadastro() {
    document.getElementById('modal-login').style.display = 'none';
    document.getElementById('modal-cadastro').style.display = 'flex';
}

function trocarParaLogin() {
    document.getElementById('modal-cadastro').style.display = 'none';
    document.getElementById('modal-login').style.display = 'flex';
}

function fecharModalCadastro() {
    document.getElementById('modal-cadastro').style.display = 'none';
}

// --- 1. FUNÇÃO DE CADASTRO VIP ---
async function fazerCadastro(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome_cad').value;
    const email = document.getElementById('email_cad').value;
    const senha = document.getElementById('senha_cad').value;

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos para criar sua conta!");
        return;
    }

    try {
        // Agora sim, apontando para a nuvem do Google na rota certa!
        const response = await fetch(`${API_URL}/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Sua conta VIP foi criada com sucesso! Faça login para usar o sistema.");
            document.getElementById('nome_cad').value = '';
            document.getElementById('email_cad').value = '';
            document.getElementById('senha_cad').value = '';
            trocarParaLogin();
        } else {
            alert("Atenção: " + data.error);
        }
    } catch (error) {
        console.error("Erro no cadastro:", error);
        alert("Falha ao conectar com o servidor.");
    }
}

// --- 2. FUNÇÃO DA FECHADURA (LOGIN) ---
function fazerLogin(event) {
    event.preventDefault(); 
    
    const email = document.getElementById('email_login').value;
    const senha = document.getElementById('senha_login').value;

    if (email && senha) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userSenha', senha);
        alert("Acesso liberado! O sistema já sabe quem você é.");
        fecharModal(); 
    } else {
        alert("Preencha e-mail e senha!");
    }
}

// --- 3. FUNÇÃO DO MOTOR (GERAR JOGO MEGA-SENA) ---
async function gerarPalpiteMegaSena() {
    const emailLogado = localStorage.getItem('userEmail');
    const senhaLogada = localStorage.getItem('userSenha');

    if (!emailLogado || !senhaLogada) {
        alert("Acesso Negado: Clique em 'Entrar VIP' e faça login primeiro!");
        return;
    }

    try {
        const botao = document.getElementById('btn_mega'); 
        botao.innerText = "Processando IA...";

        const response = await fetch(`${API_URL}/gerar-palpite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailLogado, senha: senhaLogada })
        });

        const data = await response.json();

        if (response.ok) {
            const dezenasFormatadas = data.dezenas.map(d => d.toString().padStart(2, '0')).join(' - ');
            
            document.getElementById('numeros_mega').innerText = dezenasFormatadas;
            document.getElementById('analise_mega').innerHTML = `
                Soma Gauss: ${data.analise.soma_gauss} | 
                ${data.analise.pares} Pares / ${data.analise.impares} Ímpares
            `;
        } else {
            alert("Erro: " + data.error);
        }

        botao.innerText = "Gerar Jogo Otimizado";

    } catch (error) {
        console.error("Erro:", error);
        alert("Falha na comunicação com a IA.");
    }
}