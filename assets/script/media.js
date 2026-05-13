const h2Elements = document.querySelectorAll('.title__second');

function combineHeadings() {
    if (h2Elements.length >= 2) {
        const firstH2 = h2Elements[0];
        const secondH2 = h2Elements[1];

        const firstH2OriginalContent = firstH2.dataset.originalContent || firstH2.innerHTML;
        const secondH2OriginalContent = secondH2.dataset.originalContent || secondH2.innerHTML;

        firstH2.dataset.originalContent = firstH2OriginalContent;
        secondH2.dataset.originalContent = secondH2OriginalContent;

        if (window.innerWidth >= 768) {
            firstH2.innerHTML = firstH2OriginalContent + ' ' + secondH2OriginalContent;

            secondH2.style.display = 'none';
        } else {
            firstH2.innerHTML = firstH2OriginalContent;
            secondH2.innerHTML = secondH2OriginalContent;

            secondH2.style.display = '';
        }
    }
}

combineHeadings();
window.addEventListener('resize', combineHeadings);

document.addEventListener('DOMContentLoaded', function () {
    const tournamentItems = document.querySelectorAll('.tournament-section__item');
    const secondBlock = document.querySelector('.tournament-section__item.mob');

    if (tournamentItems.length >= 3 && secondBlock) {
        const thirdBlock = tournamentItems[2];

        const wrapper = document.createElement('div');
        wrapper.classList.add('additional-wrapper');

        wrapper.appendChild(thirdBlock);

        secondBlock.appendChild(wrapper);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const supportText = document.querySelector('.support-text');

    const descriptionBlock = document.querySelector('.tournament-section__item_description');

    if (supportText && descriptionBlock) {
        descriptionBlock.appendChild(supportText);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const timelineSection = document.querySelector('.timeline-section');

    if (timelineSection) {
        const h1Element = timelineSection.querySelector('.title__first');
        let pElement = timelineSection.querySelector('.timeline-section__description');

        const pHTML = pElement ? pElement.outerHTML : '';

        function updateHeader() {
            if (h1Element) {
                if (window.innerWidth >= 768) {
                    if (!h1Element.querySelector('span.timeline-section__description')) {
                        if (pElement) {
                            const spanElement = document.createElement('span');
                            spanElement.className = pElement.className; // Копируем классы из <p>
                            spanElement.innerHTML = pElement.innerHTML; // Копируем содержимое из <p>

                            h1Element.appendChild(spanElement);

                            pElement.parentNode.removeChild(pElement);
                        }
                    }
                } else {
                    if (!timelineSection.querySelector('.timeline-section__description')) {
                        const spanElement = h1Element.querySelector('span.timeline-section__description');
                        if (spanElement) {
                            spanElement.parentNode.removeChild(spanElement);
                        }

                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = pHTML;
                        pElement = tempDiv.firstChild;

                        h1Element.parentNode.insertBefore(pElement, h1Element.nextSibling);
                    }
                }
            }
        }

        updateHeader();

        window.addEventListener('resize', updateHeader);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const timelineSection = document.querySelector('.timeline-section');

    if (!timelineSection) return;

    const sliderContainer = timelineSection.querySelector('.slider__container');
    const sliderItems = Array.from(sliderContainer.querySelectorAll('.slider__item'));

    const originalSliderHTML = sliderItems.map(item => item.outerHTML).join('');

    let transformed = false;

    function transformSlider() {
        if (window.innerWidth >= 768 && !transformed) {
            transformed = true;

            const allLists = sliderContainer.querySelectorAll('.timeline__list');

            const newSliderItem = document.createElement('article');
            newSliderItem.classList.add('slider__item');

            const wrapper = document.createElement('div');
            wrapper.classList.add('combined-wrapper');

            allLists.forEach(list => {
                wrapper.appendChild(list);
            });

            newSliderItem.appendChild(wrapper);

            sliderContainer.innerHTML = '';
            sliderContainer.appendChild(newSliderItem);

            const sliderController = timelineSection.querySelector('.slider-controller');
            if (sliderController) {
                sliderController.style.display = 'none';
            }
        }
        else if (window.innerWidth < 768 && transformed) {
            transformed = false;

            sliderContainer.innerHTML = originalSliderHTML;

            const sliderController = timelineSection.querySelector('.slider-controller');
            if (sliderController) {
                sliderController.style.display = '';
            }
        }
    }

    transformSlider();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(transformSlider, 150);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    function rearrangeCarouselController() {
        if (window.innerWidth >= 768) {
            const participantsSection = document.querySelector('.participants');

            if (participantsSection) {
                const container = participantsSection.querySelector('.container');
                const title = container.querySelector('.title__first');
                const carouselController = container.querySelector('.carousel-controller');

                let wrapper = container.querySelector('.wrapper');
                if (!wrapper && title && carouselController) {
                    wrapper = document.createElement('div');
                    wrapper.classList.add('wrapper');

                    container.removeChild(title);
                    wrapper.appendChild(title);

                    container.removeChild(carouselController);
                    wrapper.appendChild(carouselController);

                    const firstChild = container.firstChild;
                    if (firstChild) {
                        container.insertBefore(wrapper, firstChild);
                    } else {
                        container.appendChild(wrapper);
                    }
                }
            }
        } else {
            const participantsSection = document.querySelector('.participants');

            if (participantsSection) {
                const container = participantsSection.querySelector('.container');
                const wrapper = container.querySelector('.wrapper');

                if (wrapper) {
                    const title = wrapper.querySelector('.title__first');
                    const carouselController = wrapper.querySelector('.carousel-controller');

                    if (title) {
                        wrapper.removeChild(title);
                        container.insertBefore(title, wrapper);
                    }

                    if (carouselController) {
                        wrapper.removeChild(carouselController);
                        container.insertBefore(carouselController, wrapper);
                    }

                    container.removeChild(wrapper);
                }
            }
        }
    }

    rearrangeCarouselController();

    window.addEventListener('resize', rearrangeCarouselController);
});



document.addEventListener('DOMContentLoaded', function() {
    // Находим все ссылки с href, начинающимся на #
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Пропускаем пустые якоря href="#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            // Проверяем, существует ли элемент на странице
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ─────────────────────────────────────────────────────────────
// бесконечный текст по горизонтали 
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Фразы для прокрутки
    const phrases = [
        'Дело помощи утопающим — дело рук самих утопающих!',
        'Шахматы двигают вперёд не только культуру, но и экономику!',
        'Лёд тронулся, господа присяжные заседатели!'
    ];

    // Функция создания HTML-содержимого списка
    function createListContent() {
        return phrases.map(text => `<li>${text}</li>`).join('');
    }

    // Инициализация одного блока маркиса
    function initMarquee(track) {
        const originalList = track.querySelector('.marquee__list--original');
        const cloneList = track.querySelector('.marquee__list--clone');
        
        if (!originalList || !cloneList) return;

        // Заполняем контентом
        const content = createListContent();
        originalList.innerHTML = content;
        cloneList.innerHTML = content;

        // Функция расчёта длительности анимации
        function calculateDuration() {
            const listWidth = originalList.offsetWidth;
            const speed = 50; // px/сек (регулируйте скорость здесь)
            const duration = listWidth / speed;
            track.style.animationDuration = `${duration}s`;
            // console.log(`🎬 Блок: ширина ${listWidth}px, длительность ${duration}s`);
        }

        // Пересчёт при загрузке шрифтов и изменении размера
        if (document.fonts?.ready) {
            document.fonts.ready.then(calculateDuration);
        } else {
            window.addEventListener('load', calculateDuration);
        }
        
        // Дебаунс для resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Сброс анимации для корректного пересчёта
                track.style.animation = 'none';
                track.offsetHeight; // trigger reflow
                calculateDuration();
                track.style.animation = '';
            }, 100);
        });
    }

    // Находим все треки и инициализируем каждый
    const tracks = document.querySelectorAll('.marquee__track');
    tracks.forEach(initMarquee);
});

document.addEventListener('DOMContentLoaded', () => {
    const img = document.querySelector('.slider__card_img');
    if (!img) return;

    function activateAnimation() {
        img.classList.add('is-visible');
    }

    // 1️⃣ Ждём, пока браузер узнает реальные размеры картинки
    const activateWhenReady = () => {
        if (img.complete && img.naturalHeight > 0) {
            initObserver();
        } else {
            img.addEventListener('load', initObserver, { once: true });
        }
    };

    // 2️⃣ IntersectionObserver (основной способ)
    function initObserver() {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].intersectionRatio > 0) {
                activateAnimation();
                observer.disconnect();
            }
        }, {
            threshold: [0, 0.1, 0.2], // Срабатывает при первом пикселе
            rootMargin: '0px 0px -10% 0px' // Активирует чуть раньше нижнего края
        });

        observer.observe(img);

        // 3️⃣ Фоллбэк: если родитель режет картинку (overflow: hidden), IO не сработает.
        // Слушаем скролл, но оптимизированно
        let scrollChecked = false;
        const checkScroll = () => {
            if (scrollChecked) return;
            const rect = img.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
            
            if (isVisible) {
                scrollChecked = true;
                activateAnimation();
                window.removeEventListener('scroll', checkScroll, { passive: true });
            }
        };
        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll(); // Проверка при загрузке
    }

    activateWhenReady();
});