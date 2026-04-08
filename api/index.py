from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sqlite3
import bcrypt

app = Flask(__name__)
CORS(app)

# Caminho do banco de dados na pasta temporária da Vercel
DB_PATH = os.path.join('/tmp', 'database.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Inicia o banco ao subir o servidor
init_db()

@app.route('/api', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "message": "Super Loterias API v4 rodando!"})

@app.route('/api/registrar', methods=['POST'])
def registrar():
    data = request.json
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')

    if not nome or not email or not senha:
        return jsonify({"erro": "Dados incompletos"}), 400

    senha_hash = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", (nome, email, senha_hash))
        conn.commit()
        conn.close()
        return jsonify({"mensagem": "Usuário criado com sucesso!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"erro": "E-mail já cadastrado"}), 400

# Export para a Vercel
app = app