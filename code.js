// Конфигурация
const CONFIG = {
    LOGPAS_URL: 'https://raw.githubusercontent.com/DemaraScript/demarascript.github.io/main/LogPas.txt'
};

let logPasData = [];
let currentRandomLine = '';
let correctPassword = '';
let currentEmail = {
    username: '',
    domain: 'outlook.com',
    full: 'example@outlook.com'
};

// Функция для генерации случайной строки
function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Обновление значения длины
function updateLengthValue() {
    const lengthSlider = document.getElementById('email-length');
    const lengthValue = document.getElementById('length-value');
    lengthValue.textContent = lengthSlider.value;
    updateEmailPreview();
}

// Обновление preview email
function updateEmailPreview() {
    const domain = document.getElementById('email-domain').value;
    const length = parseInt(document.getElementById('email-length').value);
    
    currentEmail.domain = domain;
    currentEmail.username = generateRandomString(length);
    currentEmail.full = `${currentEmail.username}@${domain}`;
    
    document.getElementById('email-preview').textContent = currentEmail.full;
}

// Генерация email
function generateEmail() {
    updateEmailPreview();
    const statusElement = document.getElementById('email-status');
    statusElement.textContent = 'Email сгенерирован!';
    statusElement.className = 'status-message success';
    
    setTimeout(() => {
        statusElement.textContent = 'Готов к использованию';
        statusElement.className = 'status-message info';
    }, 2000);
}

// Копирование полного email
function copyEmail() {
    if (!currentEmail.full) {
        alert('Сначала сгенерируйте email!');
        return;
    }
    
    navigator.clipboard.writeText(currentEmail.full).then(() => {
        const statusElement = document.getElementById('email-status');
        statusElement.textContent = 'Email скопирован в буфер обмена!';
        statusElement.className = 'status-message success';
        
        setTimeout(() => {
            statusElement.textContent = 'Готов к использованию';
            statusElement.className = 'status-message info';
        }, 2000);
    }).catch(() => {
        alert('Не удалось скопировать email. Скопируйте вручную.');
    });
}

// Копирование только логина
function copyUsername() {
    if (!currentEmail.username) {
        alert('Сначала сгенерируйте email!');
        return;
    }
    
    navigator.clipboard.writeText(currentEmail.username).then(() => {
        const statusElement = document.getElementById('email-status');
        statusElement.textContent = 'Логин скопирован в буфер обмена!';
        statusElement.className = 'status-message success';
        
        setTimeout(() => {
            statusElement.textContent = 'Готов к использованию';
            statusElement.className = 'status-message info';
        }, 2000);
    }).catch(() => {
        alert('Не удалось скопировать логин. Скопируйте вручную.');
    });
}

// Проверка пароля
async function checkPassword() {
    try {
        const response = await fetch(CONFIG.LOGPAS_URL, { 
            cache: 'no-store',
            headers: {
                'Accept': 'text/plain'
            }
        });
        
        if (!response.ok) throw new Error('Файл с паролем не найден');
        const text = await response.text();
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        
        if (lines.length === 0) throw new Error('Файл пуст');
        
        correctPassword = lines[0];
        logPasData = lines.slice(1);
        
        document.getElementById('password-submit').addEventListener('click', validatePassword);
        document.getElementById('password-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') validatePassword();
        });
    } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        document.getElementById('password-error').textContent = 'Ошибка загрузки файла пароля: ' + error.message;
        document.getElementById('password-error').style.display = 'block';
    }
}

// Валидация пароля
function validatePassword() {
    const inputPassword = document.getElementById('password-input').value;
    const errorElement = document.getElementById('password-error');
    
    if (inputPassword === correctPassword) {
        document.getElementById('password-modal').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
        initializeApp();
    } else {
        errorElement.style.display = 'block';
    }
}

// Инициализация приложения
function initializeApp() {
    if (logPasData.length > 0) {
        document.getElementById('firstmail-status').textContent = 'Данные успешно загружены! Загружено строк: ' + logPasData.length;
        generateRandomLine();
    } else {
        document.getElementById('errorMessage').textContent = 'Ошибка: Нет данных для генерации!';
        document.getElementById('errorMessage').classList.remove('hidden');
    }
    
    initTabs();
    generateEmail(); // Генерируем email по умолчанию
}

// Инициализация табов
function initTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.getAttribute('data-tab'));
        });
    });
}

// Переключение табов
function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`.tab-button[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    if (tabName === 'email-generator') {
        generateEmail();
    }
}

// Загрузка данных
function loadData() {
    document.getElementById('errorMessage').classList.add('hidden');
    document.getElementById('copySuccess').classList.add('hidden');
    
    if (logPasData.length === 0) {
        document.getElementById('errorMessage').textContent = 'Ошибка: Нет данных для генерации!';
        document.getElementById('errorMessage').classList.remove('hidden');
        return;
    }
    
    generateRandomLine();
}

// Генерация случайной строки
function generateRandomLine() {
    const randomIndex = Math.floor(Math.random() * logPasData.length);
    currentRandomLine = logPasData[randomIndex];
    document.getElementById('randomLineResult').textContent = currentRandomLine;
    
    copyToClipboard(currentRandomLine).then(() => {
        document.getElementById('copySuccess').classList.remove('hidden');
        setTimeout(() => document.getElementById('copySuccess').classList.add('hidden'), 3000);
    });
}

// Копирование случайной строки
function copyRandomLine() {
    if (!currentRandomLine) {
        document.getElementById('errorMessage').textContent = 'Сначала сгенерируйте строку!';
        document.getElementById('errorMessage').classList.remove('hidden');
        return;
    }
    
    copyToClipboard(currentRandomLine).then(() => {
        document.getElementById('copySuccess').classList.remove('hidden');
        setTimeout(() => document.getElementById('copySuccess').classList.add('hidden'), 3000);
    });
}

// Переход на сайт
function goToWebsite(type) {
    const url = type === 'firstmail' ? 'https://firstmail.ltd/ru-RU/webmail' : 'https://outlook.com';
    window.open(url, '_blank');
}

// Копирование в буфер обмена
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        return false;
    }
}

// Переключение видимости datetime
function toggleDateTime() {
    const datetimeContainer = document.getElementById('datetimeContainer');
    datetimeContainer.classList.toggle('hidden', document.getElementById('statusSelect').value !== 'В бане');
}

// Генерация лога с форматом    /n   
function generateLog() {
    const dataInput = document.getElementById('dataInput').value;
    const platform = document.getElementById('platformSelect').value;
    const prefix = document.getElementById('prefixInput').value || 'E/T';
    const status = document.getElementById('statusSelect').value;
    
    if (!dataInput) {
        alert('Введите данные в формате email:password,name');
        return;
    }
    
    // Создаем запись в формате с    /n    вместо |
    let logEntry = `${platform}   /n   ${prefix}   /n   ${dataInput}`;
    
    if (status) {
        logEntry += `   /n   ${status}`;
        
        if (status === 'В бане') {
            const dateInput = document.getElementById('dateInput').value;
            const timeInput = document.getElementById('timeInput').value;
            
            if (dateInput && timeInput) {
                const date = new Date(`${dateInput}T${timeInput}`);
                const formattedDate = date.toLocaleDateString('ru-RU');
                const formattedTime = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                
                logEntry += `   /n   ${formattedDate} ${formattedTime}`;
            }
        }
    }
    
    document.getElementById('logResult').textContent = logEntry;
}

// Копирование лога
function copyLog() {
    const logText = document.getElementById('logResult').textContent;
    if (!logText) {
        alert('Сначала сгенерируйте запись!');
        return;
    }
    
    copyToClipboard(logText).then(success => {
        if (success) {
            document.getElementById('logCopySuccess').classList.remove('hidden');
            setTimeout(() => document.getElementById('logCopySuccess').classList.add('hidden'), 3000);
        } else {
            alert('Не удалось скопировать запись. Скопируйте вручную.');
        }
    });
}

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', checkPassword);

// Глобальные функции
window.copyEmail = copyEmail;
window.copyUsername = copyUsername;
window.generateEmail = generateEmail;
window.updateLengthValue = updateLengthValue;
window.updateEmailPreview = updateEmailPreview;
window.loadData = loadData;
window.copyRandomLine = copyRandomLine;
window.goToWebsite = goToWebsite;
window.generateLog = generateLog;
window.copyLog = copyLog;
window.toggleDateTime = toggleDateTime;
