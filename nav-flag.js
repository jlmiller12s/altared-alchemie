(function(){
  var env = window.__ENV || {};
  function createInquiryLink(mobile){
    var a = document.createElement('a');
    a.href = '/inquiry.html';
    a.textContent = 'Submit an Inquiry';
    if (location.pathname.replace(/\/$/, '') === '/inquiry') {
      a.setAttribute('aria-current', 'page');
    }
    a.className = mobile
      ? 'block py-2 text-white/80 hover:text-white'
      : 'px-3 py-2 text-sm font-semibold text-white hover:text-white glow-hover';
    return a;
  }
  function injectInquiry(header){
    if(!header || header.querySelector('a[href="/inquiry.html"]')) return;

    var desktopTarget = header.querySelector('a[href="/contact.html#schedule"], a[href="#schedule"]');
    var desktopContainer = desktopTarget && desktopTarget.parentElement;
    var headerInner = header.firstElementChild;
    if(desktopTarget && desktopContainer){
      if(!desktopContainer.className.includes('flex') || desktopContainer === headerInner){
        var wrapper = document.createElement('div');
        wrapper.className = 'hidden md:flex items-center gap-3';
        desktopTarget.classList.remove('hidden', 'md:inline-block');
        desktopContainer.insertBefore(wrapper, desktopTarget);
        wrapper.appendChild(createInquiryLink(false));
        wrapper.appendChild(desktopTarget);
      } else {
        desktopContainer.insertBefore(createInquiryLink(false), desktopTarget);
      }
    } else {
      var fallbackContainer = header.querySelector('div.hidden.md\\:flex.items-center.gap-3, div.flex.items-center.gap-3');
      if(fallbackContainer){
        fallbackContainer.insertBefore(createInquiryLink(false), fallbackContainer.firstChild);
      }
    }
  }
  function injectInquiryMobile(){
    var mobile = document.getElementById('mobileMenu');
    var mobileNav = mobile && mobile.querySelector('nav');
    if(mobileNav && !mobileNav.querySelector('a[href="/inquiry.html"]')){
      mobileNav.appendChild(createInquiryLink(true));
    }
  }
  document.querySelectorAll('header').forEach(injectInquiry);
  injectInquiryMobile();

  if(!env.FEATURE_LEGACY_AVATAR_NAV){ return; }
  function injectLegacy(container){
    if(!container) return;
    var a = document.createElement('a');
    a.href = '/legacy-avatar/';
    a.textContent = 'Legacy Avatar';
    a.className = 'hover:text-white glow-hover';
    container.appendChild(a);
  }
  // desktop navs
  document.querySelectorAll('nav.hidden.md\\:flex, nav[aria-label="Main"].hidden.md\\:flex').forEach(injectLegacy);
  // mobile menus
  var mobile = document.getElementById('mobileMenu');
  if(mobile){ injectLegacy(mobile.querySelector('nav')); }
})();

