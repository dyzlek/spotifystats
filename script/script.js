fetch("data/data.json")
.then(response => response.json())
.then(tracks => {
  displayTopTracks(tracks);
  displayTopArtistsChart(tracks);
  displayGenreDistribution(tracks);
  displayTopAlbums(tracks);
});

function displayTopTracks(tracks) {
  const sortedTracks = [...tracks].sort((a, b) => b.popularity - a.popularity).slice(0, 50);
  const tbody = document.querySelector('#trackTable tbody');
  
  sortedTracks.forEach(track => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td data-label="Titre :">${track.name}</td>
      <td data-label="Artiste :">${track.artists.map(a => a.name).join(', ')}</td>
      <td data-label="Album :">${track.album.name}</td>
    `;

    const button = document.createElement("button");
    button.className = "btn btn-primary d-flex align-items-center justify-content-center";
    button.style.width = "78px";
    button.style.height = "31px";
    button.innerHTML = `<i class="bi bi-info-circle me-1" style="font-size: 14px;"></i><span>Détails</span>`;
    button.addEventListener("click", () => openPopup(track));

    const td = document.createElement("td");
    td.appendChild(button);
    row.appendChild(td);
    
    tbody.appendChild(row);
  });
}

function displayTopArtistsChart(tracks) {
  const artistCount = {};
  
  tracks.forEach(track => {
    track.artists.forEach(artist => {
      const name = artist.name;
      artistCount[name] = (artistCount[name] || 0) + 1;
    });
  });
  
  const sortedArtists = Object.entries(artistCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const labels = sortedArtists.map(entry => entry[0]);
  const values = sortedArtists.map(entry => entry[1]);
  const maxValue = Math.max(...values);
  
  new Chart(document.getElementById('artistChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Nombre de morceaux",
        data: values,
        backgroundColor: "#0D6EFD"
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          max: maxValue,
          beginAtZero: true,
          title: {
            display: true,
            text: "Nombre de morceaux",
            font: { size: 14 }
          }
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Top 10 des artistes (nombre de morceaux)",
          font: { size: 12, lineHeight: 1.1 },
          padding: { top: 10, bottom: 10 }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function displayGenreDistribution(tracks) {
  const genreCount = {};
  
  tracks.forEach(track => {
    track.artists.forEach(artist => {
      if (Array.isArray(artist.genres)) {
        artist.genres.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });
  });
  
  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  const topGenres = sortedGenres.slice(0, 7);
  const autresGenres = sortedGenres.slice(7);
  
  const genreLabels = topGenres.map(([genre]) => genre);
  const genreValues = topGenres.map(([, count]) => count);
  
  if (autresGenres.length > 0) {
    const autresCount = autresGenres.reduce((acc, [, count]) => acc + count, 0);
    genreLabels.push("Autres");
    genreValues.push(autresCount);
  }
  
  const backgroundColors = [
    "#ff91a9", "#72bef1", "#ffdd88", "#81d3d3",
    "#b794ff", "#ffbc79", "#6cdb9b", "#b5c0c1"
];
  
  new Chart(document.getElementById('genreChart'), {
    type: 'pie',
    data: {
      labels: genreLabels,
      datasets: [{
        data: genreValues,
        backgroundColor: backgroundColors
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Distribution des genres musicaux",
          font: { size: 12, lineHeight: 1.1 },
          padding: { top: 10, bottom: 10 }
        },
        legend: {
          position: 'right',
          labels: { boxWidth: 15, font: { size: 11 } }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

    const topAlbums = [];
const seenAlbumIds = new Set();

tracks.forEach(track => {
  const album = track.album;
  if (!seenAlbumIds.has(album.id)) {
    seenAlbumIds.add(album.id);

    // Récupérer uniquement le premier artiste de l'album (généralement l'artiste principal)
    const mainArtist = album.artists[0]?.name || "Artiste inconnu";

    topAlbums.push({
      id: album.id,
      name: album.name,
      image: album.images[0]?.url || "fallback.jpg",
      release_date: album.release_date,
      total_tracks: album.total_tracks,
      popularity: track.popularity,
      artist: mainArtist // Affichage de l'artiste principal seulement
    });
  }
});

const top12 = topAlbums.sort((a, b) => b.popularity - a.popularity).slice(0, 12);
const albumGrid = document.getElementById("popularAlbums");

top12.forEach(album => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card h-100 border-0 shadow-sm">
        <img src="${album.image}" class="card-img-top rounded-top" alt="Pochette de l'album ${album.name}">
        <div class="card-body d-flex flex-column">
          <p class="fs-6 fw-semibold mb-1 text-truncate" title="Cliquez pour en savoir plus sur l'album ${album.name}">${album.name}</p>
          
          <p class="fs-7 mb-1">${album.artist}</p> 
          
          <p class="mb-4 small text-muted">${album.release_date}</p>
  
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="badge bg-primary rounded-pill">${album.total_tracks} titres</span>
            <small class="badge text-bg-success">${album.popularity}/100</small>
          </div>
        </div>
      </div>
    `;
    albumGrid.appendChild(col);
  });  

})
// https://www.chartjs.org/docs/latest/

// Tri des morceaux du plus populaire au moins

function openPopup(track) {
    document.getElementById("popup-overlay").style.display = "flex";
    const album = track.album;
    const artists = track.artists;
    const albumArtists = album.artists.map(a => a.name).join(", ");
    
    const albumImg = album.images[0]?.url || "fallback.jpg";
    const altText = `Pochette de l'album "${album.name}" fait par ${albumArtists}`;
    
    document.getElementById("popup-album-img").src = albumImg;
    document.getElementById("popup-album-img").alt = altText;
    document.getElementById("popup-album-name").textContent = album.name;
    document.getElementById("popup-release-date").textContent = album.release_date;
    document.getElementById("popup-total-tracks").textContent = album.total_tracks;
    document.getElementById("popup-album-popularity").textContent = `${album.popularity}/100`;
    document.getElementById("popup-title").textContent = track.name;
    const durationMinSec = `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0")}`;
    document.getElementById("popup-duration").textContent = durationMinSec;
<<<<<<< HEAD
    const popularityCell = document.getElementById("popup-track-popularity");
popularityCell.innerHTML = `
  <div class="d-flex align-items-center">
    <div class="progress flex-grow-1 me-2" style="height: 15px; max-width: 120px;">
      <div class="progress-bar bg-info" role="progressbar" style="width: ${track.popularity}%;" aria-valuenow="${track.popularity}" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="fw-semibold text-nowrap">${track.popularity}/100</div>
  </div>
`;

=======
    document.getElementById("popup-track-popularity").textContent = `${track.popularity}/100`;
>>>>>>> parent of 81c48c0 (update popup n1)
    document.getElementById("popup-track-number").textContent = track.track_number;
    document.getElementById("popup-explicit").textContent = track.explicit ? "Oui" : "Non";
    
    const allGenres = [...new Set([
      ...(album.genres || []),
      ...artists.flatMap(a => a.genres || [])
    ])];
    
    // Vider les genres existants
    const genresContainer = document.getElementById("popup-genres");
    genresContainer.innerHTML = "";
  
  allGenres.forEach(genre => {
    const badge = document.createElement("span");
    badge.className = "badge bg-secondary rounded-pill me-2";
    badge.textContent = genre;
    genresContainer.appendChild(badge);
  });
  
  const audio = document.getElementById("popup-audio");
  audio.src = track.preview_url || "";
  audio.load();
  
  document.getElementById("popup-spotify-link").href = `https://open.spotify.com/track/${track.id}`;
  
  const artistContainer = document.getElementById("popup-artists");
  artistContainer.innerHTML = "";
  
  artists.forEach(artist => {
    const artistCard = document.createElement("div");
    artistCard.className = "d-flex align-items-center mb-2";
    
    artistCard.innerHTML = `
      <img src="${artist.images[0]?.url || "fallback.jpg"}" alt="Photo de ${artist.name}"
           class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
      <div>
        <div><strong>${artist.name}</strong></div>
        <div>Popularité : ${artist.popularity}/100 Followers : ${artist.followers.total.toLocaleString()}</div>
      </div>
    `;
    
    artistContainer.appendChild(artistCard);
  });
}

function closePopup() {
  const popup = document.getElementById("popup-overlay");
  popup.style.display = "none";
  
  const audio = document.getElementById("popup-audio");
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}