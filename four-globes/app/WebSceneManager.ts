import WebScene from "esri/WebScene";
import SceneView from "esri/views/SceneView";
import FeatureLayer from "esri/layers/FeatureLayer";
import LayerView from "esri/views/layers/LayerView";
import all from "dojo/promise/all";

export default class WebSceneManager {
    private views: any[] = [];
    private layerViews: any[] = [];
    private rotating: boolean = false;
    private viewsLoaded: number = 0;
    private layerViewLoaded: any[] = [];
    private view: SceneView = null;

    public constructor(params: any) {
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
        console.log("WebSceneManager changeHue", angle);

        this.views.forEach(function (view) {
            view.container.setAttribute("style", "filter:hue-rotate(" + angle + "deg)");
        });
    }

    public rotate() {
        console.log("WebSceneManager start rotation");

        this.rotating = !this.rotating;
        if (this.viewsLoaded == 4) {
            this.views.forEach((view) => {
                this.animate(view);
            });
        }
    }

    public animate(view: SceneView) {
        console.log("WebSceneManager animate", view);

        if (this.rotating) {
            const camera = view.camera.clone();
            camera.position.longitude -= 1;
            view.goTo(camera);
            requestAnimationFrame(() => { this.animate(view); });
        }
    }

    public onFinishLoad(callback: any) {
        let loaded = [false, false, false, false];
        all(this.layerViewLoaded)
            .then(() => {
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