(() => {
    var getParameterByName = function(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };

    var isKidsTag = "kids" === getParameterByName("tag");

    var SDK = new (function() {
        var self = this;

        this.queue = [];

        this.init = function(options) {
            return new Promise(function(resolve, reject) {
                self.enqueue("init", options, resolve, reject);
            });
        };

        this.rewardedBreak = function() {
            return new Promise(function(resolve) {
                // Grant rewards immediately without checking for ad views
                resolve(true);
            });
        };

        this.noArguments = function(name) {
            return function() {
                self.enqueue(name);
            };
        };

        this.oneArgument = function(name) {
            return function(arg) {
                self.enqueue(name, arg);
            };
        };

        this.handleAutoResolvePromise = function() {
            return new Promise(function(resolve) {
                resolve();
            });
        };

        this.handleAutoResolvePromiseObj = function() {
            return new Promise(function(resolve) {
                resolve();
            });
        };

        this.throwNotLoaded = function() {
            console.debug("PokiSDK is not loaded yet. Not all methods are available.");
        };
    })();

    window.PokiSDK = {
        init: SDK.init,
        initWithVideoHB: SDK.init,
        customEvent: SDK.throwNotLoaded,
        destroyAd: SDK.throwNotLoaded,
        getLeaderboard: SDK.handleAutoResolvePromiseObj
    };

    ["disableProgrammatic", "gameLoadingStart", "gameLoadingFinished", "gameInteractive", "roundStart", "roundEnd", "muteAd"].forEach(function(name) {
        window.PokiSDK[name] = SDK.noArguments(name);
    });

    ["setDebug", "gameplayStart", "gameplayStop", "gameLoadingProgress", "happyTime", "setPlayerAge", "togglePlayerAdvertisingConsent", "toggleNonPersonalized", "setConsentString", "logError", "sendHighscore", "setDebugTouchOverlayController"].forEach(function(name) {
        window.PokiSDK[name] = SDK.oneArgument(name);
    });

    var sdkVersion = window.pokiSDKVersion || getParameterByName("ab") || "v2.234.2";
    var scriptSrc = "poki-sdk-" + (isKidsTag ? "kids" : "core") + "-" + sdkVersion + ".js";
    var scriptElement = document.createElement("script");

    scriptElement.setAttribute("src", scriptSrc);
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("crossOrigin", "anonymous");
    scriptElement.onload = function() {
        return SDK.dequeue();
    };

    document.head.appendChild(scriptElement);
})();
