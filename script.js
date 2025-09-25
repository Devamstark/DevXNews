async function getNews() {
  const query = document.getElementById('searchInput').value.trim();
  const apiKey = bd256f217a2047a88dbf345af8bbd753 ; // ⛔ Replace this with your actual key from https://newsapi.org

  let url = '';

  if (query) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=5&apiKey=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '';

    if (data.articles && data.articles.length > 0) {
      data.articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
          <h3>${article.title}</h3>
          <p>${article.description || 'No description available'}</p>
          <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(newsItem);
      });
    } else {
      newsContainer.innerHTML = '<p>No news found.</p>';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('newsContainer').innerHTML = '<p>Error loading news.</p>';
  }
}
