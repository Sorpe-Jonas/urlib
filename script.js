document.addEventListener("DOMContentLoaded", function() {
    const adIds = ['ad1', 'ad2', 'ad3', 'ad4'];

    // Função que carrega os anúncios da API
    function loadAds() {
        // Substitua esta URL com a API de anúncios que você for usar
        const apiUrl = "https://api.exemplo.com/ads";

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Supondo que a resposta da API seja uma lista de URLs de anúncios
                for (let i = 0; i < adIds.length; i++) {
                    const adElement = document.getElementById(adIds[i]);
                    const adData = data[i];

                    if (adData) {
                        adElement.innerHTML = `<a href="${adData.url}" target="_blank"><img src="${adData.image}" alt="Anúncio"></a>`;
                    } else {
                        adElement.innerHTML = "Anúncio indisponível";
                    }
                }
            })
            .catch(error => {
                console.error("Erro ao carregar os anúncios:", error);
            });
    }

    // Carregar os anúncios ao abrir a página
    loadAds();
});
