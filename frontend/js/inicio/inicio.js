// ===============================
// INICIO.JS
// Funciones específicas de inicio.html
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    loopVideo("videoBodas", 1, 9);
    loopVideo("videoReuniones", 5, 13);
    loopVideo("videoCelebraciones", 5, 12);
    iniciarSecuenciaRestaurante();
});

// ===============================
// VIDEOS
// ===============================
function loopVideo(videoId, inicio, fin) {
    const video = document.getElementById(videoId);
    if (!video) return;

    video.addEventListener("loadedmetadata", () => video.currentTime = inicio);

    video.addEventListener("timeupdate", () => {
        if (video.currentTime >= fin) {
            video.currentTime = inicio;
        }
    });
}

function iniciarSecuenciaRestaurante() {
    const video = document.getElementById("videoRestaurante");
    if (!video) return;

    const videos = [
        "videos/chef_1.mp4",
        "videos/chef_2.mp4",
        "videos/chef_3.mp4",
        "videos/chef_4.mp4"
    ];

    let indice = 0;

    video.addEventListener("ended", () => {
        video.classList.add("fade-out");

        setTimeout(() => {
            indice = (indice + 1) % videos.length;
            video.src = videos[indice];
            video.play();
            video.classList.remove("fade-out");
        }, 800);
    });
}
