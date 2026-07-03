/*
browserWarn v4.0
Updated: 11/24/2020
Uses js to check for IE 11 and below
*/

((function() {

    var browsertest = window.location.href.indexOf('browsertest=true') >= 0;
    if (browsertest) {
        enableFBranchBrowserWarning();
    }

    function isIE() {
        const ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
        const msie = ua.indexOf('MSIE '); // IE 10 or older
        const trident = ua.indexOf('Trident/'); //IE 11

        return (msie > 0 || trident > 0);
    }

    if (isIE()) {
        if (!document.cookie.match(/^(.*;)?\s*ieWarn\s*=\s*[^;]+(.*)?$/)) {
            enableFBranchBrowserWarning();
        } else {
            console.log("cookie set");
        }
    }

    function enableFBranchBrowserWarning() {
        _body = document.getElementsByTagName('body')[0];
        setBrowserWarnCookie('ieWarn', 'true', 1);
        var _d = '<div id="fbranch-browserwarn-v3-blackout" style="width:100%;height:100%;overflow:hidden;position:fixed;top:0;left:0;background:rgba(0,0,0,.75);z-index:9998"></div><div id="fbranch-browserwarn-v3" style="width:640px;height:410px;position:absolute;top:200px;left:50%;margin-left:-320px;padding:50px 20px 0;background:#fff url(/custom/fed-library/production/browserwarn/v4/top_bg.png) 20px 20px no-repeat;border:1px solid #666;font-family:Arial,Verdana,sans-serif;list-style-type:none;color:#4f4f4f;font-size:14px;z-index:9999;overflow:hidden;box-sizing:content-box"><div class="fbranch-browserwarn-v3-closeButton" id="fbranch-browserwarn-v3-closeButton" aria-label="close" style="position:absolute;top:15px;right:15px;padding:0 4px;background:#fff;border:1px solid #000;font-family:Verdana,Geneva,sans-serif;color:#000;font-size:16px;font-weight:700;text-align:center;cursor:pointer">X</div><div class="fbranch-browserwarn-v3-h" style="font-size:37px;line-height:40px;font-weight:400;color:#555;font-family:Verdana,Geneva,sans-serif;width:auto;padding:0 20px 0 300px">IT\'S TIME FOR AN UPGRADE!</div><div class="fbranch-browserwarn-v3-p" style="padding:0 20px 0 300px;color:#222;font-size:19px;line-height:1.25em;margin:20px 0;text-align:left;width:auto">Upgrade your browser now to greatly improve the look and feel of the websites you browse regularly, like this one.</div><div class="fbranch-browserwarn-v3-p2" style="text-align:center;clear:left;color:#3498db;font-size:15px;padding:40px 0 20px">Pick your favorite browser to get started:</div><div class="fbranch-browserwarn-v3-list" style="text-align:center"><a class="fbranch-browserwarn-v3-chrome" href="https://www.google.com/chrome/browser/desktop/index.html" title="Google Chrome" style="display:inline-block;vertical-align:middle;height:100px;width:100px;padding-top:70px;text-align:center;font-size:15px;color:#3498db;background:url(/custom/fed-library/production/browserwarn/v4/browsers.png) 0 0 no-repeat">Chrome</a> <a class="fbranch-browserwarn-v3-ff" href="https://www.mozilla.org/en-US/firefox/" title="Mozilla Firefox" style="display:inline-block;vertical-align:middle;height:100px;width:100px;padding-top:70px;text-align:center;font-size:15px;color:#3498db;background:url(/custom/fed-library/production/browserwarn/v4/browsers.png) 0 0 no-repeat;background-position:-100px 0!important">Firefox</a> <a class="fbranch-browserwarn-v3-safari" href="https://support.apple.com/downloads/safari" title="Apple Safari" style="display:inline-block;vertical-align:middle;height:100px;width:100px;padding-top:70px;text-align:center;font-size:15px;color:#3498db;background:url(/custom/fed-library/production/browserwarn/v4/browsers.png) 0 0 no-repeat;background-position:-200px 0!important">Safari</a> <a class="fbranch-browserwarn-v3-edge" href="https://support.microsoft.com/en-us/microsoft-edge" title="Edge" style="display:inline-block;vertical-align:middle;height:100px;width:100px;padding-top:70px;text-align:center;font-size:15px;color:#3498db;background:url(/custom/fed-library/production/browserwarn/v4/browsers.png) 0 0 no-repeat;background-position:-300px 0!important">MS Edge</a></div></div>';
        _body.insertAdjacentHTML('beforeend', _d);
        var _closeButtond = document.getElementById("fbranch-browserwarn-v3-closeButton");
        var _blackoutDiv = document.getElementById("fbranch-browserwarn-v3-blackout");
        var _fbElem = document.getElementById("fbranch-browserwarn-v3")
        _closeButtond.onclick = _blackoutDiv.onclick = function() {
            _fbElem.parentNode.removeChild(_fbElem);
            _blackoutDiv.parentNode.removeChild(_blackoutDiv);
        }
    }

    function setBrowserWarnCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

})());