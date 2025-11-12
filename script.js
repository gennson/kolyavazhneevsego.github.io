// Плавная навигация и анимации
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация сайта...');
    
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

// Простой и надежный аудио-плеер
function initMusicPlayer() {
    console.log('🎵 Инициализация аудио-плеера...');
    
    const audio = new Audio();
    let currentTrackIndex = 0;
    let isPlaying = false;
    let tracks = [];
    
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
    
    // Собираем треки
    tracks = Array.from(trackItems).map((item, index) => {
        return {
            element: item,
            src: item.getAttribute('data-src'),
            title: item.querySelector('.track-title').textContent,
            artist: item.querySelector('.track-artist').textContent,
            duration: item.querySelector('.track-duration').textContent
        };
    });
    
    console.log('📁 Найдено треков:', tracks.length);
    tracks.forEach(track => {
        console.log('   →', track.src);
    });
    
    function loadTrack(index) {
        if (index < 0 || index >= tracks.length) return;
        
        currentTrackIndex = index;
        const track = tracks[index];
        
        console.log('🎵 Загружаем трек:', track.src);
        
        // Сбрасываем аудио
        audio.pause();
        isPlaying = false;
        updatePlayButton();
        
        // Устанавливаем новый источник
        audio.src = track.src;
        
        // Обновляем интерфейс
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        timeTotal.textContent = track.duration;
        timeCurrent.textContent = '0:00';
        progressFill.style.width = '0%';
        
        // Снимаем выделение со всех треков и выделяем текущий
        trackItems.forEach(item => item.classList.remove('active'));
        track.element.classList.add('active');
        
        // Загружаем трек
        audio.load();
    }
    
    function playTrack() {
        audio.play().then(() => {
            isPlaying = true;
            updatePlayButton();
            console.log('▶️ Воспроизведение начато');
        }).catch(error => {
            console.log('❌ Ошибка воспроизведения:', error);
            // Показываем сообщение пользователю
            trackTitle.textContent = 'Кликните для воспроизведения';
            trackArtist.textContent = 'Требуется действие пользователя';
        });
    }
    
    function pauseTrack() {
        audio.pause();
        isPlaying = false;
        updatePlayButton();
        console.log('⏸ Воспроизведение приостановлено');
    }
    
    function togglePlay() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }
    
    function updatePlayButton() {
        if (isPlaying) {
            playBtn.textContent = '⏸';
            playBtn.title = 'Пауза';
        } else {
            playBtn.textContent = '▶';
            playBtn.title = 'Воспроизвести';
        }
    }
    
    function nextTrack() {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(nextIndex);
        if (isPlaying) {
            setTimeout(playTrack, 100);
        }
    }
    
    function prevTrack() {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(prevIndex);
        if (isPlaying) {
            setTimeout(playTrack, 100);
        }
    }
    
    function updateProgress() {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${progressPercent}%`;
            timeCurrent.textContent = formatTime(audio.currentTime);
        }
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    function setProgress(e) {
        if (!audio.duration) return;
        
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    }
    
    // Обработчики событий
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    progressBar.addEventListener('click', setProgress);
    
    // Клики по трекам в плейлисте
    trackItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            console.log('🎵 Клик по треку:', index);
            loadTrack(index);
            setTimeout(playTrack, 100);
        });
    });
    
    // События аудио
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    
    audio.addEventListener('loadeddata', function() {
        console.log('✅ Аудио данные загружены');
    });
    
    audio.addEventListener('error', function(e) {
        console.error('❌ Ошибка загрузки аудио:', e);
        console.error('Проблема с файлом:', audio.src);
        trackTitle.textContent = 'Ошибка загрузки';
        trackArtist.textContent = 'Файл не найден: ' + audio.src.split('/').pop();
    });
    
    // Загружаем первый трек
    if (tracks.length > 0) {
        loadTrack(0);
        console.log('✅ Первый трек загружен');
    }
    
    console.log('🎵 Аудио-плеер готов к работе');
}
