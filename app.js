const grid = document.querySelector(".grid");
let player = 112;
let width = 15;
let height = 15;

for (let i = 0; i < 225; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

squares[player].classList.add("player");

function movePlayer(e) {
  squares[player].classList.remove("player");
  switch (e.key) {
    case "ArrowLeft":
      if (player % width !== 0) player -= 1;
      break;
    case "ArrowRight":
      if (player % width < width - 1) player += 1;
      break;
    case "ArrowUp":
      if (player % height < height - 1) player -= 15;
      break;
    case "ArrowDown":
      if (player % height < height - 1) player += 15;
      break;
  }
  squares[player].classList.add("player");
}
document.addEventListener("keydown", movePlayer);
