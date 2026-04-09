from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=['GET'])
def check_v4():
    return jsonify({"status": "v4 operacional", "mensagem": "Estrutura MKDIR funcionou!"})

# Exporta para a Vercel
app = app