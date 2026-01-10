
//Obteniendo elementos del DOM
const hamburgerBtn = document.getElementById('hamburgerBtnMobile');
const mobileNav = document.getElementById('mobileMenu');
//Función para alternar la visibilidad del menú móvil
function toggleMobileNav() {
    hamburgerBtn.classList.remove('fa-bars');
    hamburgerBtn.classList.add('fa-xmark');
    document.body.classList.toggle('no-scroll');
    if (mobileNav.classList.contains('active')) {
        hamburgerBtn.classList.remove('fa-xmark');
        hamburgerBtn.classList.add('fa-bars');
        document.body.classList.remove('no-scroll');
    }
    mobileNav.classList.toggle('active');
}
document.addEventListener("DOMContentLoaded",(e)=>{
    e.preventDefault();
    mobileNav.addEventListener('click',(e)=>{
        mobileNav.classList.remove('active');
        hamburgerBtn.classList.remove('fa-xmark');
        hamburgerBtn.classList.add('fa-bars');
        document.body.classList.remove('no-scroll');
    })
})