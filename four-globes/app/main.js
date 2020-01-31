var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./WebSceneManager"], function (require, exports, WebSceneManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebSceneManager_1 = __importDefault(WebSceneManager_1);
    function App() {
        var options = {
            snap: 45,
            clockwise: true,
            startPos: "top",
        };
        //   var slider = new Slider("slider", options);
        var targetDiv = document.getElementById("angle");
        //   slider.on("sliderMove", (angle) => {
        //     targetDiv.textContent = angle + "°";
        //     websceneManager.changeHue(angle);
        //   });
        var websceneManager = new WebSceneManager_1.default();
        websceneManager.createScene(["#FAA732", "#DE1770", "#5EADE1"], "view1");
        websceneManager.createScene(["#7F2C85", "#F8EB35", "#AE1B2A"], "view2");
        websceneManager.createScene(["#1FB8B5", "#EAECAA", "#612F91"], "view3");
        websceneManager.createScene(["#E2242D", "#106BAC", "#E5922B"], "view4");
        document.getElementById("rotate").addEventListener("click", function () {
            websceneManager.rotate();
        });
        websceneManager.onFinishLoad(function () {
            document.getElementById("rotate").style.display = "inherit";
            document.getElementById("slider").style.display = "inherit";
        });
    }
    ;
    App();
});
//# sourceMappingURL=main.js.map