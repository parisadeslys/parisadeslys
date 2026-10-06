const slider = document.querySelector(".artwork-slider");

if (slider) {

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    slider.addEventListener("mousedown", (event) => {

        isDragging = true;

        slider.classList.add("is-dragging");

        startX = event.pageX;
        startScrollLeft = slider.scrollLeft;

    });


    slider.addEventListener("mousemove", (event) => {

        if (!isDragging) return;

        event.preventDefault();

        const movement = event.pageX - startX;

        slider.scrollLeft =
            startScrollLeft - movement;

    });


    const stopDragging = () => {

        if (!isDragging) return;

        isDragging = false;

        slider.classList.remove("is-dragging");

        const slides =
            slider.querySelectorAll(".artwork-slide");

        if (!slides.length) return;

        let closestSlide = slides[0];
        let smallestDistance = Infinity;

        slides.forEach((slide) => {

            const distance =
                Math.abs(slide.offsetLeft - slider.scrollLeft);

            if (distance < smallestDistance) {

                smallestDistance = distance;
                closestSlide = slide;

            }

        });

        slider.scrollTo({
            left: closestSlide.offsetLeft,
            behavior: "smooth"
        });

    };


    slider.addEventListener(
        "mouseup",
        stopDragging
    );

    slider.addEventListener(
        "mouseleave",
        stopDragging
    );


    slider.querySelectorAll("img").forEach((image) => {

        image.addEventListener(
            "dragstart",
            (event) => event.preventDefault()
        );

    });

}