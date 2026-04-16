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

function abrirInstrucoes() { document.getElementById('modal-instrucoes').style.display = 'flex'; }
function fecharInstrucoes() { document.getElementById('modal-instrucoes').style.display = 'none'; }

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
    
    // Pega a quantidade selecionada no dropdown. Se não achar, manda 0 (o backend usa o padrão)
    const selectQtd = document.getElementById(`qtd_${tipo}`);
    const qtdEscolhida = selectQtd ? parseInt(selectQtd.value) : 0; 

    if (!emailLogado || !senhaLogada) {
        alert("Acesso Negado: Faça login primeiro para usar a IA!"); 
        return;
    }

    try {
        const botao = document.getElementById(`btn_${tipo}`); 
        botao.innerText = "Processando Matemática...";

        const response = await fetch(`${API_URL}/gerar-palpite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: emailLogado, 
                senha: senhaLogada, 
                tipo: tipo,
                qtd_dezenas: qtdEscolhida
            })
        });

        const data = await response.json();

        // Tratamento inteligente dos bloqueios do Backend (Cadeado do Cloud)
        if (response.status === 403) {
            if (data.detail && data.detail.includes("Elite")) {
                alert("🔒 Essa funcionalidade de desdobramento exige o Plano ELITE (R$ 29,90). Faça o upgrade e jogue como os profissionais!");
            } else {
                alert("⏱️ Limite de 3 testes gratuitos atingido. Garanta o Acesso Vitalício PRO para geração ilimitada!");
            }
            document.getElementById('area-vip').scrollIntoView({ behavior: 'smooth' });
            botao.innerText = "Gerar Jogo Otimizado";
            return;
        }

        if (response.ok) {
            const dezenasFormatadas = data.dezenas.map(d => d.toString().padStart(2, '0')).join(' - ');
            document.getElementById(`numeros_${tipo}`).innerText = dezenasFormatadas;
            
            // Renderização do diagnóstico super técnico
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
        } else {
            alert("Erro do Servidor: " + (data.detail || "Erro desconhecido"));
        }
        botao.innerText = "Gerar Jogo Otimizado";
    } catch (error) {
        alert("Falha de comunicação com a Nuvem Google.");
        document.getElementById(`btn_${tipo}`).innerText = "Gerar Jogo Otimizado";
    }
}

// --- SISTEMA DE COMENTÁRIOS ---
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
        alert("Preencha seu nome e o seu relato de uso!");
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
            alert("Falha ao registrar o comentário.");
        }
    } catch (error) {
        alert("Falha de conexão com o servidor de comentários.");
    }
}

window.onload = carregarComentarios;