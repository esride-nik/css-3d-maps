var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/WebScene", "esri/views/SceneView", "esri/layers/FeatureLayer", "dojo/promise/all"], function (require, exports, WebScene_1, SceneView_1, FeatureLayer_1, all_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebScene_1 = __importDefault(WebScene_1);
    SceneView_1 = __importDefault(SceneView_1);
    FeatureLayer_1 = __importDefault(FeatureLayer_1);
    all_1 = __importDefault(all_1);
    var WebSceneManager = /** @class */ (function () {
        function WebSceneManager() {
            this.views = [];
            this.layerViews = [];
            this.rotating = false;
            this.viewsLoaded = 0;
            this.layerViewLoaded = [];
            this.view = null;
            this.angle = 0;
        }
        WebSceneManager.prototype.createScene = function (colors, container) {
            var _this = this;
            console.log("WebSceneManager createScene", colors, container);
            var webscene = new WebScene_1.default({
                portalItem: {
                    id: "c894a37c07124bfcbe1ae60ba757f63e"
                }
            });
            var countryBoundaries = new FeatureLayer_1.default({
                url: "http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer",
                title: "World Countries",
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "polygon-3d",
                        symbolLayers: [{
                                type: "fill",
                                material: { color: colors[2] },
                                outline: {
                                    color: colors[2]
                                }
                            }]
                    }
                }
            });
            webscene.add(countryBoundaries);
            var view = new SceneView_1.default({
                container: container,
                map: webscene,
                ui: {
                    components: []
                }
            });
            this.layerViewLoaded.push(view.whenLayerView(countryBoundaries)
                .then(function (layerView) {
                _this.layerViews.push(layerView);
            }));
            view.when(function (v) {
                console.log("view when", v);
                view.environment.background.color = colors[0];
                webscene.ground.surfaceColor = colors[1];
                _this.viewsLoaded += 1;
            });
            this.views.push(view);
        };
        WebSceneManager.prototype.changeHue = function (angle) {
            var _this = this;
            console.log("hue", angle);
            this.views.forEach(function (view) {
                _this.angle = angle;
                view.container.style.filter = "hue-rotate(" + angle + "deg)";
            });
        };
        WebSceneManager.prototype.rotate = function () {
            var _this = this;
            console.log("Switch rotate.");
            this.rotating = !this.rotating;
            this.views.forEach(function (view) {
                _this.animate(view);
            });
            if (this.rotating) {
                document.getElementById("slider").setAttribute("style", "display: none !important;");
                document.getElementById("rotate").setAttribute("style", "display: none !important;");
            }
            else {
                document.getElementById("slider").setAttribute("style", "display: inherit;");
                document.getElementById("rotate").setAttribute("style", "display: inherit;");
            }
        };
        WebSceneManager.prototype.animate = function (view) {
            var _this = this;
            if (this.rotating) {
                var camera = view.camera.clone();
                camera.position.longitude -= 1;
                view.goTo(camera);
                requestAnimationFrame(function () { _this.animate(view); });
                if (this.config && this.config.hueFrom != this.config.hueTo) {
                    var newAngle = this.angle += this.config.hueFactor;
                    // let newAngle = this.angle+=this.config.hueFactor >= this.config.hueFrom 
                    //                 ? this.angle+=this.config.hueFactor <= this.config.hueTo 
                    //                     ? this.angle+=this.config.hueFactor
                    //                     : this.config.hueFrom
                    //                 : this.config.hueTo
                    if (newAngle < this.config.hueFrom || newAngle > this.config.hueTo) {
                        if (this.config.hueFactor > 0) {
                            newAngle = this.config.hueFrom;
                        }
                        else {
                            newAngle = this.config.hueTo;
                        }
                    }
                    this.changeHue(newAngle);
                }
            }
        };
        WebSceneManager.prototype.onFinishLoad = function (callback) {
            var _this = this;
            var loaded = [false, false, false, false];
            all_1.default(this.layerViewLoaded)
                .then(function () {
                console.log("All layer views finished loading.");
                _this.layerViews.forEach(function (layerView, i) {
                    layerView.watch("updating", function (value) {
                        if (!value) {
                            loaded[i] = true;
                        }
                        if (loaded[0] && loaded[1] && loaded[2] && loaded[3]) {
                            callback();
                        }
                    });
                });
            });
        };
        return WebSceneManager;
    }());
    exports.default = WebSceneManager;
});
/*
TODO

* continue rotation after mouse moving a globe
* get colors from URL parameters
* modes: 8 globes / 4 globes / 2 globes hor / 2 globes ver / 1 globe
* mode: rotate hue over time
* mode: randomly activate / deactivate globes, rotate hue, change speed over time


HEUTE ABEND:
* Sound An Stems
* Record Globes
* Yellow Jackets draft edit

*/ 
//# sourceMappingURL=WebSceneManager.js.map