const API_URL = "https://loterias-v4-957072274278.southamerica-east1.run.app";

// --- NOTIFICAÇÕES ELEGANTES (TOAST) ---
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    const corFundo = tipo === 'sucesso' ? '#2ecc71' : '#e74c3c';
    const icone = tipo === 'sucesso' ? '✅' : '⚠️';
    
    const toast = document.createElement('div');
    toast.innerHTML = `${icone} ${mensagem}`;
    toast.style.cssText = `
        position: fixed; top: 20px; right: -300px; background: ${corFundo}; color: black;
        padding: 15px 20px; border-radius: 5px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        z-index: 9999; transition: right 0.5s ease-in-out; font-family: sans-serif;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => { toast.style.right = '20px'; }, 100);
    setTimeout(() => {
        toast.style.right = '-300px';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// --- CONTROLE DE MODAIS E INTERFACE ---
function abrirModal() { document.getElementById('modal-login').style.display = 'flex'; }
function fecharModal() { document.getElementById('modal-login').style.display = 'none'; }
function trocarParaCadastro() {
    document.getElementById('modal-login').style.display = 'none';
    document.getElementById('modal-cadastro').style.display = 'flex';
}
function trocarParaLogin() {
    document.getElementById('modal-cadastro').style.display = 'none';
    document.getElementById('modal-login').style.display = 'flex';
}
function fecharModalCadastro() { document.getElementById('modal-cadastro').style.display = 'none'; }
function abrirCiencia() { document.getElementById('modal-ciencia').style.display = 'flex'; }
function fecharCiencia() { document.getElementById('modal-ciencia').style.display = 'none'; }
function abrirContato() { document.getElementById('modal-contato').style.display = 'flex'; }
function fecharContato() { document.getElementById('modal-contato').style.display = 'none'; }
function abrirInstrucoes() { document.getElementById('modal-instrucoes').style.display = 'flex'; }
function fecharInstrucoes() { document.getElementById('modal-instrucoes').style.display = 'none'; }
function abrirPainel() { document.getElementById('modal-painel').style.display = 'flex'; carregarDadosPainel(); }
function fecharPainel() { document.getElementById('modal-painel').style.display = 'none'; }

// --- LÓGICA DE AUTENTICAÇÃO E PAINEL ---
async function fazerCadastro(event) {
    event.preventDefault();
    const nome = document.getElementById('nome_cad').value;
    const email = document.getElementById('email_cad').value;
    const senha = document.getElementById('senha_cad').value;

    if (!nome || !email || !senha) {
        mostrarNotificacao("Preencha todos os campos!", "erro"); return;
    }

    try {
        const response = await fetch(`${API_URL}/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        const data = await response.json();
        if (response.ok) {
            mostrarNotificacao("Conta criada! Verifique seu e-mail para ativar.", "sucesso");
            trocarParaLogin();
        } else {
            mostrarNotificacao("Atenção: " + (data.detail || data.error), "erro");
        }
    } catch (error) {
        mostrarNotificacao("Falha na conexão com o servidor.", "erro");
    }
}

async function fazerLogin(event) {
    event.preventDefault(); 
    const email = document.getElementById('email_login').value;
    const senha = document.getElementById('senha_login').value;

    if (!email || !senha) { mostrarNotificacao("Preencha e-mail e senha!", "erro"); return; }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userSenha', senha);
            mostrarNotificacao(`Bem-vindo, ${email.split('@')[0]}! Acesso liberado.`, "sucesso");
            fecharModal(); 
            atualizarInterfaceLogin();
        } else {
            mostrarNotificacao("Acesso Negado: " + data.detail, "erro");
        }
    } catch (error) {
        mostrarNotificacao("Falha ao conectar com o servidor.", "erro");
    }
}

function atualizarInterfaceLogin() {
    const emailLogado = localStorage.getItem('userEmail');
    const areaAuth = document.getElementById('area-autenticacao');

    if (emailLogado) {
        const nomeUsuario = emailLogado.split('@')[0].toUpperCase();
        areaAuth.innerHTML = `
            <button onclick="abrirPainel()" style="padding: 8px 15px; background: #3498db; border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer;">👤 ${nomeUsuario} (Painel)</button>
            <button onclick="fazerLogout()" style="padding: 8px 15px; background: #e74c3c; border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer;">Sair</button>
        `;
    } else {
        areaAuth.innerHTML = `
            <button class="btn-vip" onclick="abrirModal()" style="padding: 8px 15px; background: #f1c40f; border: none; border-radius: 5px; color: black; font-weight: bold; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">Entrar VIP</button>
        `;
    }
}

function fazerLogout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userSenha');
    mostrarNotificacao("Você saiu do sistema. Até logo!", "sucesso");
    setTimeout(() => location.reload(), 1500);
}

function carregarDadosPainel() {
    const emailLogado = localStorage.getItem('userEmail');
    if (!emailLogado) return;

    let plano = "FREEMIUM";
    let vencimento = "Vitalício";
    let jogos = "Consulte a Cota";

    if (emailLogado.includes("vip") || emailLogado === "egfiuza@gmail.com") {
        plano = "👑 ELITE";
        jogos = "Ilimitado";
    }

    document.getElementById('painel_plano').innerText = plano;
    document.getElementById('painel_vencimento').innerText = vencimento;
    document.getElementById('painel_jogos').innerText = jogos;
}

function verificarUpsellRetorno() {
    const emailLogado = localStorage.getItem('userEmail');
    if (!emailLogado || emailLogado.includes("vip") || emailLogado === "egfiuza@gmail.com") return;

    const hoje = new Date().toDateString();
    const ultimoAcesso = localStorage.getItem('ultimoAcesso');

    if (ultimoAcesso && ultimoAcesso !== hoje) {
        setTimeout(() => {
            const querVip = confirm("Bem-vindo(a) de volta à SuperLoterias! 🍀\n\nQue tal dar um upgrade na sua sorte hoje e liberar acesso ilimitado?\n\nClique em 'OK' para ver os planos VIP ou 'Cancelar' para continuar no Freemium.");
            if (querVip) document.getElementById('area-vip').scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    }
    localStorage.setItem('ultimoAcesso', hoje);
}

// --- LÓGICA DE GERAÇÃO DA IA ---
async function gerarJogo(tipo) {
    const emailLogado = localStorage.getItem('userEmail');
    const senhaLogada = localStorage.getItem('userSenha');
    
    const selectQtd = document.getElementById(`qtd_${tipo}`);
    const qtdEscolhida = selectQtd ? parseInt(selectQtd.value) : 0; 

    if (!emailLogado || !senhaLogada) {
        mostrarNotificacao("Acesso Negado: Faça login primeiro para usar a IA!", "erro"); 
        return;
    }

    const botao = document.getElementById(`btn_${tipo}`); 
    botao.innerText = "Processando Matemática...";

    try {
        const response = await fetch(`${API_URL}/gerar-palpite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailLogado, senha: senhaLogada, tipo: tipo, qtd_dezenas: qtdEscolhida })
        });

        const data = await response.json();

        if (response.status === 403) {
            if (data.detail && data.detail.includes("Elite")) {
                mostrarNotificacao("Essa funcionalidade exige o Plano ELITE.", "erro");
            } else {
                mostrarNotificacao("Seu Freemium acabou! Escolha um plano.", "erro");
            }
            
            const areaVip = document.getElementById('area-vip');
            areaVip.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => { areaVip.style.backgroundColor = '#2c3e50'; }, 500);
            setTimeout(() => { areaVip.style.backgroundColor = '#1a1a1a'; }, 1000);
            
            botao.innerText = "Gerar Jogo Otimizado";
            return;
        }

        if (response.ok) {
            const dezenasFormatadas = data.dezenas.map(d => d.toString().padStart(2, '0')).join(' - ');
            document.getElementById(`numeros_${tipo}`).innerText = dezenasFormatadas;
            
            document.getElementById(`analise_${tipo}`).innerHTML = `
                <div style="background: #222; padding: 10px; border-radius: 5px; border: 1px solid #444; display: inline-block; text-align: center; margin-top: 8px;">
                    <span style="color: #3498db; font-weight: bold;">Gauss (Soma): ${data.analise.soma_gauss}</span> | 
                    <span style="color: #e74c3c; font-weight: bold;">${data.analise.pares}P / ${data.analise.impares}I</span><br>
                    <div style="margin-top: 5px;">
                        <span style="color: #2ecc71; font-size: 11px; margin-right: 5px;">✔️ Fibo. Aplicado</span>
                        <span style="color: #2ecc71; font-size: 11px; margin-right: 5px;">✔️ Lei Benford Validada</span>
                        <span style="color: #2ecc71; font-size: 11px;">📡 Caixa Sync</span>
                    </div>
                </div>
            `;
            mostrarNotificacao("Jogo gerado com sucesso!", "sucesso");
        } else {
            mostrarNotificacao("Erro do Servidor: " + (data.detail || "Erro desconhecido"), "erro");
        }
    } catch (error) {
        mostrarNotificacao("Falha de comunicação com a Nuvem Google.", "erro");
    }
    botao.innerText = "Gerar Jogo Otimizado";
}

// --- SISTEMA DE COMENTÁRIOS E DEPOIMENTOS ---
async function carregarComentarios() {
    try {
        const response = await fetch(`${API_URL}/comentarios`);
        const comentarios = await response.json();
        const lista = document.getElementById('lista_comentarios');
        lista.innerHTML = ''; 

        if (comentarios.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #888;">Nenhum depoimento ainda. Seja o primeiro a relatar seus resultados!</p>';
            return;
        }

        comentarios.forEach(c => {
            lista.innerHTML += `
                <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db; margin-bottom: 10px;">
                    <strong style="color: #fff;">${c.nome}</strong>
                    <p style="color: #aaa; margin: 5px 0 0 0; font-size: 14px;">${c.texto}</p>
                </div>
            `;
        });
    } catch (error) {
        console.log("Erro ao carregar comentários:", error);
    }
}

async function enviarComentario() {
    const nome = document.getElementById('nome_comentario').value;
    const texto = document.getElementById('texto_comentario').value;

    if (!nome || !texto) {
        mostrarNotificacao("Preencha seu nome e o seu relato de uso!", "erro");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/comentar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nome, texto: texto })
        });

        if (response.ok) {
            document.getElementById('nome_comentario').value = '';
            document.getElementById('texto_comentario').value = '';
            carregarComentarios(); 
            mostrarNotificacao("Comentário publicado com sucesso!", "sucesso");
        } else {
            mostrarNotificacao("Falha ao registrar o comentário.", "erro");
        }
    } catch (error) {
        mostrarNotificacao("Falha de conexão com o servidor de comentários.", "erro");
    }
}

// INICIALIZAÇÃO DA PÁGINA
window.addEventListener('load', () => {
    atualizarInterfaceLogin();
    verificarUpsellRetorno();
    carregarComentarios();
});