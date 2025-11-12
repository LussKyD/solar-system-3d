// Global variables for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentIntersected = null; // To track which object the mouse is currently over
const selectableObjects = []; // List of meshes the raycaster should check
const orbitalBodies = []; // List of bodies to animate
const selectionDisplay = document.getElementById('selection-display');

// Data for the inner solar system planets
const PLANETS = [
    // distance is in arbitrary scene units (SU); distanceAU is for display
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

// Creates a realistic Starfield background (actual stars required)
function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 15000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // Generate random coordinates within a large sphere
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
    const tubeRadius = 0.005; // Make it very thin
    const radialSegments = 128; 

    const geometry = new THREE.RingGeometry(distance, distance + tubeRadius, radialSegments);
    const material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const orbitRing = new THREE.Mesh(geometry, material);

    // Rotate to lie flat on the XY plane
    orbitRing.rotation.x = Math.PI / 2; 
    scene.add(orbitRing);
}

// Function to create a single planet and its orbital group
function createPlanetBody(data) {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: data.color }); 
    const planet = new THREE.Mesh(geometry, material);
    
    // Store ALL data for selection display later
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
    
    // Create the visual orbit line
    createOrbitLine(data.distance);

    return { planet, orbitGroup }; 
}


// --- 3. BUILD THE SOLAR SYSTEM ---

// 3a. Starfield
createStarfield();

// 3b. The Sun
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
// Sun data for selection display
sun.userData = { name: "The Sun", type: 'Star', distanceAU: 0, info: "The center of our solar system." }; 
selectableObjects.push(sun);
scene.add(sun);

// 3c. Inner Planets (Mercury, Venus, Earth)
PLANETS.forEach(data => {
    const { planet, orbitGroup } = createPlanetBody(data);
    
    // Store data needed for animation
    orbitalBodies.push({
        name: data.name,
        mesh: planet, 
        group: orbitGroup, 
        orbitSpeed: data.orbitSpeed, 
        selfRotateSpeed: data.selfRotateSpeed
    });
});

// 3d. Earth's Moon (Orbits the Earth mesh)
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
earthSystem.mesh.add(moonOrbitGroup); // The moon orbits the Earth mesh

// Add moon animation data
orbitalBodies.push({
    name: MOON_DATA.name,
    mesh: moon,
    group: moonOrbitGroup,
    orbitSpeed: MOON_DATA.orbitSpeed,
    selfRotateSpeed: MOON_DATA.selfRotateSpeed
});

// 3e. Simple Inner Asteroids (Space between Sun and Earth)
const asteroidCount = 100;
for (let i = 0; i < asteroidCount; i++) {
    const size = 0.05 + Math.random() * 0.05;
    // Place them roughly between Mercury (3 SU) and Earth (8 SU)
    const distance = 4.0 + Math.random() * 3.0; 
    const asteroidGeometry = new THREE.SphereGeometry(size, 8, 8);
    const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    
    // Give them a random starting position and tilt
    asteroid.position.x = distance; 
    asteroid.position.z = (Math.random() - 0.5) * 0.5; // Slight tilt
    
    const asteroidOrbit = new THREE.Object3D();
    asteroidOrbit.rotation.y = Math.random() * Math.PI * 2; // Random starting angle
    asteroidOrbit.add(asteroid);
    scene.add(asteroidOrbit);

    // Give asteroids a slow orbit, but don't make them selectable
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

    // 2. Apply Orbit & Self-Rotation for all bodies
    orbitalBodies.forEach(body => {
        // Orbital rotation around its parent
        body.group.rotation.y += body.orbitSpeed; 
        
        // Self-rotation
        if (body.selfRotateSpeed > 0) {
            body.mesh.rotation.y += body.selfRotateSpeed;
        }
    });

    // 3. Handle Raycasting (Selection)
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(selectableObjects);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (currentIntersected !== intersectedObject) {
            currentIntersected = intersectedObject;
            const data = currentIntersected.userData;

            let infoText = `Selected: **${data.name}**`;

            if (data.type === 'Star') {
                infoText += `<br>Location: ${data.info}`;
            } else if (data.type === 'Moon') {
                infoText += `<br>Orbiting: Earth<br>${data.info}`;
            } else if (data.type === 'Planet') {
                infoText += `<br>Distance: ${data.distanceAU} AU (approx.)`;
                infoText += `<br>Radius (Scene): ${data.distanceFromSun} SU`;
            }

            // Display formatted text
            selectionDisplay.innerHTML = infoText;
        }
    } else {
        // Nothing hovered
        if (currentIntersected) {
            currentIntersected = null;
            selectionDisplay.innerHTML = 'Hover over a planet or the Sun!';
        }
    }

    controls.update(); 
    renderer.render(scene, camera);
}

animate();

// --- 5. EVENT LISTENERS ---

// Handle mouse movement for selection
window.addEventListener('mousemove', (event) => {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}, false);

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
