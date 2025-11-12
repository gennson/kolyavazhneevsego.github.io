// Плавная навигация и анимации
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    initSmoothScrolling();
    initScrollAnimations();
    initNavHighlight();
    initMobileNavigation();
    initMusicPlayer();
});

// Мобильная навигация
function initMobileNavigation() {
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelector('.nav-links');
    
    // Создаем кнопку меню для мобильных
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '☰';
    menuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #000000;
        z-index: 1001;
    `;
    
    nav.insertBefore(menuBtn, navLinks);
    
    // Стили для мобильного меню
    const mobileMenuStyles = document.createElement('style');
    mobileMenuStyles.textContent = `
        @media (max-width: 767px) {
            .mobile-menu-btn {
                display: block !important;
            }
            
            .nav-links {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: #ffffff;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2rem;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
                z-index: 1000;
            }
            
            .nav-links.active {
                transform: translateY(0);
            }
            
            .nav-link {
                font-size: 1.2rem;
            }
        }
    `;
    document.head.appendChild(mobileMenuStyles);
    
    // Переключение меню
    menuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });
    
    // Закрытие меню при клике на ссылку
    navLinks.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            navLinks.classList.remove('active');
            menuBtn.textContent = '☰';
        }
    });
}

// Плавный скролл к секциям
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    const animatedElements = document.querySelectorAll('.project-category, .artist-list');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Подсветка активного раздела в навигации
function initNavHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Аудио-плеер с улучшенной обработкой ошибок
function initMusicPlayer() {
    console.log('🎵 Инициализация аудио-плеера...');
    
    const audio = new Audio();
    let currentTrackIndex = 0;
    let isPlaying = false;
    let tracks = [];
    let isUserInteracted = false;
    
    // Элементы DOM
    const playBtn = document.querySelector('.play-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const timeCurrent = document.querySelector('.time-current');
    const timeTotal = document.querySelector('.time-total');
    const trackTitle = document.querySelector('.track-title');
    const trackArtist = document.querySelector('.track-artist');
    const trackItems = document.querySelectorAll('.track-item');
    
    // Инициализация треков
    tracks = Array.from(trackItems).map((item, index) => ({
        element: item,
        src: item.getAttribute('data-src'),
        title: item.querySelector('.track-title').textContent,
        artist: item.querySelector('.track-artist').textContent,
        duration: item.querySelector('.track-duration').textContent
    }));
    
    // Отметка пользовательского взаимодействия
    function markUserInteraction() {
        isUserInteracted = true;
        document.removeEventListener('click', markUserInteraction);
        document.removeEventListener('touchstart', markUserInteraction);
    }
    
    document.addEventListener('click', markUserInteraction);
    document.addEventListener('touchstart', markUserInteraction);
    
    // Функция загрузки трека
    function loadTrack(index, autoPlay = false) {
        if (index < 0 || index >= tracks.length) return;
        
        currentTrackIndex = index;
        const track = tracks[index];
        
        // Пауза текущего трека
        audio.pause();
        isPlaying = false;
        updatePlayButton();
        
        // Загрузка нового трека
        audio.src = track.src;
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        timeTotal.textContent = track.duration;
        
        // Обновляем активный класс
        trackItems.forEach(item => item.classList.remove('active'));
        track.element.classList.add('active');
        
        // Сбрасываем прогресс
        progressFill.style.width = '0%';
        timeCurrent.textContent = '0:00';
        
        // Автовоспроизведение только после пользовательского взаимодействия
        if (autoPlay && isUserInteracted) {
            playTrack();
        }
        
        console.log('🎵 Загружен трек:', track.title, 'Src:', track.src);
    }
    
    // Функция воспроизведения трека
    function playTrack() {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updatePlayButton();
                console.log('▶️ Воспроизведение:', tracks[currentTrackIndex].title);
            }).catch(e => {
                console.log('❌ Ошибка автоплея, требуется пользовательское взаимодействие:', e);
                // Показываем сообщение для пользователя
                showPlaybackHint();
            });
        }
    }
    
    // Функция паузы
    function pauseTrack() {
        audio.pause();
        isPlaying = false;
        updatePlayButton();
        console.log('⏸️ Пауза');
    }
    
    // Функция воспроизведения/паузы
    function togglePlay() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }
    
    // Обновление кнопки play/pause
    function updatePlayButton() {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }
    
    // Следующий трек
    function nextTrack() {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(nextIndex, true);
    }
    
    // Предыдущий трек
    function prevTrack() {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(prevIndex, true);
    }
    
    // Обновление прогресса
    function updateProgress() {
        const { currentTime, duration } = audio;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressFill.style.width = `${progressPercent}%`;
            
            // Обновление времени
            timeCurrent.textContent = formatTime(currentTime);
        }
    }
    
    // Форматирование времени
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Перемотка по клику на прогресс-бар
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        if (duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    }
    
    // Показать подсказку о воспроизведении
    function showPlaybackHint() {
        // Создаем временное сообщение
        const hint = document.createElement('div');
        hint.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            font-family: 'Radiotechnika', monospace;
            text-align: center;
            max-width: 300px;
        `;
        hint.textContent = 'Нажмите на кнопку воспроизведения для запуска музыки';
        
        document.body.appendChild(hint);
        
        setTimeout(() => {
            document.body.removeChild(hint);
        }, 3000);
    }
    
    // Обработка ошибок загрузки аудио
    audio.addEventListener('error', function(e) {
        console.error('❌ Ошибка загрузки аудио:', e);
        console.error('Путь к файлу:', audio.src);
        
        // Показываем сообщение об ошибке
        trackTitle.textContent = 'Ошибка загрузки';
        trackArtist.textContent = 'Проверьте пути к файлам';
        
        // Показываем подсказку в консоли
        console.log('💡 Подсказка: Убедитесь, что:');
        console.log('1. Аудиофайлы загружены в репозиторий');
        console.log('2. Имена файлов совпадают с указанными в data-src');
        console.log('3. Файлы находятся в корневой папке (не в папке audio/)');
    });
    
    // События
    playBtn.addEventListener('click', function() {
        isUserInteracted = true;
        togglePlay();
    });
    
    nextBtn.addEventListener('click', function() {
        isUserInteracted = true;
        nextTrack();
    });
    
    prevBtn.addEventListener('click', function() {
        isUserInteracted = true;
        prevTrack();
    });
    
    progressBar.addEventListener('click', setProgress);
    
    // Клик по треку в плейлисте
    trackItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            isUserInteracted = true;
            if (index === currentTrackIndex) {
                togglePlay();
            } else {
                loadTrack(index, true);
            }
        });
    });
    
    // События аудио
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('canplaythrough', function() {
        console.log('✅ Аудио готово к воспроизведению:', audio.src);
    });
    
    // Загрузка первого трека (без автовоспроизведения)
    if (tracks.length > 0) {
        loadTrack(0, false);
    }
    
    console.log('✅ Аудио-плеер готов! Треков:', tracks.length);
    console.log('💡 Для воспроизведения требуется клик пользователя');
}
