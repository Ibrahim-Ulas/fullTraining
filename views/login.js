import { request } from "./common.js"


document.getElementById('toRegisterLink').addEventListener('click', () => {
    const loginFormSection = document.getElementById('loginFormSection')
    const registerFormSection = document.getElementById('registerFormSection')
    loginFormSection.classList.add('hidden');
    registerFormSection.classList.remove('hidden');
    hideMessage();
});

document.getElementById('toLoginLink').addEventListener('click', () => {
    const loginFormSection = document.getElementById('loginFormSection')
    const registerFormSection = document.getElementById('registerFormSection')
    registerFormSection.classList.add('hidden');
    loginFormSection.classList.remove('hidden');
    hideMessage();
});

document.getElementById('registerBtn').addEventListener('click', () => {
    createUser();
})
// Mesaj Gösterme Yardımcı Fonksiyonları
function showMessage(text, type) {
    const msgBox = document.getElementById('msgBox');
    msgBox.style.display = 'block';
    msgBox.textContent = text;
    msgBox.className = `message-box ${type}`; // success veya error sınıfını ekler
}

function hideMessage() {
    const msgBox = document.getElementById('msgBox');
    msgBox.style.display = 'none';
    msgBox.textContent = '';
}

async function createUser() {
    const userEmail = document.getElementById('registerEmail');
    const userPassword = document.getElementById('registerPassword');

    const response = await request("http://127.0.0.1:8000/user-olustur", "POST", {email: userEmail.value, password: userPassword.value})

    if(!response.ok) {
        throw new Error(`API responded with: ${response.status}`);
    }
    hideMessage();
    showMessage("Kullanıcı başarıyla oluşturuldu!", "success");
}
