// Плавная навигация и анимации
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    initSmoothScrolling();
    initScrollAnimations();
    initNavHighlight();
    initMusicPlayer();
    
    // Добавляем класс для определения мобильных устройств
    detectMobile();
});

// Определение мобильных устройств
function detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
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
                
                // Закрываем меню на мобильных (если будет добавлено)
                if (window.innerWidth <= 768) {
                    const nav = document.querySelector('.nav-links');
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                    }
                }
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

// Аудио-плеер
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
    
    // Инициализация треков
    tracks = Array.from(trackItems).map((item, index) => ({
        element: item,
        src: item.getAttribute('data-src'),
        title: item.querySelector('.track-title').textContent,
        artist: item.querySelector('.track-artist').textContent,
        duration: item.querySelector('.track-duration').textContent
    }));
    
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
        
        // Автовоспроизведение если нужно
        if (autoPlay) {
            playTrack();
        }
        
        console.log('🎵 Загружен трек:', track.title);
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
                console.log('❌ Ошибка воспроизведения:', e);
                // Показываем пользователю сообщение
                showAudioError();
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
    
    // Показать ошибку загрузки аудио
    function showAudioError() {
        // Можно добавить уведомление для пользователя
        console.warn('Аудиофайлы не найдены. Убедитесь, что файлы находятся в корневой папке сайта.');
        
        // Демо-режим: показываем сообщение при первом клике
        if (!localStorage.getItem('audioWarningShown')) {
            alert('Аудиофайлы загружаются с GitHub. Для полной функциональности убедитесь, что все MP3 файлы находятся в корневой папке репозитория.');
            localStorage.setItem('audioWarningShown', 'true');
        }
    }
    
    // События
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    progressBar.addEventListener('click', setProgress);
    
    // Клик по треку в плейлисте
    trackItems.forEach((item, index) => {
        item.addEventListener('click', () => {
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
    audio.addEventListener('error', function(e) {
        console.error('Ошибка загрузки аудио:', e);
        showAudioError();
    });
    
    // Загрузка первого трека
    if (tracks.length > 0) {
        loadTrack(0, false);
    }
    
    console.log('✅ Аудио-плеер готов! Треков:', tracks.length);
}

// Добавляем стиль для активной ссылки
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
    .nav-link.active {
        opacity: 1;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    /* Индикатор загрузки для аудио */
    .loading-audio::after {
        content: ' (загрузка...)';
        font-size: 0.8em;
        opacity: 0.7;
    }
`;
document.head.appendChild(activeNavStyle);
