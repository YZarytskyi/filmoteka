import {refs} from './refs'

const {btnToUp} = refs;

let scroll;
document.body.addEventListener('scroll', function( event ) {
  scroll = document.body.scrollTop;
  btnToUp.classList.add('is-hidden');
  if (scroll > 900) {
    btnToUp.classList.remove('is-hidden');
  }
});