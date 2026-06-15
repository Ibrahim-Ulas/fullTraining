import { request , showMessage, hideMessage} from "./common.js"


document.getElementById('toRegisterLink').addEventListener('click', () => {
    const loginFormSection = document.getElementById('loginFormSection')
    const registerFormSection = document.getElementById('registerFormSection')
    loginFormSection.classList.add('hidden');
    registerFormSection.classList.remove('hidden');
    hideMessage("msgBox");
});

document.getElementById('toLoginLink').addEventListener('click', () => {
    const loginFormSection = document.getElementById('loginFormSection')
    const registerFormSection = document.getElementById('registerFormSection')
    registerFormSection.classList.add('hidden');
    loginFormSection.classList.remove('hidden');
    hideMessage("msgBox");
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    createUser();
})

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    userLogin();
})

document.getElementById('registerEmail').addEventListener('blur', async () => {
    hideMessage("msgBox");
    await checkEmailExists();
})

async function createUser() {
    const userEmail = document.getElementById('registerEmail');
    const userPassword = document.getElementById('registerPassword');
    const userPasswordConfirm = document.getElementById('registerPasswordConfirm');
    const userExists = await checkEmailExists();
    console.log(userExists)
    hideMessage("msgBox");
    if(userEmail.value === "") {
        showMessage("msgBox", "E-posta boş bırakılamaz", "error");
        return;
    }
    if(userExists) {
        showMessage("msgBox", "Girdiğiniz posta kayıtlı", "error");
        return;
    }
    if (!checkPassword(userPassword.value, userPasswordConfirm.value)) {
        return;
    }

    const response = await request("http://127.0.0.1:8000/user-olustur", "POST", {email: userEmail.value, password: userPassword.value})

    hideMessage("msgBox");
    showMessage("msgBox", "Kullanıcı başarıyla oluşturuldu!", "success");
    window.location.href = "http://localhost:5173/login.html"
}

async function userLogin() {
    const userEmail = document.getElementById('loginEmail');
    const userPassword = document.getElementById('loginPassword');
    try {
        const response = await request("http://127.0.0.1:8000/user-giris", "POST", {email: userEmail.value, password: userPassword.value})
        window.location.href = "http://localhost:5173/"
    } catch (error) {
        hideMessage("msgBox");
        showMessage("msgBox",error.message, "error");
    }
}

async function checkEmailExists() {
    const userEmail = document.getElementById('registerEmail');
    try {
        const response = await request("http://127.0.0.1:8000/user-e-posta-kontrol", "POST", {email: userEmail.value})
        return false;
    } catch(error) {
        hideMessage("msgBox");
        showMessage("msgBox",error.message, "error");
        return true;
    }
}

function checkPassword(password, passwordConfirm) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        console.log(`password: ${password} confirm: ${passwordConfirm}`)
        if(password !== passwordConfirm) {
            hideMessage("msgBox");
            showMessage("msgBox", "Şifreler eşleşmeli", "error");
            return false;
        }
        if(!regex.test(password)) {
            hideMessage("msgBox");
            showMessage("msgBox", "Şifreniz 8 karakter, en az bir küçük ve büyük harf, bir rakam ve bir özel karakter içermelidir!", "error");
            return false;
        }
        return true;
}