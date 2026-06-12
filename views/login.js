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

document.getElementById('loginBtn').addEventListener('click', (e) => {
    userLogin();
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

    hideMessage();
    showMessage("Kullanıcı başarıyla oluşturuldu!", "success");
}

async function userLogin() {
    const userEmail = document.getElementById('loginEmail');
    const userPassword = document.getElementById('loginPassword');

    const response = await request("http://127.0.0.1:8000/user-giris", "POST", {email: userEmail.value, password: userPassword.value})
    console.log(response)
    if (response.status === "success"){
        window.location.href = "http://localhost:5173/";
    } else {
        hideMessage();
        showMessage("Token alınamadı", "error");
    }
}