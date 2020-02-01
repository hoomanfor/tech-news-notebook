
function classToggle() {
    const navs = document.querySelectorAll('.nav-items')
    navs.forEach(nav => nav.classList.toggle('toggle-show'));
}

document.querySelector('.toggle').addEventListener('click', classToggle);

