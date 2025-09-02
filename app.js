// Configuración
const CONFIG = {
  githubToken: process.env.GITHUB_TOKEN || '', // Token desde variable de entorno
  reposNames: process.env.REPO_NAMES || '',
  user: process.env.GITHUB_USER || '' // Usuario desde variable de entorno
};

const reposData = [];

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

async function main() {
  try {
    document.getElementById('github-data').innerHTML = '<p>Cargando datos de GitHub...</p>';
    await processRepositories();
    renderRepositories();
  } catch (error) {
    console.error('Error en la ejecución principal:', error);
    document.getElementById('github-data').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', main);
