# 🎮 Gamer Forever

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-Backend-43853D?logo=node.js)
![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100_Performance-success)

## 📋 Descripción

**Gamer Forever** es una aplicación web Full-Stack diseñada para ser el directorio definitivo de videojuegos. Desarrollada consumiendo la inmensa base de datos de la **API de RAWG**, este proyecto no solo es un catálogo visualmente atractivo, sino una demostración técnica de **optimización web extrema**.

El objetivo principal fue resolver los cuellos de botella clásicos de las aplicaciones ricas en multimedia. Se implementó una arquitectura orientada al rendimiento que logra una calificación perfecta de **100/100 en Google Lighthouse** (Performance, Best Practices y SEO), manejando recortes dinámicos de imágenes, hidratación asíncrona y mitigación de latencia del servidor.

## ✨ Características Principales

### ⚡ Frontend (Experiencia y Rendimiento)
* **Optimización de Core Web Vitals:** Implementación de atributos `srcSet` y `sizes` para servir imágenes responsivas al milímetro, erradicando el *Cumulative Layout Shift (CLS)* y optimizando el *Largest Contentful Paint (LCP)*.
* **Scroll Infinito & Paginación:** Carga de datos fluida utilizando `useInfiniteQuery` y la API de `IntersectionObserver`.
* **Buscador Inteligente:** Sistema de búsqueda en tiempo real protegido con *Debounce* para evitar la saturación de peticiones a la API mientras el usuario teclea.
* **Diseño Elástico:** Interfaz construida con **Tailwind CSS**, adaptándose perfectamente desde pantallas móviles hasta monitores 4K.

### ⚙️ Backend (Caché y Seguridad)
* **API Proxy en Express:** El cliente nunca se comunica directamente con RAWG, protegiendo las credenciales (API Keys) en el servidor.
* **Caché en Memoria (Node-Cache):** Las respuestas lentas de la API externa (de hasta 12,000ms) son cacheadas en el servidor, reduciendo el tiempo de respuesta a **~2ms** en peticiones recurrentes.
* **Seguridad y CORS:** Configuración estricta de orígenes permitidos para aislar los entornos de desarrollo y producción.

## 🛠️ Tecnologías Utilizadas

**Frontend:**
* [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [TanStack React Query v5](https://tanstack.com/query/latest) (Estado asíncrono)
* [Zustand](https://zustand-demo.pmnd.rs/) (Estado global)
* [React Router DOM](https://reactrouter.com/)
* [Lucide React](https://lucide.dev/) (Iconografía optimizada)

**Backend:**
* [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
* [Axios](https://axios-http.com/)
* [Node-Cache](https://github.com/node-cache/node-cache)
* [Helmet](https://helmetjs.github.io/) & [Morgan](https://github.com/expressjs/morgan)

## 🚀 Guía de Instalación Local

Sigue estos pasos para desplegar el proyecto en tu máquina:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/JoshuaFreelancer/gamer-forever.git](https://github.com/JoshuaFreelancer/gamer-forever.git)
    ```

2.  **Instala las dependencias:**
    
    *Backend:*
    ```bash
    cd backend
    npm install
    ```
    
    *Frontend:*
    ```bash
    cd frontend
    npm install
    ```

3.  **Configura las Variables de Entorno (.env):**
    Debes crear un archivo `.env` en la carpeta `backend` con las siguientes claves:

    ```env
    PORT=5000
    NODE_ENV=development

    # Credenciales de RAWG
    RAWG_API_KEY=tu_clave_de_rawg_aqui
    RAWG_BASE_URL=[https://api.rawg.io/api](https://api.rawg.io/api)

    # Orígenes permitidos (CORS) para seguridad
    FRONTEND_URL_DEV=http://localhost:5173
    FRONTEND_URL_PREVIEW=http://localhost:4173
    FRONTEND_URL_PROD=[https://tu-dominio-en-firebase.com](https://tu-dominio-en-firebase.com)
    ```
    
    Y en la carpeta `frontend` crea otro `.env`:
    
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

4.  **Ejecutar el Proyecto:**
    Abre dos terminales en la raíz de tu proyecto:

    ```bash
    # Terminal 1 (Backend)
    cd backend
    npm run dev
    
    # Terminal 2 (Frontend)
    cd frontend
    npm run dev
    ```

## 🔐 Auth y Reseñas (Estado Actual)

El proyecto ya incluye:

* **Autenticación con Firebase Auth** (registro, login, perfil y rutas protegidas).
* **Reseñas por juego con Firestore** (crear, editar y eliminar reseña propia; lectura pública).
* **Reglas e índices de Firestore** configurados en `Frontend/firestore.rules` y `Frontend/firestore.indexes.json`.

### Despliegue recomendado de Firestore

Desde la raíz:

```bash
npm run firebase:deploy:firestore
```

Desde `Frontend/` también puedes usar:

```bash
npm run firebase:deploy:firestore
```

## 👤 Autor

**Joshua Freelancer**
* GitHub: [@JoshuaFreelancer](https://github.com/JoshuaFreelancer)
* Portafolio: [https://joshuafreelancer.github.io/](https://joshuafreelancer.github.io/)

## 🔮 Futuras Mejoras

* **Colecciones Personalizadas:** Capacidad para que los usuarios guarden juegos en listas como "Jugando", "Completados" o "Lista de Deseos".
* **Modo Claro/Oscuro:** Toggle de temas utilizando las capacidades nativas de Tailwind CSS.

---
*Desarrollado con ❤️ y mucho código desde Venezuela.*
