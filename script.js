// Плавная навигация и анимации
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    initSmoothScrolling();
    initScrollAnimations();
    initNavHighlight();
    initMusicCarousel(); // ДОБАВЛЯЕМ ВЫЗОВ КАРУСЕЛИ
});

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

// Добавляем стиль для активной ссылки
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
    .nav-link.active {
        opacity: 1;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeNavStyle);

// Аудио-плеер - ИСПРАВЛЕННАЯ ВЕРСИЯ
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
    
    function loadTrack(index, autoPlay = false) {
    if (index < 0 || index >= tracks.length) return;
    
    currentTrackIndex = index;
    const track = tracks[index];
    
    // Пауза текущего трека
    audio.pause();
    isPlaying = false;
    updatePlayButton();
    
    // ЗАМЕНИ ЭТУ ЧАСТЬ:
    // Загрузка нового трека с обработкой CORS
    audio.crossOrigin = "anonymous"; // Добавляем CORS
    audio.src = track.src;
    
    // Добавляем обработчики ошибок
    audio.addEventListener('error', function(e) {
        console.error('❌ Ошибка загрузки аудио:', e);
        console.error('Файл:', track.src);
        alert('Ошибка загрузки аудио. Проверьте консоль для деталей.');
    });
    
    audio.addEventListener('canplaythrough', function() {
        console.log('✅ Аудио готово к воспроизведению:', track.title);
    });
    
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
    
    console.log('🎵 Загружен трек:', track.title, 'Путь:', track.src);
}
    
    // Функция воспроизведения трека
    function playTrack() {
        audio.play().then(() => {
            isPlaying = true;
            updatePlayButton();
            console.log('▶️ Воспроизведение:', tracks[currentTrackIndex].title);
        }).catch(e => {
            console.log('❌ Ошибка воспроизведения:', e);
            // Заглушка для демо
            alert('Для работы плеера нужны аудиофайлы. Добавьте файлы в папку audio/');
        });
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
        loadTrack(nextIndex, true); // autoPlay = true
    }
    
    // Предыдущий трек
    function prevTrack() {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(prevIndex, true); // autoPlay = true
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
    
    // События
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    progressBar.addEventListener('click', setProgress);
    
    // Клик по треку в плейлисте - ТЕПЕРЬ С АВТОВОСПРОИЗВЕДЕНИЕМ
    trackItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Если кликаем на текущий трек - toggle play/pause
            if (index === currentTrackIndex) {
                togglePlay();
            } else {
                // Если кликаем на другой трек - загружаем и сразу воспроизводим
                loadTrack(index, true);
            }
        });
    });
    
    // События аудио
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    
    // Загрузка первого трека (без автовоспроизведения)
    if (tracks.length > 0) {
        loadTrack(0, false);
    }
    
    console.log('✅ Аудио-плеер готов! Треков:', tracks.length);
}

// Добавь вызов в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initMusicPlayer();
});

