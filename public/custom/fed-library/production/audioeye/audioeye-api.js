function audioEyeHashID(hashID) {
    //var hash = "";
    var b = function() {
        window.__AudioEyeSiteHash = hashID;
        var a = document.createElement("script");
        a.src = "https://wsmcdn.audioeye.com/aem.js";
        a.type = "text/javascript";
        a.setAttribute("async", "");
        document.getElementsByTagName("body")[0].appendChild(a)
    };
    "complete" !== document.readyState ? window.addEventListener ? window.addEventListener("load", b) : window.attachEvent && window.attachEvent("onload", b) : b();
    console.log('AudioEye loaded');
};