// ЗАМЕНИ весь файл script.js на этот код:

document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initScrollAnimations();
    initNavHighlight();
    initMusicPlayer();
    detectMobile();
});

function detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
}

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

// АУДИОПЛЕЕР ДЛЯ YADI.SK ССЫЛОК
function initMusicPlayer() {
    console.log('🎵 Инициализация аудио-плеера для yadi.sk...');
    
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
        
        console.log('🔄 Загрузка трека:', track.title);
        console.log('📁 URL:', track.src);
        
        // Показываем индикатор загрузки
        showLoadingState(true);
        
        // Пауза текущего трека
        audio.pause();
        isPlaying = false;
        updatePlayButton();
        
        // Загрузка нового трека
        audio.src = track.src;
        
        // Добавляем CORS атрибут для внешних ресурсов
        audio.crossOrigin = "anonymous";
        
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        timeTotal.textContent = track.duration;
        
        // Обновляем активный класс
        trackItems.forEach(item => item.classList.remove('active'));
        track.element.classList.add('active');
        
        // Сбрасываем прогресс
        progressFill.style.width = '0%';
        timeCurrent.textContent = '0:00';
        
        // Предзагрузка трека
        audio.preload = 'auto';
        
        // Обработчики для загрузки метаданных
        audio.addEventListener('loadedmetadata', function onMetadata() {
            showLoadingState(false);
            console.log('✅ Метаданные загружены, длительность:', audio.duration);
            
            // Автовоспроизведение если нужно
            if (autoPlay) {
                playTrack();
            }
            
            // Удаляем обработчик после использования
            audio.removeEventListener('loadedmetadata', onMetadata);
        }, { once: true });
        
        // Обработчик ошибок загрузки
        audio.addEventListener('error', function onError(e) {
            console.error('❌ Ошибка загрузки аудио:', e);
            showLoadingState(false);
            showAudioError('Ошибка загрузки трека: ' + track.title);
            
            // Удаляем обработчик после использования
            audio.removeEventListener('error', onError);
        }, { once: true });
    }
    
    // Функция воспроизведения трека
    function playTrack() {
        console.log('▶️ Попытка воспроизведения...');
        
        // Проверяем, готов ли аудио к воспроизведению
        if (audio.readyState < 2) {
            console.log('⚠️ Аудио еще не готово, ждем...');
            audio.addEventListener('canplay', function onCanPlay() {
                console.log('✅ Аудио готово к воспроизведению');
                actuallyPlay();
                audio.removeEventListener('canplay', onCanPlay);
            }, { once: true });
            return;
        }
        
        actuallyPlay();
    }
    
    function actuallyPlay() {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updatePlayButton();
                console.log('✅ Воспроизведение:', tracks[currentTrackIndex].title);
            }).catch(e => {
                console.log('❌ Ошибка воспроизведения:', e);
                showAudioError('Не удалось воспроизвести трек: ' + e.message);
                
                // Показываем инструкцию для пользователя
                if (e.name === 'NotAllowedError') {
                    showAudioError('Нажмите на кнопку воспроизведения еще раз для авторизации');
                }
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
        if (audio.src && audio.readyState >= 2) {
            if (isPlaying) {
                pauseTrack();
            } else {
                playTrack();
            }
        } else {
            // Если трек еще не загружен, загружаем и воспроизводим
            loadTrack(currentTrackIndex, true);
        }
    }
    
    // Обновление кнопки play/pause
    function updatePlayButton() {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playBtn.setAttribute('title', 'Пауза');
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            playBtn.setAttribute('title', 'Воспроизвести');
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
        if (duration && !isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            progressFill.style.width = `${progressPercent}%`;
            
            // Обновление времени
            timeCurrent.textContent = formatTime(currentTime);
        }
    }
    
    // Форматирование времени
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Перемотка по клику на прогресс-бар
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        if (duration && !isNaN(duration)) {
            audio.currentTime = (clickX / width) * duration;
        }
    }
    
    // Показать/скрыть индикатор загрузки
    function showLoadingState(show) {
        const trackElement = tracks[currentTrackIndex]?.element;
        if (trackElement) {
            if (show) {
                trackElement.classList.add('loading');
            } else {
                trackElement.classList.remove('loading');
            }
        }
    }
    
    // Показать ошибку
    function showAudioError(message) {
        console.error('Ошибка аудио:', message);
        
        // Создаем уведомление
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        // Автоудаление через 5 секунд
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    // События
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    progressBar.addEventListener('click', setProgress);
    
    // Клик по треку в плейлисте
    trackItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (index === currentTrackIndex && audio.src && audio.readyState >= 2) {
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
        console.log('✅ Аудио полностью загружено');
        showLoadingState(false);
    });
    
    // Загрузка первого трека
    if (tracks.length > 0) {
        loadTrack(0, false);
    }
    
    console.log('✅ Аудио-плеер готов! Треков:', tracks.length);
    
    // Добавляем глобальную переменную для отладки
    window.musicPlayer = {
        audio: audio,
        tracks: tracks,
        currentTrack: () => tracks[currentTrackIndex],
        debug: () => console.log({
            currentTrack: tracks[currentTrackIndex],
            isPlaying: isPlaying,
            audioState: {
                readyState: audio.readyState,
                duration: audio.duration,
                currentTime: audio.currentTime,
                src: audio.src
            }
        })
    };
}

// Добавляем стили для индикатора загрузки и улучшений
const audioStyles = document.createElement('style');
audioStyles.textContent = `
    .track-item.loading {
        position: relative;
        opacity: 0.7;
        background: #f5f5f5 !important;
    }
    
    .track-item.loading::after {
        content: '⏳';
        position: absolute;
        right: 40px;
        animation: spin 1s linear infinite;
        font-size: 12px;
    }
    
    .track-item.active.loading::after {
        color: white;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .nav-link.active {
        opacity: 1;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    /* Улучшаем визуальную обратную связь */
    .track-item {
        transition: all 0.2s ease;
    }
    
    .track-item:active {
        transform: scale(0.98);
    }
    
    .control-btn:active {
        transform: scale(0.9);
    }
`;
document.head.appendChild(audioStyles);
