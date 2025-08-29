import os
from github import Github
# Solo para repos públicos, con límites de rate
g = Github()
repo = g.get_repo("JahirWH/Parrilla_amarilla")

print(f"Nombre: {repo.name}")
print(f"Descripción: {repo.description}")
print(f"URL: {repo.html_url}")
print(f"Lenguaje: {repo.language}")
print(f"Estrellas: {repo.stargazers_count}")
print(f"Forks: {repo.forks_count}")
print(f"Tamaño: {repo.size} KB")
print(f"Creado: {repo.created_at}")
print(f"Actualizado: {repo.updated_at}")
print(f"Rama default: {repo.default_branch}")
print(f"¿Es fork?: {repo.fork}")
print(f"¿Es privado?: {repo.private}")