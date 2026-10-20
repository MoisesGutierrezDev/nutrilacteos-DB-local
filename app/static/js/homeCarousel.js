document.addEventListener("DOMContentLoaded", function () {
    const imgElement = document.getElementById("carousel-img");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    if (!imgElement) return;

    const images = [
        imgElement.dataset.img1,
        imgElement.dataset.img2
    ];

    let currentIndex = 0;
    let autoSlideInterval;

    function updateImage(newIndex) {
        currentIndex = newIndex;
        imgElement.style.opacity = "0";
        
        setTimeout(() => {
            imgElement.src = images[currentIndex];
            imgElement.style.opacity = "1";
        }, 300);
    }

    function nextSlide() {
        let nextIndex = (currentIndex + 1) % images.length;
        updateImage(nextIndex);
        resetTimer();
    }

    function prevSlide() {
        let prevIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage(prevIndex);
        resetTimer();
    }

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    function startTimer() {
        autoSlideInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % images.length;
            updateImage(nextIndex);
        }, 5000);
    }

    function resetTimer() {
        clearInterval(autoSlideInterval);
        startTimer();
    }

    startTimer();
});