async function encurtarUrl() {
    const urlInput = document.getElementById('urlInput').value;
    const resultDiv = document.getElementById('result');
    
    // Limpar resultado anterior
    resultDiv.innerHTML = '';

    if (urlInput === '') {
        resultDiv.innerHTML = 'Por favor, insira uma URL válida.';
        return;
    }

    try {
        // Enviar a URL para o servidor backend para encurtar
        const response = await fetch('http://localhost:3000/encurtar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: urlInput })
        });

        const data = await response.json();

        if (data.shortenedUrl) {
            // Mostrar a URL encurtada
            resultDiv.innerHTML = `Sua URL encurtada é: <a href="${data.shortenedUrl}" target="_blank">${data.shortenedUrl}</a>`;
        } else {
            resultDiv.innerHTML = 'Erro ao encurtar a URL.';
        }
    } catch (error) {
        resultDiv.innerHTML = 'Erro ao conectar ao servidor. Tente novamente mais tarde.';
        console.error(error);
    }
}
