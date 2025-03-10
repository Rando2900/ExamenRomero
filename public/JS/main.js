document.addEventListener("DOMContentLoaded", async function () {
    const map = L.map('map').setView([36.7213, -4.4213], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const listaPuntos = document.getElementById('lista-puntos');

    // Iconos personalizados
    const icons = {
        Museo: L.icon({ iconUrl: '/icons/museum.png', iconSize: [40, 40] }),
        Monumento: L.icon({ iconUrl: '/icons/location.png', iconSize: [40, 40] }),
        Estudio: L.icon({ iconUrl: '/icons/studio.png', iconSize: [40, 40] })
    };

    // Obtener puntos de interés desde el servidor
    const response = await fetch('https://examenromero-sj3j.onrender.com/puntos');

    const puntos = await response.json();

    puntos.forEach(punto => {
        const icon = icons[punto.categoria] || icons['Monumento'];

        const marker = L.marker([punto.lat, punto.lng], { icon }).addTo(map);

        marker.on('click', () => {
            const imagen = punto.imagen ? `<img src="${punto.imagen}" alt="${punto.titulo}" style="width:100%; border-radius: 10px; margin-bottom: 10px;">` : '';
            const webLink = punto.web 
                ? `<a href="${punto.web}" target="_blank">Visitar sitio web</a>` 
                : 'No disponible';

            Swal.fire({
                title: punto.titulo,
                html: `
                    ${imagen}
                    <p>${punto.descripcion}</p>
                    <p><strong>Web:</strong> ${webLink}</p>
                `,
                icon: 'info'
            });
        });

        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = punto.titulo;
        listItem.addEventListener('click', () => map.setView([punto.lat, punto.lng], 15));
        listaPuntos.appendChild(listItem);
    });
});
