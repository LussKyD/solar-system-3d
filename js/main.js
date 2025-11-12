// A. SCENE, CAMERA, RENDERER SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set initial camera position and add interactive controls
camera.position.z = 15; 
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// B. LIGHTING (The Sun's Radiance)
const ambientLight = new THREE.AmbientLight(0x333333); // Soft, general light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 3, 500); // Bright, focused light source
pointLight.position.set(0, 0, 0); 
scene.add(pointLight);

// C. PLANET FACTORY FUNCTION
// Creates a planet mesh and a group for its orbit.
function createPlanet(radius, color, distance) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const planet = new THREE.Mesh(geometry, material);

    const orbitGroup = new THREE.Object3D();
    
    // Set planet position within its orbit group
    planet.position.x = distance;
    orbitGroup.add(planet);
    scene.add(orbitGroup);

    // Return both the planet mesh and its orbital group
    return { planet, orbitGroup }; 
}

// D. CREATING THE OBJECTS

// 1. The Sun (Uses MeshBasicMaterial to ignore light, making it a constant glow)
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// 2. Mercury (Smallest and closest)
const mercuryData = createPlanet(0.2, 0xAAAAAA, 3); // Radius, Color, Distance
const mercury = mercuryData.planet;
const mercuryOrbit = mercuryData.orbitGroup;

// 3. Venus (Slightly larger, closer to Earth's size)
const venusData = createPlanet(0.4, 0xCC7722, 5);
const venus = venusData.planet;
const venusOrbit = venusData.orbitGroup;

// 4. Earth (Our home!)
const earthData = createPlanet(0.5, 0x0000FF, 8); 
const earth = earthData.planet;
const earthOrbit = earthData.orbitGroup;

// E. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);

    // 1. Sun Rotation
    sun.rotation.y += 0.001; 

    // 2. Orbit & Self-Rotation
    // Mercury (Faster orbit, faster self-rotation)
    mercuryOrbit.rotation.y += 0.015;
    mercury.rotation.y += 0.02;

    // Venus
    venusOrbit.rotation.y += 0.008;
    venus.rotation.y += 0.01;
    
    // Earth 
    earthOrbit.rotation.y += 0.005; 
    earth.rotation.y += 0.007; 

    controls.update(); 
    renderer.render(scene, camera);
}

animate();

// F. RESIZE HANDLER
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
