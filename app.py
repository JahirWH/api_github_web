from flask import Flask, jsonify, request
import requests
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "API GitHub Web - Funcionando"})

@app.route('/github/user/<username>')
def get_github_user(username):
    try:
        url = f'https://api.github.com/users/{username}'
        response = requests.get(url)
        
        if response.status_code == 200:
            user_data = response.json()
            return jsonify({
                "status": "success",
                "data": {
                    "login": user_data.get("login"),
                    "name": user_data.get("name"),
                    "bio": user_data.get("bio"),
                    "public_repos": user_data.get("public_repos"),
                    "followers": user_data.get("followers"),
                    "following": user_data.get("following"),
                    "avatar_url": user_data.get("avatar_url"),
                    "created_at": user_data.get("created_at")
                }
            })
        else:
            return jsonify({"status": "error", "message": "Usuario no encontrado"}), 404
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/github/repos/<username>')
def get_github_repos(username):
    try:
        url = f'https://api.github.com/users/{username}/repos'
        response = requests.get(url)
        
        if response.status_code == 200:
            repos_data = response.json()
            repos_list = []
            
            for repo in repos_data:
                repos_list.append({
                    "name": repo.get("name"),
                    "description": repo.get("description"),
                    "language": repo.get("language"),
                    "stars": repo.get("stargazers_count"),
                    "forks": repo.get("forks_count"),
                    "url": repo.get("html_url"),
                    "created_at": repo.get("created_at"),
                    "updated_at": repo.get("updated_at")
                })
            
            return jsonify({
                "status": "success",
                "data": repos_list,
                "count": len(repos_list)
            })
        else:
            return jsonify({"status": "error", "message": "Usuario no encontrado"}), 404
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  
