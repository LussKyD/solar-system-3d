// --- Global Constants ---

// Conversion factors
const AU_TO_LY = 0.000015813; // 1 AU is approx 0.000015813 Light Years
const EARTH_DISTANCE_SU = 8.0; // Earth's distance in Scene Units (SU) - used for scaling

// Data for the entire solar system (Scaled for screen visibility)
const SUN_DATA = {
    name: "The Sun", type: 'Star', radius: 1.5, color: 0xFFA500, texture: 'textures/sun.jpg', distanceAU: 0, info: "The center of our solar system." 
};

// Planet Data (Note: Distances are SCALED for the camera view)
const PLANETS = [
    { name: "Mercury", radius: 0.2, distance: 3.0, orbitSpeed: 0.015, selfRotateSpeed: 0.02, distanceAU: 0.39, texture: 'textures/mercury.jpg' },
    { name: "Venus", radius: 0.4, distance: 5.0, orbitSpeed: 0.008, selfRotateSpeed: 0.01, distanceAU: 0.72, texture: 'textures/venus.jpg' },
    { name: "Earth", radius: 0.5, distance: 8.0, orbitSpeed: 0.005, selfRotateSpeed: 0.007, distanceAU: 1.00, texture: 'textures/earth.jpg' },
    { name: "Mars", radius: 0.3, distance: 12.0, orbitSpeed: 0.004, selfRotateSpeed: 0.006, distanceAU: 1.52, texture: 'textures/mars.jpg' },
    // Gas Giants distances are severely compressed to fit: Jupiter=25, Saturn=35, Uranus=45, Neptune=55
    { name: "Jupiter", radius: 1.2, distance: 25.0, orbitSpeed: 0.0008, selfRotateSpeed: 0.015, distanceAU: 5.20, texture: 'textures/jupiter.jpg' },
    { name: "Saturn", radius: 1.0, distance: 35.0, orbitSpeed: 0.0006, selfRotateSpeed: 0.01, distanceAU: 9.58, texture: 'textures/saturn.jpg', hasRings: true },
    { name: "Uranus", radius: 0.8, distance: 45.0, orbitSpeed: 0.0003, selfRotateSpeed: 0.005, distanceAU: 19.22, texture: 'textures/uranus.jpg' },
    { name: "Neptune", radius: 0.8, distance: 55.0, orbitSpeed: 0.0002, selfRotateSpeed: 0.004, distanceAU: 30.05, texture: 'textures/neptune.jpg' },
];

// Data for Moons, grouped by parent planet name
const MOON_SYSTEMS = {
    "Earth": [
        { name: "Moon", radius: 0.15, distance: 1.5, orbitSpeed: 0.05, selfRotateSpeed: 0.015, texture: 'textures/moon.jpg', info: "Earth's only natural satellite." }
    ],
    "Mars": [
        { name: "Phobos", radius: 0.08, distance: 0.5, orbitSpeed: 0.1, selfRotateSpeed: 0.05, texture: 'textures/phobos.jpg', info: "Inner, fast-orbiting moon." },
        { name: "Deimos", radius: 0.05, distance: 0.9, orbitSpeed: 0.05, selfRotateSpeed: 0.03, texture: 'textures/deimos.jpg', info: "Outer, potato-shaped moon." }
    ],
    "Jupiter": [
        { name: "Io", radius: 0.25, distance: 2.0, orbitSpeed: 0.03, selfRotateSpeed: 0.01, texture: 'textures/io.jpg', info: "Volcanically active." },
        { name: "Europa", radius: 0.2, distance: 3.0, orbitSpeed: 0.02, selfRotateSpeed: 0.008, texture: 'textures/europa.jpg', info: "Icy, possible sub-surface ocean." },
        { name: "Ganymede", radius: 0.35, distance: 4.5, orbitSpeed: 0.015, selfRotateSpeed: 0.006, texture: 'textures/ganymede.jpg', info: "Largest moon in solar system." }
    ],
    "Saturn": [
        { name: "Titan", radius: 0.45, distance: 3.5, orbitSpeed: 0.01, selfRotateSpeed: 0.005, texture: 'textures/titan.jpg', info: "Hazy atmosphere, largest moon." },
        { name: "Rhea", radius: 0.2, distance: 4.5, orbitSpeed: 0.008, selfRotateSpeed: 0.004, info: "Second largest moon." } // Placeholder
    ],
    "Uranus": [
        { name: "Titania", radius: 0.2, distance: 2.5, orbitSpeed: 0.01, selfRotateSpeed: 0.005, info: "Largest moon of Uranus." } // Placeholder
    ],
    "Neptune": [
        { name: "Triton", radius: 0.25, distance: 2.5, orbitSpeed: 0.01, selfRotateSpeed: 0.005, info: "Retrograde orbit." } // Placeholder
    ]
};


// --- Global Variables for Three.js and Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentIntersected = null; 
let selectedBody = null; 

const selectableObjects = []; 
const orbitalBodies = []; 
const selectionDisplay = document.getElementById('selection-display');
const textureLoader = new THREE.TextureLoader(); // Loader for textures


// --- 1. SETUP ---

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// We need to zoom WAY out now!
camera.position.z = 70; 
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

// Calculates distance from Sun (given in AU) and Earth (derived)
function calculateDistanceInfo(data) {
    const distLY_Sun = data.distanceAU * AU_TO_LY;
    
    // Calculate distance from Earth: based on current position relative to Earth's distance
    const earthAU = 1.0; 
    const distanceAUFromEarth = Math.abs(data.distanceAU - earthAU);
    const distLY_Earth = distanceAUFromEarth * AU_TO_LY;

    let sunDistText = `${data.distanceAU} AU / ${distLY_Sun.toPrecision(5)} LY`;
    let earthDistText = `${distLY_Earth.toPrecision(5)} LY (approx)`;

    if (data.type === 'Moon') {
        // Moons use parent planet's AU, and are too close to Earth for practical LY distance
        const parentDistLY = data.parentAU * AU_TO_LY;
        sunDistText = `${data.parentAU} AU (approx) / ${parentDistLY.toPrecision(5)} LY`;
        earthDistText = "Too close to Earth to measure in Light Years.";
    } else if (data.type === 'Star') {
        sunDistText = "N/A (Center of System)";
        earthDistText = "N/A (Center of System)";
    }

    return { sunDistText, earthDistText };
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

// Function to create a planet, moon, or sun with texture
function createTexturedBody(data, isSun = false) {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    
    let material;
    try {
        if (isSun) {
            material = new THREE.MeshBasicMaterial({ map: textureLoader.load(data.texture) });
        } else if (data.texture) {
            material = new THREE.MeshStandardMaterial({ map: textureLoader.load(data.texture) }); 
        } else {
            // Placeholder for moons without texture
            material = new THREE.MeshStandardMaterial({ color: data.color || 0xAAAAAA }); 
        }
    } catch (e) {
        console.warn(`Could not load texture for ${data.name}. Falling back to solid color.`);
        material = new THREE.MeshStandardMaterial({ color: data.color || 0xAAAAAA });
    }
    
    const body = new THREE.Mesh(geometry, material);
    
    body.userData = { 
        name: data.name, 
        type: data.type || 'Planet',
        distanceAU: data.distanceAU || 0,
        parentAU: data.parentAU || 0,
        info: data.info || '',
        distanceSU: data.distance || 0,
        parentName: data.parentName || 'Sun'
    }; 
    selectableObjects.push(body);
    
    return body;
}

// Function to add Saturn's Rings (or any other ring system)
function createRings(planetMesh, texturePath) {
    // Ring parameters (relative to Saturn's radius=1.0)
    const innerRadius = 1.5; 
    const outerRadius = 2.5;
    const segments = 64; 

    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
    
    // Create a texture material for the rings
    const ringTexture = textureLoader.load(texturePath);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide, // Ensure it's visible from both sides
        transparent: true,      // Allows for the dark areas to be see-through
        opacity: 0.7            // Slight transparency
    });

    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    
    // Rotate 90 degrees to lay flat and tilt slightly
    rings.rotation.x = Math.PI / 2; 
    rings.rotation.y = Math.PI / 8; // Slight tilt
    
    planetMesh.add(rings); // Rings are attached to the planet mesh
}


// Function to display the information of the selected body
function displayBodyInfo(data) {
    const { sunDistText, earthDistText } = calculateDistanceInfo(data);
    
    let infoText = `Selected: **${data.name}**`;

    if (data.type === 'Star') {
        infoText += `<br>Location: ${data.info}`;
    } else if (data.type === 'Moon') {
        infoText += `<br>Orbiting: ${data.parentName}<br>${data.info}`;
    }

    infoText += `<br>Dist. from Sun: ${sunDistText}`;
    infoText += `<br>Dist. from Earth: ${earthDistText}`;

    selectionDisplay.innerHTML = infoText;
}


// --- 3. BUILD THE SOLAR SYSTEM ---

createStarfield();

// 3a. The Sun
const sun = createTexturedBody(SUN_DATA, true);
scene.add(sun);


// 3b. All Planets (Mercury to Neptune) and their systems
PLANETS.forEach(planetData => {
    // 1. Create the Planet Mesh
    const planet = createTexturedBody(planetData);
    
    // 2. Create the Orbital Group
    const orbitGroup = new THREE.Object3D();
    planet.position.x = planetData.distance;
    orbitGroup.add(planet);
    scene.add(orbitGroup);
    
    // 3. Create the Orbit Line
    createOrbitLine(planetData.distance);
    
    // 4. Add Rings (if applicable)
    if (planetData.hasRings) {
        createRings(planet, 'textures/saturn_ring.jpg'); [attachment_0](attachment)
    }
    
    // 5. Store for Animation
    orbitalBodies.push({
        name: planetData.name,
        mesh: planet, 
        group: orbitGroup, 
        orbitSpeed: planetData.orbitSpeed, 
        selfRotateSpeed: planetData.selfRotateSpeed
    });

    // 6. Add Moons (if any exist for this planet)
    const moons = MOON_SYSTEMS[planetData.name];
    if (moons) {
        moons.forEach(moonData => {
            // Create the Moon Mesh (using combined data)
            const combinedData = {
                ...moonData,
                type: 'Moon',
                parentName: planetData.name,
                parentAU: planetData.distanceAU, 
                distanceAU: planetData.distanceAU // Moons are effectively same distance from Sun as planet
            };
            const moon = createTexturedBody(combinedData);
            
            // Create the Moon's Orbit Group (orbits the planet mesh)
            const moonOrbitGroup = new THREE.Object3D();
            moonOrbitGroup.add(moon); 
            moon.position.x = moonData.distance;
            planet.add(moonOrbitGroup); // Add to the planet's mesh
            
            // Store for Animation
            orbitalBodies.push({
                name: moonData.name,
                mesh: moon,
                group: moonOrbitGroup,
                orbitSpeed: moonData.orbitSpeed,
                selfRotateSpeed: moonData.selfRotateSpeed
            });
        });
    }
});


// 3c. Asteroid Belt (Between Mars and Jupiter)
const asteroidCount = 1000;
const beltMinDist = 14.0; 
const beltMaxDist = 22.0; 
for (let i = 0; i < asteroidCount; i++) {
    const size = 0.05 + Math.random() * 0.05;
    const distance = beltMinDist + Math.random() * (beltMaxDist - beltMinDist); 
    
    const asteroidGeometry = new THREE.SphereGeometry(size, 8, 8);
    const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    
    asteroid.position.x = distance; 
    asteroid.position.z = (Math.random() - 0.5) * 1.5; // Wider scatter
    asteroid.position.y = (Math.random() - 0.5) * 1.5;
    
    const asteroidOrbit = new THREE.Object3D();
    asteroidOrbit.rotation.y = Math.random() * Math.PI * 2;
    scene.add(asteroidOrbit);

    // Speed scaled down to fit belt's orbit, non-selectable
    orbitalBodies.push({
        name: `Asteroid ${i}`,
        mesh: asteroid,
        group: asteroidOrbit,
        orbitSpeed: 0.0001 + Math.random() * 0.0001, 
        selfRotateSpeed: 0.0
    });
}

// 3d. Kuiper Belt (Beyond Neptune) - Simple representation
const kuiperCount = 500;
const kuiperMinDist = 60.0;
const kuiperMaxDist = 150.0;
for (let i = 0; i < kuiperCount; i++) {
    const size = 0.1 + Math.random() * 0.1;
    const distance = kuiperMinDist + Math.random() * (kuiperMaxDist - kuiperMinDist);
    
    const kuiperGeometry = new THREE.SphereGeometry(size, 8, 8);
    const kuiperMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });
    const kuiper = new THREE.Mesh(kuiperGeometry, kuiperMaterial);
    
    kuiper.position.x = distance; 
    kuiper.position.z = (Math.random() - 0.5) * 10;
    kuiper.position.y = (Math.random() - 0.5) * 10;
    
    const kuiperOrbit = new THREE.Object3D();
    kuiperOrbit.rotation.y = Math.random() * Math.PI * 2;
    scene.add(kuiperOrbit);

    // Very slow orbit
    orbitalBodies.push({
        name: `Kuiper Obj ${i}`,
        mesh: kuiper,
        group: kuiperOrbit,
        orbitSpeed: 0.00001 + Math.random() * 0.00001, 
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
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(selectableObjects);

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
