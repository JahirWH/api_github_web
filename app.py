import os
from github import Github
import requests
import json
from datetime import datetime
from flask import Flask, jsonify, request, render_template
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Obtener el token de GitHub desde las variables de entorno
github_token = os.getenv('GITHUBTOKEN')
repos_names = os.getenv('REPOSNAMES')
user = os.getenv('usuario')


# Inicializar el cliente de GitHub con el token
g = Github(github_token)


# Separar los nombres de repositorios
repo_list = repos_names.split(',')

# Lista para almacenar datos de repositorios
repos_data = []

# Procesar cada repositorio
for repo_name in repo_list:
    try:
        repo = g.get_repo(f"{user}/{repo_name.strip()}")
        
        # Recopilar datos del repositorio
        languages = repo.get_languages()
        
        repo_data = {
            "nombre": repo.name,
            "descripcion": repo.description,
            "url": repo.html_url,
            "lenguaje_principal": repo.language,
            "lenguajes": dict(languages),
            # "estrellas": repo.stargazers_count,
            # "forks": repo.forks_count,
            "tamaño_kb": repo.size,
            "creado": repo.created_at.isoformat(),
            "actualizado": repo.updated_at.isoformat(),
            "rama_default": repo.default_branch
        }
        
        repos_data.append(repo_data)
        
        print(f"Procesado: {repo.name}")
        
    except Exception as e:
        print(f"\nError al acceder al repositorio {repo_name.strip()}: {e}")

def export_to_json(filename="repos_data.json"):
    """Exporta los datos de repositorios a un archivo JSON"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(repos_data, f, indent=2, ensure_ascii=False)
        print(f"Datos exportados exitosamente a {filename}")
        return True
    except Exception as e:
        print(f"Error al exportar datos: {e}")
        return False

# Exportar datos después de procesarlos
export_to_json()

app = Flask(__name__)

@app.route('/api/repos')
def get_repos():
    """Endpoint para obtener datos de repositorios en formato JSON"""
    return jsonify(repos_data)

    

