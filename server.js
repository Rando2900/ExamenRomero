const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/icons', express.static(path.join(__dirname, 'public', 'icons')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));



// Cargar datos desde los archivos GeoJSON
const museos = JSON.parse(fs.readFileSync(path.join(__dirname, 'da_cultura_ocio_museos-25830.geojson'), 'utf8'));
const monumentos = JSON.parse(fs.readFileSync(path.join(__dirname, 'da_cultura_ocio_monumentos-4326.geojson'), 'utf8'));

// Unificar los datos en un solo array con sus respectivas imágenes
const puntosDeInteres = [
    ...museos.features.map(feature => ({
        titulo: feature.properties.NOMBRE,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        descripcion: feature.properties.DESCRIPCION || "Sin descripción",
        web: feature.properties.URL || null,
        imagen: "/icons/museum.png",
        categoria: "Museo"
    })),
    ...monumentos.features.map(feature => ({
        titulo: feature.properties.NOMBRE,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        descripcion: feature.properties.DESCRIPCION || "Sin descripción",
        web: feature.properties.URL || null,
        imagen: "/icons/location.png",
        categoria: "Monumento"
    }))
];

// Endpoint para obtener puntos de interés
app.get('/puntos', (req, res) => {
    res.json(puntosDeInteres);
});

// Servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
