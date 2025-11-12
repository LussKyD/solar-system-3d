// --- Global Constants ---

// Conversion factor: 1 AU (Astronomical Unit) is approx 0.000015813 Light Years
const AU_TO_LY = 0.000015813;
const EARTH_DISTANCE_SU = 8.0; // Earth's arbitrary distance in Scene Units (SU)

// Data structure now includes texture path and distance in AU
const PLANETS = [
    { name: "Mercury", radius: 0.2, color: 0xAAAAAA, distance: 3.0, orbitSpeed: 0.015, selfRotateSpeed: 0.02, distanceAU: 0.39, texture: 'textures/mercury.jpg' },
    { name: "Venus", radius: 0.4, color: 0xCC7722, distance: 5.0, orbitSpeed: 0.008, selfRotateSpeed: 0.01, distanceAU: 0.72, texture: 'textures/venus.jpg' },
    { name: "Earth", radius: 0.5, color: 0x0000FF, distance: 8.0, orbitSpeed: 0.005, selfRotateSpeed: 0.007, distanceAU: 1.00, texture: 'textures/earth.jpg' },
];

const MOON_DATA = { 
    name: "Moon", radius: 0.15, color: 0xCCCCCC, 
    distance: 1.5, orbitSpeed: 0.05, selfRotateSpeed: 0.015,
    info: "Orbits Earth at 384,400 km", 
    texture: 'textures/moon.jpg' // Moon now has a texture
};

const SUN_DATA = {
    name: "The Sun", type: 'Star', radius: 1.5, color: 0xFFA500, texture: 'textures/sun.jpg', distanceAU: 0, info: "The center of our solar system." 
};

// --- Global Variables for Three.js and Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentIntersected = null; 
let selectedBody = null; 

const selectableObjects = []; 
const orbitalBodies = []; 
const selectionDisplay = document.getElementById('selection-display');
const textureLoader = new THREE.TextureLoader(); // New loader for textures

// --- 1. SETUP ---

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 20; 
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333); 
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 3, 500); 
pointLight.position.set(0, 0, 0); 
scene.add(pointLight);


// --- 2. UTILITY FUNCTIONS ---

// Calculates distance from Earth in Light Years for display
function calculateDistanceToEarth(distanceSU, targetAU) {
    // 1. Calculate distance from Sun in Scene Units (SU)
    const earthSU = EARTH_DISTANCE_SU; 
    const targetSU = distanceSU;

    // 2. Simple calculation (assumes all planets are in a line, which is false, but okay for a model)
    const distanceToEarthSU = Math.abs(targetSU - earthSU);

    // 3. Convert that Scene Unit difference back to AU
    const earthAU = 1.0; 
    const distanceAU = Math.abs(targetAU - earthAU);

    // 4. Convert AU distance to Light Years
    const distanceLY = distanceAU * AU_TO_LY;
    
    return distanceLY.toPrecision(5); // Show 5 significant figures
}


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

function createOrbitLine(distance) {
    const tubeRadius = 0.005; 
    const radialSegments = 128; 

    const geometry = new THREE.RingGeometry(distance, distance + tubeRadius, radialSegments);
    const material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const orbitRing = new THREE.Mesh(geometry, material);

    orbitRing.rotation.x = Math.PI / 2; 
    scene.add(orbitRing);
}

// Updated function to handle textures
function createTexturedBody(data, isSun = false) {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    
    let material;
    if (isSun) {
        // Sun uses basic material and its own texture
        material = new THREE.MeshBasicMaterial({ map: textureLoader.load(data.texture) });
    } else {
        // Planets use standard material to react to the light
        material = new THREE.MeshStandardMaterial({ 
            map: textureLoader.load(data.texture), 
        }); 
    }
    
    const body = new THREE.Mesh(geometry, material);
    
    // Store data for selection display
    body.userData = { 
        name: data.name, 
        type: data.type || 'Planet',
        distanceAU: data.distanceAU,
        distanceSU: data.distance || 0,
        radius: data.radius
    }; 
    selectableObjects.push(body);
    
    return body;
}

// Function to display the information of the selected body (Used by both hover and click)
function displayBodyInfo(data) {
    let infoText = `Selected: **${data.name}**`;

    if (data.type === 'Star') {
        infoText += `<br>Location: ${data.info}`;
    } else if (data.type === 'Moon') {
        // Moons have their own orbit info
        const distLY = calculateDistanceToEarth(data.distanceSU + EARTH_DISTANCE_SU, 1.0); // Moon's distance from Sun in AU is roughly 1.0
        infoText += `<br>Orbiting: Earth<br>${data.info}`;
        infoText += `<br>Distance from Earth: 0.0... Light Years`; // Too small to measure in LY
    } else if (data.type === 'Planet') {
        // Planets have distance from Sun (AU/LY) and Earth (LY)
        const distLY_Sun = data.distanceAU * AU_TO_LY;
        const distLY_Earth = calculateDistanceToEarth(data.distanceSU, data.distanceAU);

        infoText += `<br>Dist. from Sun: ${data.distanceAU} AU / ${distLY_Sun.toPrecision(5)} LY`;
        infoText += `<br>Dist. from Earth: ${distLY_Earth} LY (approx)`;
    }

    selectionDisplay.innerHTML = infoText;
}


// --- 3. BUILD THE SOLAR SYSTEM ---

createStarfield();

// 3a. The Sun (Now uses texture and the createTexturedBody function)
const sun = createTexturedBody(SUN_DATA, true);
scene.add(sun);


// 3b. Inner Planets (Mercury, Venus, Earth)
PLANETS.forEach(data => {
    const planet = createTexturedBody(data); // Planet texture/data
    
    const orbitGroup = new THREE.Object3D();
    planet.position.x = data.distance;
    orbitGroup.add(planet);
    scene.add(orbitGroup);
    
    createOrbitLine(data.distance); // Orbit line
    
    orbitalBodies.push({
        name: data.name,
        mesh: planet, 
        group: orbitGroup, 
        orbitSpeed: data.orbitSpeed, 
        selfRotateSpeed: data.selfRotateSpeed
    });
});

// 3c. Earth's Moon (Now uses texture and is selectable)
const earthSystem = orbitalBodies.find(b => b.name === "Earth");

const moon = createTexturedBody({...MOON_DATA, type: 'Moon'}); // Moon texture/data
moon.userData = { ...moon.userData, distanceSU: MOON_DATA.distance, distanceAU: 1.0 }; // Add distance for calculation

const moonOrbitGroup = new THREE.Object3D();
moonOrbitGroup.add(moon); 
moon.position.x = MOON_DATA.distance;
earthSystem.mesh.add(moonOrbitGroup); // The moon orbits the Earth mesh

orbitalBodies.push({
    name: MOON_DATA.name,
    mesh: moon,
    group: moonOrbitGroup,
    orbitSpeed: MOON_DATA.orbitSpeed,
    selfRotateSpeed: MOON_DATA.selfRotateSpeed
});

// 3d. Simple Inner Asteroids (Non-selectable)
const asteroidCount = 100;
for (let i = 0; i < asteroidCount; i++) {
    const size = 0.05 + Math.random() * 0.05;
    const distance = 4.0 + Math.random() * 3.0; 
    const asteroidGeometry = new THREE.SphereGeometry(size, 8, 8);
    // Use a simple material here, no texture needed for small rocks
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

    sun.rotation.y += 0.001; 

    orbitalBodies.forEach(body => {
        body.group.rotation.y += body.orbitSpeed; 
        if (body.selfRotateSpeed > 0) {
            body.mesh.rotation.y += body.selfRotateSpeed;
        }
    });

    // Handle Hover (Mousemove)
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(selectableObjects);

    if (intersects.length > 0) {
        currentIntersected = intersects[0].object;
        if (!selectedBody) {
             displayBodyInfo(currentIntersected.userData);
        }
    } else {
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

// Handle mouse click for locking selection
window.addEventListener('click', (event) => {
    // 1. Immediately update mouse coordinates based on the click event position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    // 2. Perform raycast based on the exact click location
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(selectableObjects);

    // 3. Logic: select, deselect, or lock
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        if (selectedBody === clickedObject) {
            selectedBody = null;
            selectionDisplay.innerHTML = 'Hover over a planet or the Sun!';
        } else {
            selectedBody = clickedObject;
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
