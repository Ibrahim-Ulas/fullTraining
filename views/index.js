import { request } from "./common.js"
userCheckAuth();
document.addEventListener('DOMContentLoaded', async () => {
    await getBlogs()
})

async function addBlog() {
    const postTitle = document.getElementById('postTitle');
    const postBody = document.getElementById('postBody');
    const submitBtn = document.getElementById('submitBtn');

    if (postBody.value === "" || postTitle.value === "") {
        showErrorMsg("Tüm alanları doldurunuz.");
        return;
    }

    hideResultAndErrorMessage();
    changeButtonDisabled(true)
    submitBtn.textContent = "Yayınlanıyor..."

    const data = await request("http://127.0.0.1:8000/blog-olustur", "POST", {title: postTitle.value, body: postBody.value});
    
    if (data.status !== "success") {
        showErrorMsg("Blog oluşturulamadı!");
        return;
    }
    if (data) {
    clearInputs()
    showResultContainer("Makale Başarıyle Yüklendi!")
    }
    submitBtn.textContent = "Yayınla";
    changeButtonDisabled(false);
}

async function updateBlog(id) {
    const postTitle = document.getElementById('postTitle');
    const postBody = document.getElementById('postBody');
    const updateBtn = document.getElementById('updateBtn');

    if (postBody.value === "" || postTitle.value === "") {
        showErrorMsg("Tüm alanları doldurunuz.")
        return;
    }

    hideResultAndErrorMessage();
    changeButtonDisabled(true)
    updateBtn.textContent = "Güncelleniyor...";

    const data = await request(`http://127.0.0.1:8000/blog-guncelle?post_id=${id}`, "PUT", { title: postTitle.value, body: postBody.value});
    if (data.status !== "success") {
        showErrorMsg("Blog Güncellenemedi");
        return;
    }
    clearInputs()
    showResultContainer("Makale Başarıyla Güncellendi!")
    updateBtn.textContent = "Güncelle";
    changeButtonDisabled(false);
}

async function deleteBlog(id) {
    if(!id) {
        showErrorMsg("Lütfen silinecek bir makale seçin!")
    }
    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.textContent = "Siliniyor...";

    const data = await request(`http://127.0.0.1:8000/blog-sil?post_id=${id}`, "DELETE");

    if(data) {
    clearInputs();
    showResultContainer("Makale başarıyla silindi!");
    }
    deleteBtn.textContent = "Sil";
    changeButtonDisabled(false);
}

async function getBlogs() {
    const blogList = document.getElementById('blogList');
    const blogDiv = document.getElementById('blogDiv')
    if (blogList.innerHTML !== "") blogList.innerHTML = "";
   

    const data = await request("http://127.0.0.1:8000/blog-tumugoruntule", "GET");

    for (const blog of data) {
        const listItem = document.createElement("li")
        const listSpan = document.createElement("span")
        const selectButton = document.createElement("button")

        listSpan.textContent = blog.title
        selectButton.dataset.id = blog.id
        selectButton.className = "view-btn"
        selectButton.textContent = "Blog Seç"

        listItem.appendChild(listSpan)
        listItem.appendChild(selectButton)
        blogList.appendChild(listItem)
    }

    changeButtonDisabled(false)
}

async function getSingleBlog(id) {
    const postTitle = document.getElementById('postTitle');
    const postBody = document.getElementById('postBody');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    const data = await request(`http://127.0.0.1:8000/blog-goruntule?post_id=${id}`, "GET");

    postTitle.value = data.title
    postBody.value = data.body
    updateBtn.dataset.id = id
    deleteBtn.dataset.id = id
    changeButtonDisabled(false)
}

async function userLogout() {
    const response = await request("http://127.0.0.1:8000/user-cikis", "POST")
    if(response.status === "success"){
        window.location.href = "http://localhost:5173/login.html"
    }
}

async function userCheckAuth() {
    const app = document.getElementById("app")
    try {
        const response = await fetch("http://127.0.0.1:8000/user-check-auth", {method:"GET", credentials: "include"});

        if(response.status === 401) {
            window.location.href="http://localhost:5173/login.html"
            return;
        }
        app.style.display = "block";
    } catch (error) {
        window.location.href = "http://localhost:5173/login.html"
    }
}

function changeButtonDisabled(bool) {
    const submitBtn = document.getElementById('submitBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    updateBtn.disabled = bool;
    submitBtn.disabled = bool
    deleteBtn.disabled = bool;
}

function hideResultAndErrorMessage() {
    const errorMsg = document.getElementById('errorMsg');
    const resultContainer = document.getElementById('resultContainer');

    errorMsg.style.display = "none";
    resultContainer.style.display = "none";
}

function showResultContainer(message) {
    const resultContainer = document.getElementById('resultContainer');
    const errorMsg = document.getElementById('errorMsg');

    resultContainer.style.display = "block";
    resultContainer.textContent = message;
    errorMsg.style.display = "none"
}

function showErrorMsg(message) {
    const resultContainer = document.getElementById('resultContainer');
    const errorMsg = document.getElementById('errorMsg');

    resultContainer.style.display = "none";
    errorMsg.style.display = "block";
    errorMsg.textContent = message;
}

function clearInputs() {
    const postBody = document.getElementById('postBody');
    const postTitle = document.getElementById('postTitle');

    postBody.value = ""
    postTitle.value = ""
}

document.getElementById('submitBtn').addEventListener('click', async () => {
    await addBlog()
    getBlogs()
})

document.getElementById('updateBtn').addEventListener('click', async (e) => {
    await updateBlog(e.target.dataset.id)
    getBlogs()
})

document.getElementById('deleteBtn').addEventListener('click', async (e) => {
    await deleteBlog(e.target.dataset.id)
    getBlogs()
})

document.getElementById('blogList').addEventListener('click', (e) => {
    if (e.target.classList.contains('view-btn')) {
        const blogId = e.target.dataset.id
        getSingleBlog(blogId);
    }
})

document.getElementById('logout').addEventListener('click', async () => {
    await userLogout();
})

