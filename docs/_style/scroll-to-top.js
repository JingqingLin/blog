var CONFIG = {
    auto: true,
    right: 15,
    bottom: 15,
    offset: 500
};
var install = function (hook, vm) {
    var opts = vm.config.scrollToTop || CONFIG;
    CONFIG.auto = opts.auto && typeof opts.auto === "boolean" ? opts.auto : CONFIG.auto;
    CONFIG.right = opts.right && typeof opts.right === "number" ? opts.right : CONFIG.right;
    CONFIG.bottom = opts.bottom && typeof opts.bottom === "number" ? opts.bottom : CONFIG.bottom;
    CONFIG.offset = opts.offset && typeof opts.offset === "number" ? opts.offset : CONFIG.offset;
    var onScroll = function (e) {
        if (!CONFIG.auto) {
            return
        }
        var offset = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        CONFIG.offset <= offset ? $(".scroll-to-top").fadeIn() : $(".scroll-to-top").fadeOut()
    };
    hook.mounted(function () {
        var scrollBtn = document.createElement("span");
        scrollBtn.className = "scroll-to-top";
        scrollBtn.title = "回到顶部"
        scrollBtn.style.display = CONFIG.auto ? "none" : "block";
        scrollBtn.style.overflow = "hidden";
        scrollBtn.style.position = "fixed";
        scrollBtn.style.right = CONFIG.right + "px";
        scrollBtn.style.bottom = CONFIG.bottom + "px";
        scrollBtn.style.width = "40px";
        scrollBtn.style.height = "40px";
        // let prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // if (prefersDarkMode) {
        //     scrollBtn.style.background = "#3f3f3f";
        //     scrollBtn.style.boxShadow = "1px 1px 5px #444";
        // } else {
        //     scrollBtn.style.background = "white";
        //     scrollBtn.style.boxShadow = "1px 1px 5px #ccc";
        // }
        scrollBtn.style.color = "#42b983";
        scrollBtn.style.borderRadius = "50%";
        scrollBtn.style.lineHeight = "50px";
        scrollBtn.style.textAlign = "center";
        scrollBtn.style.cursor = "pointer";
        var arrowNode = document.createElement("span");
        arrowNode.className = "up-arrow";
        arrowNode.style.display = "inline-block";
        arrowNode.style.width = "15px";
        arrowNode.style.height = "15px";
        arrowNode.style.top = "20px"
        arrowNode.style.borderTop = "2px solid";
        arrowNode.style.borderLeft = "2px solid";
        arrowNode.style.transform = "rotate(45deg)";
        scrollBtn.appendChild(arrowNode);
        document.body.appendChild(scrollBtn);
        window.addEventListener("scroll", onScroll);
        scrollBtn.onclick = function (e) {
            e.stopPropagation();
            $("html,body").animate({ scrollTop: 0 }, 800);
        }
    })
};
$docsify.plugins = [].concat(install, $docsify.plugins);