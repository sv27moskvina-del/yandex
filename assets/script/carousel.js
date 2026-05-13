document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.carousel__container');
    const prevBtn = document.querySelector('.btn__carousel-prev');
    const nextBtn = document.querySelector('.btn__carousel-next');
    const countIndicator = document.querySelector('.count-indicator');
    
    // Сохраняем ссылки только на оригинальные элементы
    const originalItems = Array.from(container.querySelectorAll('.carousel__item'));
    if (originalItems.length === 0) return;

    let currentIndex = 0;
    let isAnimating = false;
    let autoSlideInterval = null;

    // ─────────────────────────────────────────────────────────────
    // Вспомогательные функции
    // ─────────────────────────────────────────────────────────────
    function getItemsPerSlide() { return window.innerWidth >= 768 ? 3 : 1; }
    function getGapSize() { 
        const style = getComputedStyle(container);
        return parseFloat(style.columnGap || style.gap) || 0; 
    }
    function getItemWidth() { return originalItems[0]?.offsetWidth || 0; }

    function getTotalOriginalSlides() {
        return Math.ceil(originalItems.length / getItemsPerSlide());
    }

    // ─────────────────────────────────────────────────────────────
    // Создание клонов для бесшовного перехода
    // ─────────────────────────────────────────────────────────────
    function rebuildClones() {
        // Удаляем старые клоны (при ресайзе)
        container.querySelectorAll('.carousel__clone').forEach(el => el.remove());
        
        const ips = getItemsPerSlide();
        
        // Клоны последних N элементов → в начало
        const clonesBefore = originalItems.slice(-ips).map(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('carousel__clone');
            clone.setAttribute('aria-hidden', 'true');
            return clone;
        });
        clonesBefore.reverse().forEach(clone => container.prepend(clone));

        // Клоны первых N элементов → в конец
        const clonesAfter = originalItems.slice(0, ips).map(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('carousel__clone');
            clone.setAttribute('aria-hidden', 'true');
            return clone;
        });
        clonesAfter.forEach(clone => container.append(clone));
    }

    // ─────────────────────────────────────────────────────────────
    // Основная функция сдвига
    // ─────────────────────────────────────────────────────────────
    function updateCarousel(animate = true) {
        const ips = getItemsPerSlide();
        const itemW = getItemWidth();
        const gap = getGapSize();
        const slideW = itemW * ips + gap * (ips - 1);
        const baseOffset = ips * (itemW + gap); // Отступ под prepended-клоны

        const offset = -(baseOffset + currentIndex * slideW);

        if (animate) {
            container.style.transition = 'transform 0.5s ease';
            isAnimating = true;
        } else {
            container.style.transition = 'none';
            isAnimating = false;
        }
        
        container.style.transform = `translateX(${offset}px)`;

        // Обновляем счётчик
        if (countIndicator) {
            const totalSlides = getTotalOriginalSlides();
            // Нормализуем индекс для отображения
            const currentSlide = ((currentIndex % totalSlides) + totalSlides) % totalSlides;
            countIndicator.innerHTML = `<span class="slides-numbers">${currentSlide + 1} <span class="total-count">/ ${totalSlides}</span></span>`;
        }

        // Кнопки никогда не блокируются
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
    }

    // ─────────────────────────────────────────────────────────────
    // Обработка окончания анимации → мгновенный сброс
    // ─────────────────────────────────────────────────────────────
    container.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform' || !isAnimating) return;
        
        const totalSlides = getTotalOriginalSlides();
        
        // Если ушли вперёд за пределы оригинала → прыгаем в начало
        if (currentIndex >= totalSlides) {
            currentIndex -= totalSlides;
        } 
        // Если ушли назад за пределы оригинала → прыгаем в конец
        else if (currentIndex < 0) {
            currentIndex += totalSlides;
        }
        
        updateCarousel(false); // Сброс без анимации (мгновенно)
    });

    // ─────────────────────────────────────────────────────────────
    // Управление слайдами
    // ─────────────────────────────────────────────────────────────
    function nextSlide() {
        if (isAnimating) return;
        currentIndex++;
        updateCarousel(true);
    }

    function prevSlide() {
        if (isAnimating) return;
        currentIndex--;
        updateCarousel(true);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoSlide(); });

    // ─────────────────────────────────────────────────────────────
    // Автопрокрутка
    // ─────────────────────────────────────────────────────────────
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            if (!isAnimating) nextSlide();
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }

    if (container) {
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);
    }

    // ─────────────────────────────────────────────────────────────
    // Resize & Init
    // ─────────────────────────────────────────────────────────────
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            rebuildClones();
            currentIndex = 0; // Сброс для корректного пересчёта
            updateCarousel(false);
        }, 150);
    });

    // Запуск
    rebuildClones();
    updateCarousel(false);
    startAutoSlide();
});