// var btnToggleClass = document.getElementsByClassName('btn-toggle');

// function listenToggle() {
//   Array.from(btnToggleClass).forEach(function(element) {
//     element.addEventListener('click', function() {
//       var targetId = element.getAttribute('data-target');
//       var targetEl = document.getElementById(targetId);
//       var iconEl = element.querySelector('.icon');

//       targetEl.classList.toggle('portfolio-hidden');
//       iconEl.classList.toggle('icon-rotate');
//     });
//   });
// };

function loadGtag() {
  var gtagm = document.createElement('script');
  gtagm.src = 'https://www.googletagmanager.com/gtag/js?id=G-8BLXZ1QYMW';
  document.body.appendChild(gtagm);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8BLXZ1QYMW');
};

function inject3rd() {
  // Defer loading 3rd script by inject after page finish
  loadGtag();
};

function deferLoad() {
  if (window.addEventListener) {
    window.addEventListener('load', inject3rd, false);
  } else if (window.attachEvent) {
    window.attachEvent('onload', inject3rd);
  } else {
    window.onload = inject3rd;
  }
};

// listenToggle();
deferLoad();
