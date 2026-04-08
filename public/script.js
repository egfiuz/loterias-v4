// Função de exemplo para o Cadastro
async function cadastrarUsuario(payload) {
    try {
        const response = await fetch('/api/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Cadastro realizado! Tente fazer login.");
        } else {
            alert("Erro: " + data.erro);
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Erro de conexão. O servidor Python está ligado?");
    }
}