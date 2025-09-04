import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Configurar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

// Configuración
const CONFIG = {
  githubToken: process.env.GITHUB_TOKEN , // Token desde variable de entorno
  reposNames: process.env.REPO_NAMES ,
  user: process.env.GITHUB_USER  // Usuario desde variable de entorno
};

const reposData = [];

// Servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

// Configurar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

async function fetchGitHubAPI(url) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${CONFIG.githubToken}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

async function processRepositories() {
  const repoList = CONFIG.reposNames.split(',');
  
  for (const repoName of repoList) {
    try {
      const repo = await fetchGitHubAPI(`https://api.github.com/repos/${CONFIG.user}/${repoName.trim()}`);
      const languages = await fetchGitHubAPI(`https://api.github.com/repos/${CONFIG.user}/${repoName.trim()}/languages`);

      const repoData = {
        nombre: repo.name,
        descripcion: repo.description,
        url: repo.html_url,
        lenguaje_principal: repo.language,
        lenguajes: languages,
        tamaño_kb: repo.size,
        creado: repo.created_at,
        actualizado: repo.updated_at,
        rama_default: repo.default_branch,
      };

      reposData.push(repoData);
      console.log(`Repositorio ${repoName.trim()} procesado correctamente`);
      
    } catch (error) {
      console.error(`Error al acceder al repositorio ${repoName.trim()}: ${error.message}`);
    }
  }
}

function renderRepositories() {
  const container = document.getElementById('github-data');
  
  if (reposData.length === 0) {
    container.innerHTML = '<p>No se encontraron datos de repositorios.</p>';
    return;
  }

  let html = '<div class="repos-container">';
  
  reposData.forEach(repo => {
    html += `
      <div class="repo-card">
        <h3><a href="${repo.url}" target="_blank">${repo.nombre}</a></h3>
        <p><strong>Descripción:</strong> ${repo.descripcion || 'Sin descripción'}</p>
        <p><strong>Lenguaje principal:</strong> ${repo.lenguaje_principal || 'No especificado'}</p>
        <p><strong>Tamaño:</strong> ${repo.tamaño_kb} KB</p>
        <p><strong>Creado:</strong> ${new Date(repo.creado).toLocaleDateString()}</p>
        <p><strong>Actualizado:</strong> ${new Date(repo.actualizado).toLocaleDateString()}</p>
        <p><strong>Rama por defecto:</strong> ${repo.rama_default}</p>
        <details>
          <summary>Lenguajes utilizados</summary>
          <ul>
            ${Object.entries(repo.lenguajes).map(([lang, bytes]) => 
              `<li>${lang}: ${bytes} bytes</li>`
            ).join('')}
          </ul>
        </details>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// Ruta para obtener los datos de los repositorios
app.get('/api/repos', async (req, res) => {
  try {
    // Intentar leer el archivo cache.json
    try {
      const cache = await fs.readFile('cache.json', 'utf8');
      const data = JSON.parse(cache);
      // Si el cache existe y tiene menos de 1 hora, usarlo
      if (data.timestamp && (Date.now() - data.timestamp) < 3600000) {
        return res.json(data.repos);
      }
    } catch (err) {
      console.log('No hay cache o está expirado');
    }

    // Si no hay cache o está expirado, obtener datos nuevos
    await processRepositories();
    
    // Guardar en cache
    await fs.writeFile('cache.json', JSON.stringify({
      timestamp: Date.now(),
      repos: reposData
    }), 'utf8');

    res.json(reposData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener los datos de GitHub' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
