const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

let cities = [];
let routes = [];
const cityColor = "#ffffff";
const minDistance = 100;
let optimalPath = [];

function getNonOverlappingPosition() {
    let x, y, attempts = 0;
    do {
        x = Math.random() * (canvas.width - 100) + 50;
        y = Math.random() * (canvas.height - 100) + 50;
        attempts++;
    } while (
        cities.some(city => Math.hypot(city.x - x, city.y - y) < minDistance) && attempts < 100
    );
    return { x, y };
}

function addCity() {
    const name = prompt("Enter city name:");
    if (!name) return;
    if (cities.some(city => city.name === name)) {
        alert("City already exists!");
        return;
    }
    const { x, y } = getNonOverlappingPosition();
    cities.push({ name, x, y, color: cityColor });
    drawGraph();
}

function addRoute() {
    const from = prompt("Enter source city:");
    const to = prompt("Enter target city:");
    const weight = parseInt(prompt("Enter distance between cities:"), 10);

    if (!from || !to || isNaN(weight)) return;
    const source = cities.find(c => c.name === from);
    const target = cities.find(c => c.name === to);
    if (!source || !target) {
        alert("Both cities must exist!");
        return;
    }

    const existing = routes.find(
        e => (e.source === source && e.target === target) || (e.source === target && e.target === source)
    );

    if (existing) {
        existing.weight = weight;
    } else {
        routes.push({ source, target, weight });
    }

    drawGraph();
}

function drawGraph(highlighted = []) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    routes.forEach(route => {
        const isHighlighted = highlighted.includes(route);
        ctx.beginPath();
        ctx.moveTo(route.source.x, route.source.y);
        ctx.lineTo(route.target.x, route.target.y);
        ctx.strokeStyle = isHighlighted ? "#FFD700" : "#3399ff";
        ctx.lineWidth = isHighlighted ? 4 : 2;
        ctx.stroke();

        const midX = (route.source.x + route.target.x) / 2;
        const midY = (route.source.y + route.target.y) / 2;
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.fillText(route.weight, midX + 5, midY - 5);
    });

    cities.forEach(city => {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 18, 0, 2 * Math.PI);
        ctx.fillStyle = city.color;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#000000";
        ctx.font = "bold 13px Arial";
        ctx.fillText(city.name, city.x - 10, city.y + 5);
    });
}

function showOptimalRoadNetwork() {
    if (cities.length === 0) return;

    const visited = new Set();
    const result = [];
    let total = 0;

    visited.add(cities[0]);
    while (visited.size < cities.length) {
        let shortest = null;
        for (let r of routes) {
            if (
                (visited.has(r.source) && !visited.has(r.target)) ||
                (visited.has(r.target) && !visited.has(r.source))
            ) {
                if (!shortest || r.weight < shortest.weight) {
                    shortest = r;
                }
            }
        }
        if (!shortest) break;

        result.push(shortest);
        total += shortest.weight;
        visited.add(shortest.source);
        visited.add(shortest.target);
    }

    optimalPath = result;
    drawGraph(optimalPath);
    document.getElementById("totalDistance").innerText = `Total Distance: ${total}`;
}

function resetGraph() {
    cities = [];
    routes = [];
    optimalPath = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("totalDistance").innerText = "Total Distance: 0";
}
