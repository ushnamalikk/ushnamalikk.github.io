(function(){
  var KEY="theme";
  function setting(){return localStorage.getItem(KEY)||"system";}
  function computed(){var s=setting();if(s==="system"){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}return s;}
  function apply(){document.documentElement.setAttribute("data-theme-setting",setting());document.documentElement.setAttribute("data-theme",computed());}
  window.toggleTheme=function(){localStorage.setItem(KEY,computed()==="dark"?"light":"dark");apply();};
  apply();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",apply);
  document.addEventListener("DOMContentLoaded",function(){var b=document.getElementById("light-toggle");if(b){b.addEventListener("click",window.toggleTheme);}});
})();