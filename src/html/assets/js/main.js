


function addBg(elem){
  var bg = document.querySelectorAll(elem), blend, bgcolor, bgop;
  for (var i = 0; i < bg.length; i++) {

    if(bg[i].dataset.bgBlend) {
      blend = bg[i].dataset.bgBlend;
    }
    if(bg[i].dataset.bgColor) {
      bgcolor = bg[i].dataset.bgColor;
    }
    if(bg[i].dataset.bgOpacity) {
      bgop = bg[i].dataset.bgOpacity;
    }

    if(bg[i].classList.contains('parallax')) {
      var pElem = document.createElement('div');
      pElem.setAttribute('class','parallaxing')
      pElem.style.backgroundImage = "url(" + bg[i].dataset.bgSrc + ")";
      if(blend) {
        pElem.style.backgroundColor = bgcolor;
        pElem.style.backgroundBlendMode = blend;
        pElem.style.webkitBackgroundBlendMode = blend;
        pElem.style.opacity = bgop;
      }
      bg[i].insertBefore(pElem, bg[i].firstChild);
    } else {
      bg[i].style.backgroundImage = "url(" + bg[i].dataset.bgSrc + ")";
      if(blend) {
        bg[i].style.backgroundColor = bgcolor;
        bg[i].style.backgroundBlendMode = blend;
        bg[i].style.webkitBackgroundBlendMode = blend;
      }
    }
  };


  function updateScroll() {
    var st = scrollY();
    var parallax = document.querySelectorAll('.parallaxing');

    if(parallax.length > 0) {
      var rect = parallax[0].getBoundingClientRect();
      var pos = document.body.scrollTop;
      var translateY = st*.5,
          translateX = 0,
          scale = 1, 
          opacity = 1,
          viewed = st + getViewportH();

      for (var i = 0; i < parallax.length; i++) {
        if(inViewport(parallax[i])){
          var factor = 0.55;
          var variable = (getViewportH() - parallax[i].offsetHeight) * factor;
          translateY = (viewed - getOffset(parallax[i]).top - parallax[i].offsetHeight)* factor - variable;
          parallax[i].style.WebkitTransform = 'translate3d(' + translateX +'px, ' +   translateY + 'px, 0) scale('+ scale +')';
          parallax[i].style.transform = 'translate3d(' + translateX +'px, ' +   translateY + 'px, 0) scale('+ scale +')';
        }
      }; // for
    
    } // if

  } // onscroll

  window.addEventListener( 'scroll', updateScroll );

}


function loader(){
  var loader = document.getElementById('loading');
  if(loader) {
    // loader.style.display = "block";
    function removeLoader(){
      loader.classList.add('loaded');
      setTimeout(function(){
        document.body.removeChild(loader);
      },700);
    }
    var rl = setTimeout(removeLoader,2000);
    loader.addEventListener('click', function(){
      clearTimeout(rl);
      removeLoader();
    });
  }
}



      













// Utility functions


function testColor(str) {
  var dummy = document.createElement('div');
  dummy.style.color = str;

  // Is the syntax valid?
  if (!dummy.style.color) { return null; }
      
  document.head.appendChild(dummy);
  var normalized = getComputedStyle(dummy).color;
  document.head.removeChild(dummy);
  
  if (!normalized) { return null; }
  var rgb = normalized.match(/\((\d+), (\d+), (\d+)/);
  
  return normalized; // for testing purposes
}

function SelectText(element) {
  var doc = document
      , text = element
      , range, selection
  ;    
  if (doc.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
      /*
      if(range.toString().length === 0){
        range.moveToElementText(text);
        range.select();
      }
      */
  } else if (window.getSelection) {
      selection = window.getSelection();
      if(selection.toString().length === 0){
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
      }
  }
}

var docElem = window.document.documentElement;

function getViewportH() {
  var client = docElem['clientHeight'],
  inner = window['innerHeight'];
  
  if( client < inner ) {
    return inner; 
  } else {
    return client;
  }
}

function scrollY() {
  return window.pageYOffset || docElem.scrollTop;
}

function getOffset( el ) {
  var offsetTop = 0, offsetLeft = 0;
  do {
    if ( !isNaN( el.offsetTop ) ) {
     offsetTop += el.offsetTop;
    }
    if ( !isNaN( el.offsetLeft ) ) {
     offsetLeft += el.offsetLeft;
    }
    } while( el = el.offsetParent )

    return {
    top : offsetTop,
    left : offsetLeft
  }
}

function inViewport( el, h ) {
  var elH = el.offsetHeight,
    scrolled = scrollY(),
    viewed = scrolled + getViewportH(),
    elTop = getOffset(el).top,
    elBottom = elTop + elH,
    h = h || 0;
    return (elTop + elH * h) <= viewed && (elBottom - elH * h) >= scrolled;
}




