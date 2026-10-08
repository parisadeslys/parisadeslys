
const slider = document.querySelector(".artwork-slider");

if (slider) {
    const slides = Array.from(
        slider.querySelectorAll(".artwork-slide")
    );

    const previousButton = document.querySelector(
        ".slider-arrow-prev"
    );

    const nextButton = document.querySelector(
        ".slider-arrow-next"
    );

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    function getSlidePosition(index) {
        return slides[index].offsetLeft - slides[0].offsetLeft;
    }

    function getCurrentIndex() {
        let closestIndex = 0;
        let smallestDistance = Infinity;

        slides.forEach((slide, index) => {
            const distance = Math.abs(
                getSlidePosition(index) - slider.scrollLeft
            );

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    }

    function positionArrows() {
        const currentSlide = slides[getCurrentIndex()];
        const image = currentSlide?.querySelector("img");

        if (!image || !previousButton || !nextButton) return;

        const container = slider.parentElement;
        const containerRect = container.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();

        const imageLeft = imageRect.left - containerRect.left;
        const imageRight = imageRect.right - containerRect.left;

        const imageCenterY =
            imageRect.top - containerRect.top +
            imageRect.height / 2;

        const gap = window.innerWidth <= 700 ? 5 : 12;

        const previousWidth = previousButton.offsetWidth;
        const nextWidth = nextButton.offsetWidth;

        const previousLeft = Math.max(
            0,
            imageLeft - previousWidth - gap
        );

        const nextLeft = Math.min(
            containerRect.width - nextWidth,
            imageRight + gap
        );

        previousButton.style.left = `${previousLeft}px`;
        nextButton.style.left = `${nextLeft}px`;

        nextButton.style.right = "auto";

        previousButton.style.top = `${imageCenterY}px`;
        nextButton.style.top = `${imageCenterY}px`;
    }

    function updateArrows() {
        const currentIndex = getCurrentIndex();

        if (previousButton) {
            previousButton.disabled = currentIndex === 0;
        }

        if (nextButton) {
            nextButton.disabled =
                currentIndex === slides.length - 1;
        }

        positionArrows();
    }

    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;

        slider.scrollTo({
            left: getSlidePosition(index),
            behavior: "smooth"
        });
    }

    if (previousButton) {
        previousButton.addEventListener("click", () => {
            goToSlide(getCurrentIndex() - 1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            goToSlide(getCurrentIndex() + 1);
        });
    }

    slider.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;

        isDragging = true;
        slider.classList.add("is-dragging");

        startX = event.pageX;
        startScrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mousemove", (event) => {
        if (!isDragging) return;

        event.preventDefault();

        const movement = event.pageX - startX;
        slider.scrollLeft = startScrollLeft - movement;
    });

    function stopDragging() {
        if (!isDragging) return;

        isDragging = false;
        slider.classList.remove("is-dragging");

        goToSlide(getCurrentIndex());
    }

    slider.addEventListener("mouseup", stopDragging);
    slider.addEventListener("mouseleave", stopDragging);

    slider.addEventListener("scroll", updateArrows, {
        passive: true
    });

    slider.querySelectorAll("img").forEach((image) => {
        image.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });

        if (!image.complete) {
            image.addEventListener("load", positionArrows);
        }
    });

    window.addEventListener("resize", positionArrows);

    updateArrows();
}
