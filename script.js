// ⚠️ YOUR API KEY — for development ONLY
const API_KEY = 'bd256f217a2047a88dbf345af8bbd753';

// CORS proxy (for development)
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// DOM Elements
const queryInput = document.getElementById('queryInput');
const searchBtn = document.getElementById('searchBtn');
const newsContainer = document.getElementById('newsContainer');
const messageEl = document.getElementById('message');

// Event listeners
searchBtn.addEventListener('click', fetchNews);
queryInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') fetchNews();
});

// Main news fetch function
async function fetchNews() {
  const query = queryInput.value.trim();
  showLoading();

  // Step 1: Unlock CORS Anywhere (required once per session/IP)
  try {
    await fetch(CORS_PROXY, { method: 'HEAD' });
  } catch (err) {
    showMessage(
      'CORS proxy inactive. Visit https://cors-anywhere.herokuapp.com/ and click "Request temporary access".',
      'error'
    );
    return;
  }

  // Step 2: Build API URL
  let url;
  if (query === '') {
    url = `${CORS_PROXY}https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
  } else {
    url = `${CORS_PROXY}https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=5&apiKey=${API_KEY}`;
  }

  // Step 3: Fetch news
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.articles?.length > 0) {
      displayNews(data.articles.slice(0, 5));
      showMessage(`News for: "${query || 'Top Headlines (US)'}"`, 'success');
    } else {
      displayNews([]);
      showMessage(data.message || 'No articles found.', 'error');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    showMessage('Failed to load news. Check console for details.', 'error');
  }
}

// Display articles
function displayNews(articles) {
  newsContainer.innerHTML = '';
  articles.forEach(article => {
    if (!article.title || !article.url) return;
    const el = document.createElement('div');
    el.className = 'news-item';
    el.innerHTML = `
      <h3>${escapeHtml(article.title)}</h3>
      <p>${article.description ? escapeHtml(article.description) : 'No description.'}</p>
      <a href="${article.url}" target="_blank" rel="noopener">Read more</a>
    `;
    newsContainer.appendChild(el);
  });
}

// Helpers
function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.classList.remove('hidden');
}

function showLoading() {
  newsContainer.innerHTML = '<p>Loading latest news...</p>';
  messageEl.classList.add('hidden');
}

function escapeHtml(str) {
  return str?.replace(/[&<>"']/g, tag => ({
    '&': '&amp;', '<': '<', '>': '>',
    '"': '&quot;', "'": '&#39;'
  }[tag])) || '';
}
