document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".container");
    const registerBtn = document.querySelector(".register-btn");
    const loginBtn = document.querySelector(".login-btn");
    const loginForm = document.querySelector(".form-box.login form");
    const registerForm = document.querySelector(".form-box.register form");

    // Alternar entre Login y Register
    registerBtn.addEventListener("click", () => {
        container.classList.add("active"); // Mostrar sección de registro
        console.log("Switched to register section:", container.className);
    });

    loginBtn.addEventListener("click", () => {
        container.classList.remove("active"); // Mostrar sección de login
        console.log("Switched to login section:", container.className);
    });

    // Capturar el formulario de login
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Iniciando sesión...");
        setTimeout(() => {
            window.location.href = "catalogo.html";
        }, 1000);
    });

    // Capturar el formulario de registro
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Registrando usuario...");
        setTimeout(() => {
            window.location.href = "catalogo.html";
        }, 1000);
    });
});
