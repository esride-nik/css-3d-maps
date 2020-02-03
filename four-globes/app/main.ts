import Slider from "./slider";
import WebSceneManager from "./WebSceneManager";
import esriRequest from "esri/request";

function App() {

  let config: string;
  let mode: string;
  let hueFrom: number;
  let hueTo: number;
  let hueTime: number;
  let jConfig: any;

  let view1 = document.getElementById("view1");
  let view2 = document.getElementById("view2");
  let view3 = document.getElementById("view3");
  let view4 = document.getElementById("view4");
  let view5 = document.getElementById("view5");
  let view6 = document.getElementById("view6");
  let view7 = document.getElementById("view7");
  let view8 = document.getElementById("view8");

  const websceneManager = new WebSceneManager();


  // function to retrieve query parameters (in this case only id)
  function getUrlParams() {
    const queryParams = document.location.search.substr(1);
    let result: any = {};

    queryParams.split("?").map((params: string) => {
      params.split("&").map((param: string) => {
        var item = param.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
      })
    });

    if (result.config) config = result.config;
  }

  function applyConfig() {
    
// * modes: 8 globes / 4 globes / 2 globes hor / 2 globes ver / 1 globe
    if (jConfig.mode=="8g") {
      websceneManager.createScene(["#FAA732", "#DE1770", "#5EADE1"], "view1");
      websceneManager.createScene(["#7F2C85", "#F8EB35", "#AE1B2A"], "view2");
      websceneManager.createScene(["#1FB8B5", "#EAECAA", "#612F91"], "view3");
      websceneManager.createScene(["#E2242D", "#106BAC", "#E5922B"], "view4");
      websceneManager.createScene(["#FAA732", "#DE1770", "#5EADE1"], "view5");
      websceneManager.createScene(["#7F2C85", "#F8EB35", "#AE1B2A"], "view6");
      websceneManager.createScene(["#1FB8B5", "#EAECAA", "#612F91"], "view7");
      websceneManager.createScene(["#E2242D", "#106BAC", "#E5922B"], "view8");

      view1.style.width = "25%";
      view2.style.width = "25%";
      view3.style.width = "25%";
      view4.style.width = "25%";
      view5.style.width = "25%";
      view6.style.width = "25%";
      view7.style.width = "25%";
      view8.style.width = "25%";

      view2.style.left = "25%";
      view3.style.left = "50%";
      view4.style.left = "75%";

      view3.style.top = "0";
      view4.style.top = "0";
    }
    if (jConfig.mode=="4g") {
      websceneManager.createScene(["#FAA732", "#DE1770", "#5EADE1"], "view1");
      websceneManager.createScene(["#7F2C85", "#F8EB35", "#AE1B2A"], "view2");
      websceneManager.createScene(["#1FB8B5", "#EAECAA", "#612F91"], "view3");
      websceneManager.createScene(["#E2242D", "#106BAC", "#E5922B"], "view4");
      // no style settings because 4 globes is default
    }
    if (jConfig.mode=="4gh") {
      websceneManager.createScene(["#FAA732", "#DE1770", "#5EADE1"], "view1");
      websceneManager.createScene(["#7F2C85", "#F8EB35", "#AE1B2A"], "view2");
      websceneManager.createScene(["#1FB8B5", "#EAECAA", "#612F91"], "view3");
      websceneManager.createScene(["#E2242D", "#106BAC", "#E5922B"], "view4");
      view1.style.width = "25%";
      view2.style.width = "25%";
      view3.style.width = "25%";
      view4.style.width = "25%";
      view1.style.height = "100%";
      view2.style.height = "100%";
      view3.style.height = "100%";
      view4.style.height = "100%";
      view2.style.left = "25%";
      view3.style.left = "50%";
    }
    else if (jConfig.mode=="2gh") {
      view1.style.width = "100%";
      view2.style.width = "0%";
      view3.style.width = "100%";
      view4.style.width = "0%";
      websceneManager.createScene(["#FAA732", "#DE1770", "#5EADE1"], "view1");
      websceneManager.createScene(["#1FB8B5", "#EAECAA", "#612F91"], "view3");
    }
    else if (jConfig.mode=="2gv") {
      view1.style.height = "100%";
      view2.style.height = "100%";
      view3.style.height = "0%";
      view4.style.height = "0%";
      websceneManager.createScene(["#FAA732", "#DE1770", "#5EADE1"], "view1");
      websceneManager.createScene(["#1FB8B5", "#EAECAA", "#612F91"], "view2");
    }
    else if (jConfig.mode=="1g") {
      view1.style.height = "100%";
      view1.style.width = "100%";
      view2.style.height = "0%";
      view3.style.height = "0%";
      view4.style.height = "0%";
      websceneManager.createScene(["#FAA732", "#DE1770", "#5EADE1"], "view1");
    }

  }



  getUrlParams();

  // * get colors from config
  // * modes: 8g / 4g / 2gh / 2gv / 1g
  // * mode: rotate hue over time
  if (config) {
    // load the cities from the json file
    esriRequest('./config.json', {
      responseType: "json"
    })
      .then((response: any) => {
        jConfig = response.data[config];
        console.log("jConfig", jConfig);
        applyConfig();
      });
  }
  else {
    console.warn("No config parameter.");
  }

  var options = {
    snap: 45,
    clockwise: true,
    startPos: "top",
  }
  var slider = new Slider("slider", options);
  var targetDiv = document.getElementById("angle");

  slider.on("sliderMove", (angle: number) => {
    targetDiv.textContent = angle + "°";
    websceneManager.changeHue(angle);
  });


  document.getElementById("rotate").addEventListener("click", () => {
    websceneManager.rotate();
  })

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
      websceneManager.rotate();
    }
  };

  // websceneManager.onFinishLoad(() => {
  //   if (websceneManager.rotating) {
  //     document.getElementById("slider").setAttribute("style", "display: none !important;");
  //     document.getElementById("rotate").setAttribute("style", "display: none !important;");
  //   }
  //   else {
  //     document.getElementById("slider").setAttribute("style", "display: inherit;");
  //     document.getElementById("rotate").setAttribute("style", "display: inherit;");
  //   }
  // })

};


App();