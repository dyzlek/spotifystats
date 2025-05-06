fetch("data/data.json")
// Il permet de récupérer un fichier distant

.then(response => response.json())
// https://reqbin.com/code/javascript/wc3qbk0b/javascript-fetch-json-example

.then(tracks =>{
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
        // Créer un graphique en camembert (miam)

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
                        size: 18
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                legend: {
                    position: 'right'
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

})
// https://www.chartjs.org/docs/latest/