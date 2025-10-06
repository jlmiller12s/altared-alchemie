(function(){
  function track(label){
    try{
      if(window.analytics && typeof window.analytics.track==='function'){
        window.analytics.track(label);
      } else {
        console.debug('[track]', label);
      }
    }catch(e){/* no-op */}
  }
  document.addEventListener('click', function(ev){
    var t = ev.target.closest('[data-track]');
    if(!t) return;
    var label = t.getAttribute('data-track');
    if(label) track(label);
  });
})();

