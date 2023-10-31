import "./style.css";

const urls = [
  "/public/assets/tile1.png",
  "/public/assets/tile2.png",
  "/public/assets/tile3.png",
  "/public/assets/tile4.png",
  "/public/assets/tile5.png",
  "/public/assets/tile6.png",
  "/public/assets/tile7.png",
];

let currentTile = 0;
let clicked = false;

const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement;
const svgContainer = document.getElementById("svgContainer");

if (svgContainer) {
  svg.setAttribute("width", "640"); // Updated size
  svg.setAttribute("height", "880"); // Updated size
  svgContainer.appendChild(svg);
}

svg.addEventListener('mouseup', () => { clicked = false; });

// Object to hold the state of the grid    credit: https://reacthustle.com/blog/how-to-import-a-json-file-in-typescript
const gridState: any = {};

// Export Button
const exportBtn = document.createElement("button");
exportBtn.innerHTML = "Export";
exportBtn.addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gridState));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "tilemap.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
});
document.body.appendChild(exportBtn);

// Import Button
const importBtn = document.createElement("input");
importBtn.type = "file";
importBtn.addEventListener("change", function() {
  const file = this.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      const data = JSON.parse(evt.target?.result as string);
      for (const key in data) {
        const tileData = data[key];
        const tile = document.getElementById(key) as Element;
        if (tile) {
          // Find the index of the URL in the `urls` array to set `currentTile`
          const tileIndex = urls.indexOf(tileData.url);
          if (tileIndex !== -1) {
            currentTile = tileIndex;
          }
          updateTile(tile, tileData.x, tileData.y, tileData.width, tileData.height);
        }
      }
    }
  }
});
document.body.appendChild(importBtn);

createGrid(32, 32, 20, 20); // Updated tile size to 20x20
createPalette(20, 20); // Updated palette tile size to 20x20

function create(tagName: string): Element {
  return document.createElementNS("http://www.w3.org/2000/svg", tagName);
}

function updateTile(tile: Element, x: string, y: string, width: string, height: string) {
  tile.setAttributeNS(null, "x", x);
  tile.setAttributeNS(null, "y", y);
  tile.setAttributeNS(null, "width", width);
  tile.setAttributeNS(null, "height", height);
  tile.setAttributeNS(null, "visibility", "visible");
  tile.setAttributeNS("http://www.w3.org/1999/xlink", "href", urls[currentTile]);
  
  // Update grid state
  const tileId = `${x}-${y}`;
  tile.setAttribute("id", tileId);
  gridState[tileId] = {
    x,
    y,
    width,
    height,
    url: urls[currentTile]
  };
}

function createGrid(width: number, height: number, tileWidth: number, tileHeight: number) {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const tile = create("image");
      
      tile.addEventListener("mousedown", function (this: Element) {
        clicked = true;
        updateTile(this, this.getAttribute("x")!, this.getAttribute("y")!, tileWidth.toString(), tileHeight.toString());
      });

      tile.addEventListener("mouseover", function (this: Element) {
        if (clicked) {
          updateTile(this, this.getAttribute("x")!, this.getAttribute("y")!, tileWidth.toString(), tileHeight.toString());
        }
      });

      updateTile(tile, String(i * tileWidth), String(j * tileHeight), tileWidth.toString(), tileHeight.toString());
      svg.appendChild(tile);
    }
  }
}

function createPalette(tileWidth: number, tileHeight: number) {
  const enlargedTileWidth = tileWidth * 2;  // 40
  const enlargedTileHeight = tileHeight * 2;  // 40

  for (let k = 0; k < urls.length; k++) {
    const color = create("image");

    color.addEventListener("click", function () {
      currentTile = k;
    });

    color.setAttributeNS(null, "x", String(k * (enlargedTileWidth + 2)));
    color.setAttributeNS(null, "y", String(640 + 20));  // Position below the grid
    color.setAttributeNS(null, "width", enlargedTileWidth.toString());
    color.setAttributeNS(null, "height", enlargedTileHeight.toString());
    color.setAttributeNS(null, "visibility", "visible");
    color.setAttributeNS("http://www.w3.org/1999/xlink", "href", urls[k]);

    svg.appendChild(color);
  }
}
