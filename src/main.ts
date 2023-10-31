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
  svg.setAttribute("height", "800"); // Updated size
  svgContainer.appendChild(svg);
}

svg.addEventListener('mouseup', () => { clicked = false; });

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
  for (let k = 0; k < urls.length; k++) {
    const color = create("image");

    color.addEventListener("click", function () {
      currentTile = k;
    });

    color.setAttributeNS(null, "x", String(k * (tileWidth + 2)));
    color.setAttributeNS(null, "y", String(640 + 20)); // Position below the grid
    color.setAttributeNS(null, "width", tileWidth.toString());
    color.setAttributeNS(null, "height", tileHeight.toString());
    color.setAttributeNS(null, "visibility", "visible");
    color.setAttributeNS("http://www.w3.org/1999/xlink", "href", urls[k]);

    svg.appendChild(color);
  }
}