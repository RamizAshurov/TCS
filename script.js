window.addEventListener("DOMContentLoaded", () => {
    const sliderWrapper = document.querySelector(".gallery__slider-wrapper");
    const slides = document.querySelectorAll(".gallery__slider-slide");
    const currentSlide = document.querySelector(".gallery__slider-pagination .number");
    
    const tabPanelBody = document.querySelector(".tab-panel__body");

    let sliderLock = false;

    function changeSlide(direction = 1) {
        if (sliderLock) 
            return 

        sliderLock = true; 
        let slidesAmount = slides.length;
        if (direction == 1) {
            if (+currentSlide.innerHTML < slidesAmount) {
                sliderWrapper.style.transform = `translate3d(${+currentSlide.innerHTML * (-direction) * sliderWrapper.offsetWidth}px, 0, 0)`
                currentSlide.innerHTML = +currentSlide.innerHTML + 1;
            } else {
                sliderWrapper.style.transitionDuration = '0.3s';
                sliderWrapper.style.transform = `translate3d(0, 0, 0)`;
                currentSlide.innerHTML = 1;

                sliderWrapper.addEventListener("transitionend", () => {
                    sliderWrapper.style = ""
                }, { once: true })
            }
        } else {
            if (+currentSlide.innerHTML > 1) {
                sliderWrapper.style.transform = `translate3d(${(+currentSlide.innerHTML - 2) * direction * sliderWrapper.offsetWidth}px, 0, 0)`
                currentSlide.innerHTML = +currentSlide.innerHTML - 1;
            } else {
                console.log("!")
                sliderWrapper.style.transitionDuration = '0.3s';
                sliderWrapper.style.transform = `translate3d(${-1 * (slidesAmount - 1) * sliderWrapper.offsetWidth}px , 0, 0)`;
                currentSlide.innerHTML = slidesAmount;
                sliderWrapper.addEventListener("transitionend", () => {
                    sliderWrapper.style.transitionDuration = ""
                }, { once: true })
            }
        }

        sliderWrapper.addEventListener("transitionend", () => sliderLock = false)

    }

    function closePopup(popup) {
        popup.classList.remove("popup_open");
        popup.addEventListener("transitionend", () => {
            document.body.classList.remove("_lock");
        }, { once: true })
    }

    function openPopup(popup) {
        document.body.classList.add("_lock");
        popup.classList.add("popup_open");

    }

    // переключатели слайдов
    document.querySelector(".gallery__slider-button_next").addEventListener("click", () => changeSlide())
    document.querySelector(".gallery__slider-button_prev").addEventListener("click", () => changeSlide(-1))
    
    window.addEventListener("resize", () => {
        // подстраиваем смещение под ширину экрана
        sliderWrapper.style.transform = `translate3d(${-(+currentSlide.innerHTML - 1) * sliderWrapper.offsetWidth}px, 0, 0)`
    });

    // Табы
    document.querySelectorAll(".tab-panel__button").forEach(tabButton => {
        tabButton.addEventListener("click", (e) => {
            const currentTabButton = e.target;
            document.querySelector(".tab-panel__button_active").classList.remove("tab-panel__button_active");
            currentTabButton.classList.add("tab-panel__button_active");
            tabPanelBody.style.opacity = 0;
            tabPanelBody.addEventListener("transitionend", () => {
                tabPanelBody.querySelector(".tab-panel__content_active").classList.remove("tab-panel__content_active");
                tabPanelBody.querySelector(`.tab-panel__content_${currentTabButton.dataset.tabContent}`).classList.add("tab-panel__content_active");
                tabPanelBody.style.opacity = 1
            }, { once: true })

        })
    })

    // Выбор изображения
    document.addEventListener("click", e => {
        if (e.target.classList.contains("tab-panel__image")) {
            if (tabPanelBody.querySelector(".tab-panel__image_active")) {
                tabPanelBody.querySelector(".tab-panel__image_active").classList.remove("tab-panel__image_active");
            }
            e.target.classList.add("tab-panel__image_active")
        }
    })

    // Смена изображения в слайдере
    document.querySelector(".tab-panel__content-button_select").addEventListener("click", e => {
        if (!tabPanelBody.querySelector(".tab-panel__image_active")) {
            return
        }
        let slideIndex = +currentSlide.innerHTML - 1;
        let targetImageSrc = tabPanelBody.querySelector(".tab-panel__image_active").getAttribute("src");
        slides[+slideIndex].firstElementChild.setAttribute("src", targetImageSrc);
    })

    // очистка изображений
    document.querySelector(".tab-panel__content-button_delete").addEventListener("click", e => {
        document.querySelectorAll(".tab-panel__image").forEach(tabImage => tabImage.remove())
    })
    // попап
    document.querySelector(".popup").addEventListener("click", (e) => {
        const targetEl = e.target;
        if (targetEl.closest(".popup__close") || targetEl.classList.contains("popup__container")) {
            closePopup(document.querySelector(".popup_open"))
        }
    })

    document.querySelector(".header__cart").addEventListener("click", () => {
        openPopup(document.querySelector(".popup"))
    })

    // добавление картинки

    document.querySelector(".tab-panel__input").addEventListener("change", (e) => {
        
        const file = e.target.files[0];
        if (!["image/jpeg", "image/gif", "image/png", "image/jpg", "image/gif"].includes(file.type)) {
            alert("Разрешены только изображения!");
            return
        }

        const imageEl = document.createElement("img");
        imageEl.className = "tab-panel__image"
        imageEl.src = `images/${file.name}`;
        document.querySelector(".tab-panel__content_gallery .tab-panel__content-body").append(imageEl)
    })
})