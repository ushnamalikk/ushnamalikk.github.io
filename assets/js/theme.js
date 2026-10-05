(function(){
  var KEY="theme";
  function read(){try{return localStorage.getItem(KEY)||"system";}catch(e){return "system";}}
  function write(v){try{localStorage.setItem(KEY,v);}catch(e){}}
  function computed(){var s=read();if(s==="system"){try{return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}catch(e){return "light";}}return s;}
  function apply(){document.documentElement.setAttribute("data-theme-setting",read());document.documentElement.setAttribute("data-theme",computed());}
  window.toggleTheme=function(){write(computed()==="dark"?"light":"dark");apply();};
  apply();
  try{window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",apply);}catch(e){}
  document.addEventListener("DOMContentLoaded",function(){var b=document.getElementById("light-toggle");if(b){b.addEventListener("click",window.toggleTheme);}});
})();
