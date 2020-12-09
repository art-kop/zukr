let mainHeaderHeight = document.querySelector('.main__header').offsetHeight;
let headerHeight = document.querySelector('.header').offsetHeight;

window.addEventListener('scroll', function(){
    let scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if(scrolled < mainHeaderHeight - headerHeight * 4){
        document.querySelector('.header').classList.add('header--top');
        document.querySelector('.logo').classList.add('logo--top');
    } else{
        document.querySelector('.header').classList.remove('header--top');
        document.querySelector('.logo').classList.remove('logo--top');
    }
});