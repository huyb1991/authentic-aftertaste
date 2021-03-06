var btnRecipeSection = document.getElementsByClassName('recipe-section');
var btnRecipeItem = document.getElementsByClassName('recipe-item');

function listenToggle() {
  // Toggle to expand/collapse section content
  Array.from(btnRecipeSection).forEach(function(element) {
    element.addEventListener('click', function() {
      var targetId = element.getAttribute('data-target');
      var targetEl = document.getElementById(targetId);
      var iconEl = element.querySelector('.recipe-section-icon');
      var toggleClass = 'collapse';

      // Toggle class
      iconEl.classList.toggle(toggleClass);
      targetEl.classList.toggle(toggleClass);

      // Set/remove max height based on toggleClass
      if (targetEl.classList.contains(toggleClass)){
        targetEl.style.maxHeight = 0;
      } else {
        targetEl.style.maxHeight = targetEl.scrollHeight + 'px';
      }
    });
  });

  // Toggle to mark done on checkbox list
  Array.from(btnRecipeItem).forEach(function(element) {
    element.addEventListener('click', function() {
      var checkboxEl = element.querySelector('.recipe-checkbox');
      var labelEl = element.querySelector('.recipe-label');
      var toggleClass = 'done';

      checkboxEl.classList.toggle(toggleClass);
      labelEl.classList.toggle(toggleClass);
    });
  });
};

function loadGtag() {
  var gTag = document.createElement('script');
  gTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-8BLXZ1QYMW';
  document.body.appendChild(gTag);

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

listenToggle();
deferLoad();
