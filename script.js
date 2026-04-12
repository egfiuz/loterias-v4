// A URL mágica do nosso servidor no Google Cloud
const API_URL = "https://loterias-v4-957072274278.southamerica-east1.run.app";

// ==========================================
// 1. CONTROLE VISUAL DOS MODAIS
// ==========================================
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

// ==========================================
// 2. SISTEMA DE CADASTRO VIP
// ==========================================
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

// ==========================================
// 3. SISTEMA DE LOGIN REAL (A Fechadura do Banco de Dados)
// ==========================================
async function fazerLogin(event) {
    event.preventDefault(); 
    
    const email = document.getElementById('email_login').value;
    const senha = document.getElementById('senha_login').value;

    if (!email || !senha) {
        alert("Preencha e-mail e senha!");
        return;
    }

    try {
        // Agora bate no banco de dados de verdade!
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha })
        });

        const data = await response.json();

        if (response.ok) {
            // Se o Python disse que existe, nós liberamos!
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userSenha', senha);
            alert(data.msg + " Acesso liberado!");
            fecharModal(); 
        } else {
            // Se errou a senha ou não existe:
            alert("Acesso Negado: " + data.detail);
        }
    } catch (error) {
        console.error("Erro no login:", error);
        alert("Falha ao conectar com o servidor para login.");
    }
}

// ==========================================
// 4. O MOTOR UNIVERSAL DE LOTERIAS
// ==========================================
async function gerarJogo(tipo) {
    const emailLogado = localStorage.getItem('userEmail');
    const senhaLogada = localStorage.getItem('userSenha');

    if (!emailLogado || !senhaLogada) {
        alert("Acesso Negado: Clique em 'Entrar VIP' e faça login primeiro!");
        return;
    }

    try {
        const botao = document.getElementById(`btn_${tipo}`); 
        botao.innerText = "Processando IA...";

        const response = await fetch(`${API_URL}/gerar-palpite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailLogado, senha: senhaLogada, tipo: tipo })
        });

        const data = await response.json();

        if (response.ok) {
            const dezenasFormatadas = data.dezenas.map(d => d.toString().padStart(2, '0')).join(' - ');
            
            document.getElementById(`numeros_${tipo}`).innerText = dezenasFormatadas;
            document.getElementById(`analise_${tipo}`).innerHTML = `
                Soma Gauss: ${data.analise.soma_gauss} | 
                ${data.analise.pares} Pares / ${data.analise.impares} Ímpares
            `;
        } else {
            alert("Erro: " + data.error);
        }

        botao.innerText = "Gerar Jogo Otimizado";

    } catch (error) {
        console.error("Erro:", error);
        alert("Falha na comunicação com a IA estatística.");
    }
}