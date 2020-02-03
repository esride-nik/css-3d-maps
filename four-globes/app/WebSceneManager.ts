import WebScene from "esri/WebScene";
import SceneView from "esri/views/SceneView";
import FeatureLayer from "esri/layers/FeatureLayer";
import LayerView from "esri/views/layers/LayerView";
import all from "dojo/promise/all";

export default class WebSceneManager {
    private views: any[] = [];
    private layerViews: any[] = [];
    public rotating: boolean = false;
    private viewsLoaded: number = 0;
    private layerViewLoaded: any[] = [];
    private view: SceneView = null;
    private angle: number = 0;
    public config: any;

    public constructor() {
    }

    public createScene(colors: [], container: string) {
        console.log("WebSceneManager createScene", colors, container);

        const webscene = new WebScene({
            portalItem: {
                id: "c894a37c07124bfcbe1ae60ba757f63e"
            }
        });

        const countryBoundaries = new FeatureLayer({
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

        let view = new SceneView({
            container: container,
            map: webscene,
            ui: {
                components: []
            }
        });

        this.layerViewLoaded.push(
            view.whenLayerView(countryBoundaries)
                .then((layerView: LayerView) => {
                    this.layerViews.push(layerView);
                })
        );

        view.when((v: any) => {
            console.log("view when", v);

            view.environment.background.color = colors[0];
            webscene.ground.surfaceColor = colors[1];
            this.viewsLoaded += 1;
        });

        this.views.push(view);
    }

    public changeHue(angle: number) {
        console.log("hue", angle);
        this.views.forEach((view: SceneView) => {
            this.angle = angle;
            view.container.style.filter = "hue-rotate(" + angle + "deg)";
        });
    }

    public rotate() {
        console.log("Switch rotate.");
        this.rotating = !this.rotating;
        this.views.forEach((view) => {
            this.animate(view);
        });

        if (this.rotating) {
            document.getElementById("slider").setAttribute("style", "display: none !important;");
            document.getElementById("rotate").setAttribute("style", "display: none !important;");
        }
        else {
            document.getElementById("slider").setAttribute("style", "display: inherit;");
            document.getElementById("rotate").setAttribute("style", "display: inherit;");
        }
    }

    public animate(view: SceneView) {
        if (this.rotating) {
            const camera = view.camera.clone();
            camera.position.longitude -= 1;
            view.goTo(camera);
            requestAnimationFrame(() => { this.animate(view); });

            if (this.config && this.config.hueFrom != this.config.hueTo) {
                let newAngle: number = this.angle += this.config.hueFactor;
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
    }

    public onFinishLoad(callback: any) {
        let loaded = [false, false, false, false];
        all(this.layerViewLoaded)
            .then(() => {
                console.log("All layer views finished loading.");
                this.layerViews.forEach((layerView, i) => {
                    layerView.watch("updating", (value) => {
                        if (!value) {
                            loaded[i] = true;
                        }
                        if (loaded[0] && loaded[1] && loaded[2] && loaded[3]) {
                            callback();
                        }
                    });
                });
            });
    }
}


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