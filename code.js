// Конфигурация - замените на свои реальные URL
const CONFIG = {
    LOGPAS_URL: 'https://raw.githubusercontent.com/DemaraScript/demarascript.github.io/main/LogPas.txt',
    // Добавьте другие URL файлов по необходимости
};

let logPasData = [];
let outlookEmail = '';
let currentRandomLine = '';
let correctPassword = '';

async function checkPassword() {
    try {
        // Используем raw.githubusercontent.com для доступа к сырому файлу
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

function initializeApp() {
    if (logPasData.length > 0) {
        document.getElementById('firstmail-status').textContent = 'Данные успешно загружены! Загружено строк: ' + logPasData.length;
        generateRandomLine();
    } else {
        document.getElementById('errorMessage').textContent = 'Ошибка: Нет данных для генерации!';
        document.getElementById('errorMessage').classList.remove('hidden');
    }
    
    initTabs();
    generateOutlookEmail();
}

function initTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.getAttribute('data-tab'));
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`.tab-button[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    if (tabName === 'outlook') generateOutlookEmail();
}

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

function generateRandomLine() {
    const randomIndex = Math.floor(Math.random() * logPasData.length);
    currentRandomLine = logPasData[randomIndex];
    document.getElementById('randomLineResult').textContent = currentRandomLine;
    copyToClipboard(currentRandomLine).then(() => {
        document.getElementById('copySuccess').classList.remove('hidden');
        setTimeout(() => document.getElementById('copySuccess').classList.add('hidden'), 3000);
    });
}

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

function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateOutlookEmail() {
    outlookEmail = `${generateRandomString(10)}@outlook.com`;
    document.getElementById('outlook-email').textContent = outlookEmail;
    copyEmail('outlook');
}

function copyEmail(type) {
    const statusElement = document.getElementById(`${type}-status`);
    
    if (!outlookEmail) {
        statusElement.textContent = 'Сначала сгенерируйте адрес.';
        statusElement.className = 'status-message error';
        return;
    }
    
    navigator.clipboard.writeText(outlookEmail).then(() => {
        statusElement.textContent = 'Email успешно скопирован в буфер обмена!';
        statusElement.className = 'status-message success';
        setTimeout(() => {
            statusElement.textContent = 'Email готов к использованию';
            statusElement.className = 'status-message info';
        }, 3000);
    }).catch(() => {
        statusElement.textContent = 'Ошибка при копировании. Скопируйте email вручную.';
        statusElement.className = 'status-message error';
    });
}

function goToWebsite(type) {
    const url = type === 'firstmail' ? 'https://firstmail.ltd/ru-RU/webmail' : 'https://outlook.com';
    window.open(url, '_blank');
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        return false;
    }
}

function toggleDateTime() {
    const datetimeContainer = document.getElementById('datetimeContainer');
    datetimeContainer.classList.toggle('hidden', document.getElementById('statusSelect').value !== 'BANNED');
}

function generateLog() {
    const dataInput = document.getElementById('dataInput').value;
    const platform = document.getElementById('platformSelect').value;
    const prefix = document.getElementById('prefixInput').value || 'E/T';
    const status = document.getElementById('statusSelect').value;
    
    if (!dataInput) {
        alert('Введите данные в формате email:password,name');
        return;
    }
    
    let logEntry = `${platform}|${prefix}|${dataInput}`;
    
    if (status) {
        logEntry += `|${status}`;
        
        if (status === 'BANNED') {
            const dateInput = document.getElementById('dateInput').value;
            const timeInput = document.getElementById('timeInput').value;
            
            if (dateInput && timeInput) {
                const date = new Date(`${dateInput}T${timeInput}`);
                const formattedDate = date.toLocaleDateString('ru-RU');
                const formattedTime = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                
                logEntry += `|${formattedDate} ${formattedTime}`;
            }
        }
    }
    
    document.getElementById('logResult').textContent = logEntry;
}

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
