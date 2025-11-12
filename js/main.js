// Global variables for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentIntersected = null; 
const selectableObjects = []; 
const orbitalBodies = []; 
const selectionDisplay = document.getElementById('selection-display');

// NEW: Variable to hold the currently clicked/locked body
let selectedBody = null; 

// Data for the inner solar system planets
const PLANETS = [
    { name: "Mercury", radius: 0.2, color: 0xAAAAAA, distance: 3.0, orbitSpeed: 0.015, selfRotateSpeed: 0.02, distanceAU: 0.39 },
    { name: "Venus", radius: 0.4, color: 0xCC7722, distance: 5.0, orbitSpeed: 0.008, selfRotateSpeed: 0.01, distanceAU: 0.72 },
    { name: "Earth", radius: 0.5, color: 0x0000FF, distance: 8.0, orbitSpeed: 0.005, selfRotateSpeed: 0.007, distanceAU: 1.00 },
];

const MOON_DATA = { 
    name: "Moon", radius: 0.15, color: 0xCCCCCC, 
    distance: 1.5, orbitSpeed: 0.05, selfRotateSpeed: 0.015,
    info: "Orbits Earth at 384,400 km" 
};


// --- 1. SETUP ---

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position and add interactive controls
camera.position.z = 20; 
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting (Sun is the primary light source)
const ambientLight = new THREE.AmbientLight(0x333333); 
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 3, 500); 
pointLight.position.set(0, 0, 0); 
scene.add(pointLight);


// --- 2. UTILITY FUNCTIONS ---

// Creates a realistic Starfield background (random, not actual)
function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 15000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const r = 400; 
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });

    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);
}

// Creates the imaginary orbit path (circle/ring)
function createOrbitLine(distance) {
    const tubeRadius = 0.005; 
    const radialSegments = 128; 

    const geometry = new THREE.RingGeometry(distance, distance + tubeRadius, radialSegments);
    const material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const orbitRing = new THREE.Mesh(geometry, material);

    orbitRing.rotation.x = Math.PI / 2; 
    scene.add(orbitRing);
}

// Function to create a single planet and its orbital group
function createPlanetBody(data) {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: data.color }); 
    const planet = new THREE.Mesh(geometry, material);
    
    planet.userData = { 
        name: data.name, 
        type: 'Planet',
        distanceAU: data.distanceAU,
        distanceFromSun: data.distance 
    }; 
    selectableObjects.push(planet);

    const orbitGroup = new THREE.Object3D();
    planet.position.x = data.distance;
    orbitGroup.add(planet);
    scene.add(orbitGroup);
    
    createOrbitLine(data.distance);

    return { planet, orbitGroup }; 
}

// Function to display the information of the selected body
function displayBodyInfo(data) {
    let infoText = `Selected: **${data.name}**`;

    if (data.type === 'Star') {
        infoText += `<br>Location: ${data.info}`;
    } else if (data.type === 'Moon') {
        infoText += `<br>Orbiting: Earth<br>${data.info}`;
    } else if (data.type === 'Planet') {
        infoText += `<br>Distance: ${data.distanceAU} AU (approx.)`;
        infoText += `<br>Radius (Scene): ${data.distanceFromSun} SU`;
    }

    selectionDisplay.innerHTML = infoText;
}


// --- 3. BUILD THE SOLAR SYSTEM ---

// 3a. Starfield
createStarfield();

// 3b. The Sun
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.userData = { name: "The Sun", type: 'Star', distanceAU: 0, info: "The center of our solar system." }; 
selectableObjects.push(sun);
scene.add(sun);

// 3c. Inner Planets (Mercury, Venus, Earth)
PLANETS.forEach(data => {
    const { planet, orbitGroup } = createPlanetBody(data);
    
    orbitalBodies.push({
        name: data.name,
        mesh: planet, 
        group: orbitGroup, 
        orbitSpeed: data.orbitSpeed, 
        selfRotateSpeed: data.selfRotateSpeed
    });
});

// 3d. Earth's Moon
const earthSystem = orbitalBodies.find(b => b.name === "Earth");

const moonGeometry = new THREE.SphereGeometry(MOON_DATA.radius, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ color: MOON_DATA.color });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.userData = { 
    name: MOON_DATA.name, 
    type: 'Moon', 
    info: MOON_DATA.info 
};
selectableObjects.push(moon);

const moonOrbitGroup = new THREE.Object3D();
moonOrbitGroup.add(moon); 
moon.position.x = MOON_DATA.distance;
earthSystem.mesh.add(moonOrbitGroup); 

orbitalBodies.push({
    name: MOON_DATA.name,
    mesh: moon,
    group: moonOrbitGroup,
    orbitSpeed: MOON_DATA.orbitSpeed,
    selfRotateSpeed: MOON_DATA.selfRotateSpeed
});

// 3e. Simple Inner Asteroids 
const asteroidCount = 100;
for (let i = 0; i < asteroidCount; i++) {
    const size = 0.05 + Math.random() * 0.05;
    const distance = 4.0 + Math.random() * 3.0; 
    const asteroidGeometry = new THREE.SphereGeometry(size, 8, 8);
    const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    
    asteroid.position.x = distance; 
    asteroid.position.z = (Math.random() - 0.5) * 0.5;
    
    const asteroidOrbit = new THREE.Object3D();
    asteroidOrbit.rotation.y = Math.random() * Math.PI * 2;
    asteroidOrbit.add(asteroid);
    scene.add(asteroidOrbit);

    orbitalBodies.push({
        name: `Asteroid ${i}`,
        mesh: asteroid,
        group: asteroidOrbit,
        orbitSpeed: 0.0005 + Math.random() * 0.0002, 
        selfRotateSpeed: 0.0
    });
}


// --- 4. ANIMATION AND INTERACTION LOOP ---

function animate() {
    requestAnimationFrame(animate);

    // 1. Sun Rotation
    sun.rotation.y += 0.001; 

    // 2. Apply Orbit & Self-Rotation
    orbitalBodies.forEach(body => {
        body.group.rotation.y += body.orbitSpeed; 
        if (body.selfRotateSpeed > 0) {
            body.mesh.rotation.y += body.selfRotateSpeed;
        }
    });

    // 3. Handle Hover (Mousemove)
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(selectableObjects);

    if (intersects.length > 0) {
        currentIntersected = intersects[0].object;
        // If nothing is currently selected (clicked), show hover info
        if (!selectedBody) {
             displayBodyInfo(currentIntersected.userData);
        }
    } else {
        // If mouse leaves objects and nothing is clicked, reset display
        if (!selectedBody) {
            currentIntersected = null;
            selectionDisplay.innerHTML = 'Hover over a planet or the Sun!';
        }
    }

    controls.update(); 
    renderer.render(scene, camera);
}

animate();

// --- 5. EVENT LISTENERS ---

// Handle mouse movement for hover detection
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}, false);

// NEW: Handle mouse click for locking selection
window.addEventListener('click', () => {
    // If the mouse is hovering over an object when clicked
    if (currentIntersected) {
        // If we click the same body again, deselect it (toggle)
        if (selectedBody === currentIntersected) {
            selectedBody = null;
            selectionDisplay.innerHTML = 'Hover over a planet or the Sun!';
        } else {
            // Select the new body and lock the info display
            selectedBody = currentIntersected;
            displayBodyInfo(selectedBody.userData);
        }
    } else {
        // If clicking on empty space, deselect any locked body
        selectedBody = null;
        selectionDisplay.innerHTML = 'Hover over a planet or the Sun!';
    }
});

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
