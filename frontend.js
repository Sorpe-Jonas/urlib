document.getElementById('urlForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('url').value;

    const response = await fetch('https://urlib.onrender.com/encurtar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
    });

    const data = await response.json();
    if (response.ok) {
        document.getElementById('result').innerText = `URL Encurtada: ${data.short_url}`;
    } else {
        document.getElementById('result').innerText = 'Erro ao encurtar a URL.';
    }
});
