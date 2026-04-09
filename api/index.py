from flask import Flask, jsonify
from flask_cors import CORS # Certifique-se que instalou via requirements.txt

app = Flask(__name__)
CORS(app) # Isso libera o acesso para qualquer origem, incluindo sua Vercel

@app.route('/api')
def index():
    return jsonify({"mensagem": "Estrutura Google Cloud Run ativa!", "status": "v4 operacional"})