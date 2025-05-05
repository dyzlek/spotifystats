fetch("data/data.json")
// Il permet de récupérer un fichier distant

.then(response => response.json())
// https://reqbin.com/code/javascript/wc3qbk0b/javascript-fetch-json-example

.then(tracks =>{
// Tableau d'objets

    const artistCount = {};
    // Objet pour stocjker le nombre de morceau de chaque artist

    tracks.forEach(track =>{
        track.artists.forEach(artist => {
            const name = artist.name;
            artistCount[name] = (artistCount[name] || 0) + 1;
        });
    });
    // Chaque morceau peut avoir plusieur artists (feat par exemple), il ne faut pas les oubliers
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

    const sortedArtists = Object.entries(artistCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    // On trie les artistes (de celui qui a plus de morceau en premier...) puis on garde les dix premiers
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

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

            plugins:{
            legend:{ display: false },
            title:{
                display: true,
                text: "Top 10 des artistes (nombre de morceaux)",
                font:{
                    size: 18
                },
                padding:{
                    top: 10,
                    bottom: 10
                }
            }
            },

            responsive: true,
            maintainAspectRatio: false
        }
    });
})

// https://www.chartjs.org/docs/latest/