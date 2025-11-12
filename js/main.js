// A. SCENE, CAMERA, RENDERER SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set initial camera position and add interactive controls
camera.position.z = 20; 
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting (The Sun's Radiance)
const ambientLight = new THREE.AmbientLight(0x333333); 
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 3, 500); 
pointLight.position.set(0, 0, 0); 
scene.add(pointLight);

// B. DATA & INTERACTION SETUP
const PLANETS = [
    { name: "Mercury", radius: 0.2, color: 0xAAAAAA, distance: 3.0, orbitSpeed: 0.015, selfRotateSpeed: 0.02 },
    { name: "Venus", radius: 0.4, color: 0xCC7722, distance: 5.0, orbitSpeed: 0.008, selfRotateSpeed: 0.01 },
    { name: "Earth", radius: 0.5, color: 0x0000FF, distance: 8.0, orbitSpeed: 0.005, selfRotateSpeed: 0.007 },
];

const selectableObjects = []; // Stores meshes for raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const selectionDisplay = document.getElementById('selection-display');

// Stores all planet orbit groups for use in the animation loop
const orbitalBodies = [];

// C. UTILITY FUNCTIONS

// Function to create a realistic Starfield background
function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 15000; // Lots of stars for a dense field
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // Generate random coordinates within a large sphere
        const r = 400; // Radius of the star sphere
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

// Function to create the visible orbital path line (a thin ring)
function createOrbitLine(distance) {
    const tubeRadius = 0.01; // How thick the line is
    const radialSegments = 64; 
    const tubularSegments = 1;

    // Use a torus geometry with thickness 0, or line geometry
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
    // StandardMaterial reacts to the Sun's light
    const material = new THREE.MeshStandardMaterial({ color: data.color }); 
    const planet = new THREE.Mesh(geometry, material);
    
    // Set planet properties for easy identification during raycasting
    planet.userData = { name: data.name, type: 'Planet' }; 
    selectableObjects.push(planet);

    const orbitGroup = new THREE.Object3D();
    planet.position.x = data.distance;
    orbitGroup.add(planet);
    scene.add(orbitGroup);
    
    // Create the visual orbit line
    createOrbitLine(data.distance);

    return { planet, orbitGroup }; 
}

// D. POPULATING THE SCENE

// 1. Starfield
createStarfield();

// 2. The Sun
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.userData = { name: "The Sun", type: 'Star' };
selectableObjects.push(sun);
scene.add(sun);

// 3. Inner Planets (Mercury, Venus, Earth)
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

// 4. Earth's Moon (Added as a satellite of Earth)
// Earth's data is the last element in orbitalBodies
const earthSystem = orbitalBodies.find(b => b.name === "Earth");

const moonData = { name: "Moon", radius: 0.15, color: 0xCCCCCC, distance: 1.5, orbitSpeed: 0.05, selfRotateSpeed: 0.015 };
const moonGeometry = new THREE.SphereGeometry(moonData.radius, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ color: moonData.color });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.userData = { name: moonData.name, type: 'Moon' };
selectableObjects.push(moon);

// Create a small group for the moon to orbit around Earth's center
const moonOrbitGroup = new THREE.Object3D();
moonOrbitGroup.add(moon); 

// Position the Moon relative to Earth's center
moon.position.x = moonData.distance;

// Add the moon's orbit group to the Earth mesh itself
earthSystem.mesh.add(moonOrbitGroup); 

// Add moon animation data
orbitalBodies.push({
    name: moonData.name,
    mesh: moon,
    group: moonOrbitGroup, // Moon orbits this group
    orbitSpeed: moonData.orbitSpeed,
    selfRotateSpeed: moonData.selfRotateSpeed
});


// 5. Simple Inner Asteroids (Between Sun and Earth)
// Simple ring of small static objects for visual texture
const asteroidCount = 100;
for (let i = 0; i < asteroidCount; i++) {
    const size = 0.05 + Math.random() * 0.05;
    const distance = 1.8 + Math.random() * 1.0; // Distances between Mercury and Venus' orbit
    const asteroidGeometry = new THREE.SphereGeometry(size, 8, 8);
    const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    
    // Place randomly on the orbital plane
    asteroid.position.set(distance, 0, 0); 
    asteroid.rotation.y = Math.random() * Math.PI * 2;
    asteroid.rotation.z = Math.random() * Math.PI * 2;

    // Create a group for rotation
    const asteroidOrbit = new THREE.Object3D();
    asteroidOrbit.rotation.y = Math.random() * Math.PI * 2; // Random starting angle
    asteroidOrbit.add(asteroid);
    scene.add(asteroidOrbit);

    // Give asteroids a very slow rotation speed
    orbitalBodies.push({
        name: `Asteroid ${i}`,
        mesh: asteroid,
        group: asteroidOrbit,
        orbitSpeed: 0.0005 + Math.random() * 0.0001, 
        selfRotateSpeed: 0.0
    });
}

// E. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);

    // 1. Sun Rotation
    sun.rotation.y += 0.001; 

    // 2. Apply Orbit & Self-Rotation for all bodies
    orbitalBodies.forEach(body => {
        // Orbital rotation around its parent (Sun for planets, Earth for Moon)
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
        if (currentIntersected !== intersects[0].object) {
            // New object hovered
            currentIntersected = intersects[0].object;
            const name = currentIntersected.userData.name;
            selectionDisplay.textContent = `Selected: ${name}`;
        }
    } else {
        // Nothing hovered
        if (currentIntersected) {
            currentIntersected = null;
            selectionDisplay.textContent = 'Hover over a planet!';
        }
    }

    controls.update(); 
    renderer.render(scene, camera);
}

animate();

// F. EVENT LISTENERS
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
