# api_github_web

Esta herramienta te permite obtener una lista de nombres y datos básicos de los repositorios de GitHub que especifiques. Puedes usar esta información en tu web con React, Node, etc.

## ¿Cómo usarlo?

1. **Configura tu archivo `.env`:**  
   Escribe tus propios datos en el archivo `.env`. Necesitarás generar un token en GitHub para aumentar el límite de solicitudes.

2. **Obtén los datos:**  
   Los datos se guardan en un archivo JSON. Puedes usar este archivo directamente en tu frontend haciendo peticiones HTTP al JSON alojado online, sin necesidad de un backend.

3. **Uso con backend:**  
   Si prefieres usar un backend (por ejemplo, en Python), el proceso es el mismo.

## Ejecución

```bash
node app.js
```

```bash
python3 app.py
```

## Dependencias

- npm install express dotenv node-fetch
- npm install nodemon --save-dev
