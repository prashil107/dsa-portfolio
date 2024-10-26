const rows = 15;
const cols = 15;
let grid = [];
let start = [0, 0]; // Default start point
let end = [19, 19]; // Default end point

// Generate a grid of cells
function generateGrid() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';
    grid = Array(rows).fill().map(() => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `${i}-${j}`;

            if (i === start[0] && j === start[1]) {
                cell.classList.add('start');
            } else if (i === end[0] && j === end[1]) {
                cell.classList.add('end');
            }

            cell.addEventListener('click', () => toggleWall(i, j, cell));
            container.appendChild(cell);
        }
    }
}

// Toggle wall on click
function toggleWall(row, col, cell) {
    if (cell.classList.contains('start') || cell.classList.contains('end')) return;
    cell.classList.toggle('wall');
    grid[row][col] = grid[row][col] === 0 ? 1 : 0; // 1 represents a wall
}

// Helper function for delay
function delayTime(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// A* Algorithm
async function astar() {
    let openSet = [start];
    let cameFrom = {};
    let gScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
    gScore[start[0]][start[1]] = 0;

    while (openSet.length > 0) {
        let current = openSet.shift();
        let [x, y] = current;

        if (x === end[0] && y === end[1]) {
            return reconstructPath(cameFrom, current);
        }

        let neighbors = getNeighbors(x, y);
        for (let [nx, ny] of neighbors) {
            if (grid[nx][ny] === 1) continue; // Skip walls

            let tentative_gScore = gScore[x][y] + 1;
            if (tentative_gScore < gScore[nx][ny]) {
                cameFrom[`${nx}-${ny}`] = [x, y];
                gScore[nx][ny] = tentative_gScore;
                openSet.push([nx, ny]);

                document.getElementById(`${nx}-${ny}`).classList.add('visited');
                await delayTime(20);
            }
        }
    }
}

// Dijkstra's Algorithm
async function dijkstra() {
    let distances = Array(rows).fill().map(() => Array(cols).fill(Infinity));
    distances[start[0]][start[1]] = 0;

    let visited = new Set();
    let queue = [start];
    let cameFrom = {};

    while (queue.length > 0) {
        // Find cell with the minimum distance
        queue.sort((a, b) => distances[a[0]][a[1]] - distances[b[0]][b[1]]);
        let current = queue.shift();
        let [x, y] = current;

        if (visited.has(`${x}-${y}`)) continue;
        visited.add(`${x}-${y}`);

        // If the end node is reached
        if (x === end[0] && y === end[1]) {
            return reconstructPath(cameFrom, current);
        }

        let neighbors = getNeighbors(x, y);
        for (let [nx, ny] of neighbors) {
            if (visited.has(`${nx}-${ny}`) || grid[nx][ny] === 1) continue; // Skip visited nodes or walls

            let alt = distances[x][y] + 1;
            if (alt < distances[nx][ny]) {
                distances[nx][ny] = alt;
                cameFrom[`${nx}-${ny}`] = [x, y];
                queue.push([nx, ny]);

                document.getElementById(`${nx}-${ny}`).classList.add('visited');
                await delayTime(20);
            }
        }
    }
}

// Get neighboring cells
function getNeighbors(x, y) {
    let neighbors = [];
    if (x > 0) neighbors.push([x - 1, y]);
    if (x < rows - 1) neighbors.push([x + 1, y]);
    if (y > 0) neighbors.push([x, y - 1]);
    if (y < cols - 1) neighbors.push([x, y + 1]);
    return neighbors;
}

// Reconstruct the path from end to start
function reconstructPath(cameFrom, current) {
    while (current) {
        let [x, y] = current;
        document.getElementById(`${x}-${y}`).classList.add('path');
        current = cameFrom[`${x}-${y}`];
    }
}

// Visualize the selected pathfinding algorithm
function visualizePath() {
    const algorithm = document.getElementById('algorithm').value;
    if (algorithm === 'astar') {
        astar();
    } else if (algorithm === 'dijkstra') {
        dijkstra();
    }
}

// Event listeners for buttons
document.getElementById('generate-button').addEventListener('click', generateGrid);
document.getElementById('visualize-button').addEventListener('click', visualizePath);

// Generate grid on page load
window.onload = generateGrid;
