from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/api')
def index():
    # Gera 6 números únicos de 1 a 60 (Mega) e 15 de 1 a 25 (Loto)
    # sorted() deixa os números em ordem crescente
    jogo_mega = sorted(random.sample(range(1, 61), 6))
    jogo_loto = sorted(random.sample(range(1, 26), 15))
    
    return jsonify({
        "mensagem": "Sorteio realizado com sucesso!",
        "jogos": {
            "mega": jogo_mega,
            "loto": jogo_loto
        }
    })