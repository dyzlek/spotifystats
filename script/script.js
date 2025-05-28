fetch("data/data.json")
// Il permet de récupérer un fichier distant

.then(response => response.json())
// https://reqbin.com/code/javascript/wc3qbk0b/javascript-fetch-json-example

.then(tracks =>{

    const sortedTracks = [...tracks].sort((a, b) => b.popularity - a.popularity).slice(0, 50);

const tbody = document.querySelector('#trackTable tbody');

sortedTracks.forEach(track => {
    const row = document.createElement('tr');
  
    const titre = `<td data-label="Titre :">${track.name}</td>`;
    const artiste = `<td data-label="Artiste :">${track.artists.map(a => a.name).join(', ')}</td>`;
    const album = `<td data-label="Album :">${track.album.name}</td>`;
    row.innerHTML = titre + artiste + album;

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

// Tableau d'objets

    const artistCount = {};
    // Objet pour stocker le nombre de morceau de chaque artiste

    tracks.forEach(track =>{
        track.artists.forEach(artist => {
            const name = artist.name;
            artistCount[name] = (artistCount[name] || 0) + 1;
        });
    });
    // Chaque morceau peut avoir plusieurs artistes (feat par exemple), il ne faut pas les oublier
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

    const sortedArtists = Object.entries(artistCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    // On trie les artistes (de celui qui a le plus de morceaux en premier...) puis on garde les dix premiers
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

    const labels = sortedArtists.map(entry => entry[0]);
    const values = sortedArtists.map(entry => entry[1]);
    const maxValue = Math.max(...values);

    new Chart(document.getElementById('artistChart'),{
        type: 'bar',
        // Créer un graphique en barre

        data:{
            labels: labels,
            datasets: [{
                label: "Nombre de morceaux",
                data: values,
                backgroundColor: "#0D6EFD"
            }]
        },
        // Données du graphique

        options:{
            indexAxis: 'y',

            scales:{
                x:{
                    max: maxValue,
                    beginAtZero: true,
                    title:{
                        display: true,
                        text: "Nombre de morceaux",
                        font:{
                            size: 14
                        }
                    }
                }
            },

            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Top 10 des artistes (nombre de morceaux)",
                    font: {
                        size: 12,
                        lineHeight: 1.1
                    }, 
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },

                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    autoPadding: true
                }
            },

            responsive: true,
            maintainAspectRatio: false
        }
    });


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
    const topGenres = sortedGenres.slice(0, 7); // Top 7 (doc seven)
    const autresGenres = sortedGenres.slice(7); // Les autres seront groupés (rip)

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
    // Couleurs du camembert (en mode rbg)

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
                    font: {
                        size: 12,
                        lineHeight: 1.1
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        font: {
                            size: 11
                        }
                    }
                },
                responsive: true,
                layout: {
                    autoPadding: true
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    const topAlbums = [];
const seenAlbumIds = new Set();

tracks.forEach(track => {
  const album = track.album;
  if (!seenAlbumIds.has(album.id)) {
    seenAlbumIds.add(album.id);

    const mainArtist = album.artists[0]?.name || "Artiste inconnu";

    topAlbums.push({
      id: album.id,
      name: album.name,
      image: album.images[0]?.url || "fallback.jpg",
      release_date: album.release_date,
      total_tracks: album.total_tracks,
      popularity: track.popularity,
      artist: mainArtist 
    });
  }
});

const top12 = topAlbums.sort((a, b) => b.popularity - a.popularity).slice(0, 12);
const albumGrid = document.getElementById("popularAlbums");

top12.forEach(album => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
  <a href="https://open.spotify.com/album/${album.id}" target="_blank" class="text-decoration-none text-dark">
    <div class="card h-100 border-0 shadow-sm">
      <div class="overflow-hidden">
        <img src="${album.image}" class="card-img-top rounded-top img-fluid transition transform-hover" alt="Pochette de l'album ${album.name}">
      </div>
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
  </a>
`;
    albumGrid.appendChild(col);
  });  

})

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
    const popularityCell = document.getElementById("popup-track-popularity");
popularityCell.innerHTML = `
  <div class="d-flex align-items-center">
    <div class="progress flex-grow-1 me-2" style="height: 15px; max-width: 120px;">
      <div class="progress-bar bg-info" role="progressbar" style="width: ${track.popularity}%;" aria-valuenow="${track.popularity}" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="fw-semibold text-nowrap">${track.popularity}/100</div>
  </div>
`;

    document.getElementById("popup-track-number").textContent = track.track_number;
    document.getElementById("popup-explicit").textContent = track.explicit ? "Oui" : "Non";
    
    const allGenres = [...new Set([
      ...(album.genres || []),
      ...artists.flatMap(a => a.genres || [])
    ])];
    
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
      const artistContainer = document.getElementById("popup-artists");
artistContainer.innerHTML = "";

artists.forEach(artist => {
  const artistCard = document.createElement("div");
  artistCard.className = "d-flex align-items-center mb-3";

  const artistLink = document.createElement("a");
  artistLink.href = `https://open.spotify.com/artist/${artist.id}`;
  artistLink.target = "_blank";
  artistLink.className = "d-inline-block me-3";
  artistLink.style.width = "60px";
  artistLink.style.height = "60px";
  artistLink.style.flexShrink = "0";

  const img = document.createElement("img");
  img.src = artist.images[0]?.url || "fallback.jpg";
  img.alt = `Photo de ${artist.name}`;
  img.className = "img-fluid artist-img-hover";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";

  artistLink.appendChild(img);

  const info = document.createElement("div");
  info.innerHTML = `
    <div><strong>${artist.name}</strong></div>
    <div class="text-muted small">Popularité : ${artist.popularity}/100 | Followers : ${artist.followers.total.toLocaleString()}</div>
  `;

  artistCard.appendChild(artistLink);
  artistCard.appendChild(info);
  artistContainer.appendChild(artistCard);
});

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
  
  console.log("Hello World");