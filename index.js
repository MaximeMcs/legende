const fs = require("fs");

const generateTable = (mapStyle) => {
  let table = "<table><tr><th>Icon/Color</th><th>ID</th><th>Type</th></tr>";
  mapStyle.layers.forEach(layer => {
    let paint = layer.paint || {};
    let row = "";
    let color = "";
    let opacity = "";
    let dasharray = "";
    let width = "";
    let id = layer.id.split('-')[1];

    switch (layer.type) {
      case "symbol":
        if (layer.layout["icon-image"]) {
         row = `<tr><td style="text-align: center;"><img src='_svg/${layer.layout["icon-image"]}.svg' alt="icon not found" /></td><td>${id}</td><td>${layer.type}</td></tr>`;
        }
         break;
      case "fill":
        color = paint["background-color"] || paint["fill-color"];
        opacity = paint["fill-opacity"] || "1";
        row = `<tr><td><div style="margin: 0 auto; width: 40px; height: 25px; background-color: ${color}; opacity: ${opacity}"></div></td><td>${id}</td><td>${layer.type}</td></tr>`;
        break;
      case "line":
        if (mapStyle.layers[mapStyle.layers.indexOf(layer) - 1].id.endsWith("border")) {
          break;
        }
        color = paint["line-color"];
        opacity = paint["line-opacity"] || "1";
        dasharray = paint["line-dasharray"] || "0";
        width = paint["line-width"];
        if (layer.id.endsWith("-border")) {
          const nextLayer = mapStyle.layers[mapStyle.layers.indexOf(layer) + 1];
          if (nextLayer && nextLayer.type === "line" && id === nextLayer.id.split('-')[1]) {
            midId = nextLayer.id.split('-')[1];
            midColor = nextLayer.paint["line-color"];
            midOpacity = nextLayer.paint["line-opacity"] || "1";
            midDasharray = nextLayer.paint["line-dasharray"] || "0";
            midWidth = nextLayer.paint["line-width"];    
            row = `<tr><td style="text-align: center;"><svg style="height: 40px; width: 40px; background-color: rgba(224, 224, 224, 1);" viewBox="0 0 100 100">
                  <line x1="0" y1="30" x2="100" y2="30" stroke="${color}" stroke-width="10px" stroke-dasharray="${dasharray}" stroke-opacity="${opacity}" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="${midColor}" stroke-width="10px" stroke-dasharray="${midDasharray}" stroke-opacity="${midOpacity}" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="${color}" stroke-width="10px" stroke-dasharray="${dasharray}" stroke-opacity="${opacity}" />
                  </svg></td><td>${midId}</td><td>${nextLayer.type}</td></tr>`;
            console.log();
            break;
          }
        }    
        row = `<tr><td style="text-align: center;"><svg style="height: 40px; width: 40px; background-color: rgba(224, 224, 224, 1);" viewBox="0 0 100 100"><line x1="0" y1="50" x2="100" y2="50" stroke="${color}" stroke-width="10px" stroke-dasharray="${dasharray}" stroke-opacity="${opacity}" /></svg></td><td>${id}</td><td>${layer.type}</td></tr>`;
        break;
      default:
        break;
    }
    table += row;
  });
  table += "</table>";
  return table;
};

fs.readFile("map-style.json", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }

  try {
    const mapStyle = JSON.parse(data);
    console.log(mapStyle.layers);
    const table = generateTable(mapStyle);

    fs.writeFile("index.html", table, err => {
      if (err) {
        console.error(`Error writing file: ${err.message}`);
      } else {
        console.log("HTML table written to index.html");
      }
    });
  } catch (error) {
    console.error(`Error parsing JSON: ${error.message}`);
  }
});
