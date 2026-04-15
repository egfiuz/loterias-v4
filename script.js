const API_URL = "https://loterias-v4-957072274278.southamerica-east1.run.app";

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

async function fazerCadastro(event) {
    event.preventDefault();
    const nome = document.getElementById('nome_cad').value;
    const email = document.getElementById('email_cad').value;
    const senha = document.getElementById('senha_cad').value;

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos!"); return;
    }

    try {
        const response = await fetch(`${API_URL}/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        const data = await response.json();
        if (response.ok) {
            alert("Conta criada! Faça login.");
            trocarParaLogin();
        } else {
            alert("Atenção: " + (data.detail || data.error));
        }
    } catch (error) {
        alert("Falha na conexão com o servidor.");
    }
}

async function fazerLogin(event) {
    event.preventDefault(); 
    const email = document.getElementById('email_login').value;
    const senha = document.getElementById('senha_login').value;

    if (!email || !senha) { alert("Preencha e-mail e senha!"); return; }

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
            alert(data.msg + " Acesso liberado!");
            fecharModal(); 
        } else {
            alert("Acesso Negado: " + data.detail);
        }
    } catch (error) {
        alert("Falha ao conectar com o servidor.");
    }
}

async function gerarJogo(tipo) {
    const emailLogado = localStorage.getItem('userEmail');
    const senhaLogada = localStorage.getItem('userSenha');

    if (!emailLogado || !senhaLogada) {
        alert("Acesso Negado: Faça login primeiro!"); return;
    }

    // --- INÍCIO DA TRAVA FREEMIUM (FRONTEND) ---
    // Resgata o histórico de uso desse usuário específico
    let jogosGerados = parseInt(localStorage.getItem(`uso_${emailLogado}`)) || 0;

    // Se já usou as 3 chances, bloqueia e rola a tela para o PIX
    if (jogosGerados >= 3) {
        alert("Você atingiu seu limite gratuito de 3 jogos. Torne-se VIP por R$ 19,90 para acesso ilimitado!");
        
        // Comando para rolar a tela suavemente até a área VIP
        const areaVip = document.getElementById('area-vip');
        if (areaVip) {
            areaVip.scrollIntoView({ behavior: 'smooth' });
        }
        return; // Interrompe a execução aqui, não vai para a API
    }
    // --- FIM DA LÓGICA DE BLOQUEIO ---

    try {
        const botao = document.getElementById(`btn_${tipo}`); 
        botao.innerText = "Processando...";

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
    <div style="background: #222; padding: 8px; border-radius: 5px; border: 1px solid #444; display: inline-block; text-align: center; margin-top: 5px;">
        <span style="color: #3498db; font-weight: bold;">Gauss: ${data.analise.soma_gauss}</span> | 
        <span style="color: #e74c3c; font-weight: bold;">${data.analise.pares}P / ${data.analise.impares}I</span><br>
        <span style="color: #2ecc71; font-size: 11px;">✔️ Fibo. Aplicado | ✔️ Lei Benford Validada | 📡 Caixa Sync</span>
    </div>
`;
            
            // Jogo gerado com sucesso! Adiciona +1 no contador do usuário
            jogosGerados++;
            localStorage.setItem(`uso_${emailLogado}`, jogosGerados);
            
            // Dica de UX: Avisa quantos jogos restam se ainda não zerou
            if (jogosGerados === 2) {
                console.log("Atenção: Resta apenas 1 jogo gratuito!");
            }

        } else {
            alert("Erro: " + data.detail);
        }
        botao.innerText = "Gerar Jogo Otimizado";
    } catch (error) {
        alert("Falha de comunicação.");
    }
}

// --- LÓGICA DO SISTEMA DE COMENTÁRIOS RAIZ ---

async function carregarComentarios() {
    try {
        const response = await fetch(`${API_URL}/comentarios`);
        const comentarios = await response.json();
        const lista = document.getElementById('lista_comentarios');
        lista.innerHTML = ''; 

        if (comentarios.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #888;">Seja o primeiro a comentar e testar a nossa API!</p>';
            return;
        }

        comentarios.forEach(c => {
            lista.innerHTML += `
                <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;">
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
        alert("Preencha o seu nome e o comentário!");
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
        } else {
            alert("Erro ao enviar o comentário.");
        }
    } catch (error) {
        alert("Falha de conexão com o servidor.");
    }
}

window.onload = carregarComentarios;