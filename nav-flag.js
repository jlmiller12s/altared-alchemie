(function(){
  var env = window.__ENV || {};
  if(!env.FEATURE_LEGACY_AVATAR_NAV){ return; }
  function inject(container){
    if(!container) return;
    var a = document.createElement('a');
    a.href = '/legacy-avatar/';
    a.textContent = 'Legacy Avatar';
    a.className = 'hover:text-white glow-hover';
    container.appendChild(a);
  }
  // desktop navs
  document.querySelectorAll('nav.hidden.md\\:flex, nav[aria-label="Main"].hidden.md\\:flex').forEach(inject);
  // mobile menus
  var mobile = document.getElementById('mobileMenu');
  if(mobile){ inject(mobile.querySelector('nav')); }
})();

