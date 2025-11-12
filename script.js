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
    
    // Сначала попробуем загрузить реальные файлы
    tracks = Array.from(trackItems).map((item, index) => {
        const src = item.getAttribute('data-src');
        const title = item.querySelector('.track-title').textContent;
        const artist = item.querySelector('.track-artist').textContent;
        const duration = item.querySelector('.track-duration').textContent;
        
        return {
            element: item,
            src: src,
            title: title,
            artist: artist,
            duration: duration
        };
    });
    
    // Функция проверки доступности файла
    function checkFileAvailability(src, callback) {
        fetch(src, { method: 'HEAD' })
            .then(response => callback(response.ok))
            .catch(() => callback(false));
    }
    
    // Проверим все файлы при загрузке
    tracks.forEach((track, index) => {
        checkFileAvailability(track.src, (isAvailable) => {
            if (!isAvailable) {
                console.log(`❌ Файл недоступен: ${track.src}`);
                // Можно добавить демо-трек если файл недоступен
                track.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(index % 3) + 1}.mp3`;
                track.title = track.title + ' (демо)';
            } else {
                console.log(`✅ Файл доступен: ${track.src}`);
            }
        });
    });
    
    // Остальной код функции без изменений...
    function loadTrack(index, autoPlay = false) {
        if (index < 0 || index >= tracks.length) return;
        
        currentTrackIndex = index;
        const track = tracks[index];
        
        audio.pause();
        isPlaying = false;
        updatePlayButton();
        
        audio.src = track.src;
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        timeTotal.textContent = track.duration;
        
        trackItems.forEach(item => item.classList.remove('active'));
        track.element.classList.add('active');
        
        progressFill.style.width = '0%';
        timeCurrent.textContent = '0:00';
        
        if (autoPlay && isUserInteracted) {
            playTrack();
        }
        
        console.log('🎵 Загружен трек:', track.title, 'Src:', track.src);
    }
    
    function playTrack() {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updatePlayButton();
            }).catch(e => {
                console.log('❌ Ошибка автоплея:', e);
            });
        }
    }
    
    function pauseTrack() {
        audio.pause();
        isPlaying = false;
        updatePlayButton();
    }
    
    function togglePlay() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }
    
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
    
    function nextTrack() {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(nextIndex, true);
    }
    
    function prevTrack() {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(prevIndex, true);
    }
    
    function updateProgress() {
        const { currentTime, duration } = audio;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressFill.style.width = `${progressPercent}%`;
            timeCurrent.textContent = formatTime(currentTime);
        }
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        if (duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    }
    
    // Обработка ошибок
    audio.addEventListener('error', function(e) {
        console.error('❌ Ошибка загрузки аудио:', e);
        trackTitle.textContent = 'Ошибка загрузки';
        trackArtist.textContent = 'Проверьте файлы на GitHub';
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
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    
    // Загрузка первого трека
    if (tracks.length > 0) {
        loadTrack(0, false);
    }
    
    console.log('✅ Аудио-плеер готов! Треков:', tracks.length);
}
