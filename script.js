// Простой аудио-плеер
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Загрузка сайта...');
    initMusicPlayer();
    initNavigation();
});

function initNavigation() {
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initMusicPlayer() {
    console.log('🎵 Инициализация плеера...');
    
    const audio = new Audio();
    let currentTrackIndex = 0;
    let isPlaying = false;
    
    // Элементы управления
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
    const tracks = Array.from(trackItems).map((item, index) => {
        return {
            element: item,
            src: item.getAttribute('data-src'),
            title: item.querySelector('.track-title').textContent,
            artist: item.querySelector('.track-artist').textContent,
            duration: item.querySelector('.track-duration').textContent
        };
    });
    
    console.log('Найдено треков:', tracks.length);
    
    function loadTrack(index) {
        if (index < 0 || index >= tracks.length) return;
        
        currentTrackIndex = index;
        const track = tracks[index];
        
        console.log('Загружаем:', track.src);
        
        // Сбрасываем
        audio.pause();
        isPlaying = false;
        updatePlayButton();
        
        // Устанавливаем новый трек
        audio.src = track.src;
        
        // Обновляем интерфейс
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        timeTotal.textContent = track.duration;
        timeCurrent.textContent = '0:00';
        progressFill.style.width = '0%';
        
        // Выделяем активный трек
        trackItems.forEach(item => item.classList.remove('active'));
        track.element.classList.add('active');
        
        // Загружаем
        audio.load();
    }
    
    function playTrack() {
        audio.play().then(() => {
            isPlaying = true;
            updatePlayButton();
            console.log('Воспроизведение начато');
        }).catch(error => {
            console.log('Ошибка:', error);
            trackTitle.textContent = 'Кликните для воспроизведения';
        });
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
        playBtn.textContent = isPlaying ? '⏸' : '▶';
    }
    
    function nextTrack() {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(nextIndex);
        if (isPlaying) setTimeout(playTrack, 100);
    }
    
    function prevTrack() {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(prevIndex);
        if (isPlaying) setTimeout(playTrack, 100);
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
    
    // Клики по трекам
    trackItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            loadTrack(index);
            setTimeout(playTrack, 100);
        });
    });
    
    // События аудио
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    
    audio.addEventListener('error', function(e) {
        console.error('Ошибка загрузки:', audio.src);
        trackTitle.textContent = 'Файл не найден';
        trackArtist.textContent = audio.src.split('/').pop();
    });
    
    // Загружаем первый трек
    if (tracks.length > 0) {
        loadTrack(0);
    }
}
