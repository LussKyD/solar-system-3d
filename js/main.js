// --- Global Constants ---

// Conversion factors
const AU_TO_LY = 0.000015813; 
const EARTH_DISTANCE_SU = 8.0; 

// The Sun's data
const SUN_DATA = {
    name: "The Sun",
    type: 'Star',
    radius: 1.5,
    color: 0xFFA500,
    texture: 'textures/sun.jpg',
    distanceAU: 0,
    info: "The center of our solar system.",
    radiusKm: 695700,
    orbitalPeriodDays: null,
    orbitalPeriodYears: null
};

// Planet Data (Note: Distances are SCALED for the camera view)
const PLANETS = [
    {
        name: "Mercury",
        type: "Terrestrial planet",
        radius: 0.2,
        distance: 3.0,
        orbitSpeed: 0.015,
        selfRotateSpeed: 0.02,
        distanceAU: 0.39,
        texture: 'textures/mercury.jpg',
        radiusKm: 2440,
        orbitalPeriodDays: 88,
        orbitalPeriodYears: 0.24
    },
    {
        name: "Venus",
        type: "Terrestrial planet",
        radius: 0.4,
        distance: 5.0,
        orbitSpeed: 0.008,
        selfRotateSpeed: 0.01,
        distanceAU: 0.72,
        texture: 'textures/venus.jpg',
        radiusKm: 6052,
        orbitalPeriodDays: 225,
        orbitalPeriodYears: 0.62
    },
    {
        name: "Earth",
        type: "Terrestrial planet",
        radius: 0.5,
        distance: 8.0,
        orbitSpeed: 0.005,
        selfRotateSpeed: 0.007,
        distanceAU: 1.00,
        texture: 'textures/earth.jpg',
        hasClouds: false,
        radiusKm: 6371,
        orbitalPeriodDays: 365,
        orbitalPeriodYears: 1
    },
    {
        name: "Mars",
        type: "Terrestrial planet",
        radius: 0.3,
        distance: 12.0,
        orbitSpeed: 0.004,
        selfRotateSpeed: 0.006,
        distanceAU: 1.52,
        texture: 'textures/mars.jpg',
        radiusKm: 3390,
        orbitalPeriodDays: 687,
        orbitalPeriodYears: 1.88
    },
    {
        name: "Jupiter",
        type: "Gas giant",
        radius: 1.2,
        distance: 25.0,
        orbitSpeed: 0.0008,
        selfRotateSpeed: 0.015,
        distanceAU: 5.20,
        texture: 'textures/jupiter.jpg',
        radiusKm: 69911,
        orbitalPeriodDays: 4333,
        orbitalPeriodYears: 11.86
    },
    {
        name: "Saturn",
        type: "Gas giant",
        radius: 1.0,
        distance: 35.0,
        orbitSpeed: 0.0006,
        selfRotateSpeed: 0.01,
        distanceAU: 9.58,
        texture: 'textures/saturn.jpg',
        hasRings: true,
        radiusKm: 58232,
        orbitalPeriodDays: 10759,
        orbitalPeriodYears: 29.45
    },
    {
        name: "Uranus",
        type: "Ice giant",
        radius: 0.8,
        distance: 45.0,
        orbitSpeed: 0.0003,
        selfRotateSpeed: 0.005,
        distanceAU: 19.22,
        texture: 'textures/uranus.jpg',
        radiusKm: 25362,
        orbitalPeriodDays: 30687,
        orbitalPeriodYears: 84.0
    },
    {
        name: "Neptune",
        type: "Ice giant",
        radius: 0.8,
        distance: 55.0,
        orbitSpeed: 0.0002,
        selfRotateSpeed: 0.004,
        distanceAU: 30.05,
        texture: 'textures/neptune.jpg',
        radiusKm: 24622,
        orbitalPeriodDays: 60190,
        orbitalPeriodYears: 164.8
    },
];

// Data for Moons: Only Earth's moon has the 'moon.jpg' texture, the rest use solid colors.
const MOON_SYSTEMS = {
    "Earth": [
        { name: "Moon", radius: 0.15, distance: 1.5, orbitSpeed: 0.05, selfRotateSpeed: 0.015, texture: 'textures/moon.jpg', info: "Earth's only natural satellite.", radiusKm: 1737, orbitalPeriodDays: 27.3 }
    ],
    "Mars": [
        // Phobos and Deimos will use solid color (no texture defined)
        { name: "Phobos", radius: 0.08, distance: 0.5, orbitSpeed: 0.1, selfRotateSpeed: 0.05, info: "Inner, fast-orbiting moon.", radiusKm: 11, orbitalPeriodDays: 0.3 }, 
        { name: "Deimos", radius: 0.05, distance: 0.9, orbitSpeed: 0.05, selfRotateSpeed: 0.03, info: "Outer, potato-shaped moon.", radiusKm: 6, orbitalPeriodDays: 1.3 }
    ],
    "Jupiter": [
        // Io, Europa, Ganymede will use solid color (no texture defined)
        { name: "Io", radius: 0.25, distance: 2.0, orbitSpeed: 0.03, selfRotateSpeed: 0.01, info: "Volcanically active.", radiusKm: 1821, orbitalPeriodDays: 1.8 },
        { name: "Europa", radius: 0.2, distance: 3.0, orbitSpeed: 0.02, selfRotateSpeed: 0.008, info: "Icy, possible sub-surface ocean.", radiusKm: 1561, orbitalPeriodDays: 3.5 },
        { name: "Ganymede", radius: 0.35, distance: 4.5, orbitSpeed: 0.015, selfRotateSpeed: 0.006, info: "Largest moon in solar system.", radiusKm: 2634, orbitalPeriodDays: 7.2 }
    ],
    "Saturn": [
        { name: "Titan", radius: 0.45, distance: 3.5, orbitSpeed: 0.01, selfRotateSpeed: 0.005, info: "Hazy atmosphere, largest moon.", radiusKm: 2575, orbitalPeriodDays: 16.0 },
        { name: "Rhea", radius: 0.2, distance: 4.5, orbitSpeed: 0.008, selfRotateSpeed: 0.004, info: "Second largest moon.", radiusKm: 764, orbitalPeriodDays: 4.5 } 
    ],
    "Uranus": [
        { name: "Titania", radius: 0.2, distance: 2.5, orbitSpeed: 0.01, selfRotateSpeed: 0.005, info: "Largest moon of Uranus.", radiusKm: 789, orbitalPeriodDays: 8.7 } 
    ],
    "Neptune": [
        { name: "Triton", radius: 0.25, distance: 2.5, orbitSpeed: 0.01, selfRotateSpeed: 0.005, info: "Retrograde orbit.", radiusKm: 1353, orbitalPeriodDays: 5.9 } 
    ]
};

// Highlighted space missions (sample set; can be extended)
// Note: Positions are approximate and scaled for visualization, not precise ephemeris.
const MISSIONS = [
    // Earth orbit & Moon
    {
        id: 'sputnik-1',
        name: 'Sputnik 1',
        agency: 'Soviet Union',
        target: 'Earth',
        type: 'Satellite',
        year: 1957,
        status: 'Reentered atmosphere',
        description: 'First artificial satellite to orbit Earth.',
        altitudeKm: 215,
        longitudeDeg: -20,
        inclinationDeg: 65
    },
    {
        id: 'apollo-11',
        name: 'Apollo 11',
        agency: 'NASA (USA)',
        target: 'Moon',
        type: 'Crewed landing',
        year: 1969,
        status: 'Completed',
        description: 'First crewed Moon landing (Neil Armstrong & Buzz Aldrin).',
        longitudeDeg: 23.47,
        latitudeDeg: 0.67
    },
    {
        id: 'apollo-12',
        name: 'Apollo 12',
        agency: 'NASA (USA)',
        target: 'Moon',
        type: 'Crewed landing',
        year: 1969,
        status: 'Completed',
        description: 'Second crewed Moon landing near Surveyor 3.',
        longitudeDeg: -23.42,
        latitudeDeg: -3.01
    },
    {
        id: 'apollo-14',
        name: 'Apollo 14',
        agency: 'NASA (USA)',
        target: 'Moon',
        type: 'Crewed landing',
        year: 1971,
        status: 'Completed',
        description: 'Third crewed Moon landing at Fra Mauro.',
        longitudeDeg: -17.47,
        latitudeDeg: -3.65
    },
    {
        id: 'apollo-15',
        name: 'Apollo 15',
        agency: 'NASA (USA)',
        target: 'Moon',
        type: 'Crewed landing',
        year: 1971,
        status: 'Completed',
        description: 'First mission with the Lunar Roving Vehicle.',
        longitudeDeg: 3.65,
        latitudeDeg: 26.1
    },
    {
        id: 'apollo-16',
        name: 'Apollo 16',
        agency: 'NASA (USA)',
        target: 'Moon',
        type: 'Crewed landing',
        year: 1972,
        status: 'Completed',
        description: 'Explored the lunar highlands near Descartes.',
        longitudeDeg: 15.5,
        latitudeDeg: -8.97
    },
    {
        id: 'apollo-17',
        name: 'Apollo 17',
        agency: 'NASA (USA)',
        target: 'Moon',
        type: 'Crewed landing',
        year: 1972,
        status: 'Completed',
        description: 'Last crewed Moon landing; first geologist on the Moon.',
        longitudeDeg: 30.77,
        latitudeDeg: 20.19
    },
    {
        id: 'apollo-13',
        name: 'Apollo 13',
        agency: 'NASA (USA)',
        target: 'Moon',
        type: 'Crewed mission (aborted landing)',
        year: 1970,
        status: 'Crew returned safely after in-flight failure.',
        description: 'Famous \"successful failure\" mission; no lunar landing.'
    },
    {
        id: 'luna-2',
        name: 'Luna 2',
        agency: 'Soviet Union',
        target: 'Moon',
        type: 'Impact probe',
        year: 1959,
        status: 'Impact on lunar surface.',
        description: 'First human-made object to reach the Moon.'
    },
    {
        id: 'luna-9',
        name: 'Luna 9',
        agency: 'Soviet Union',
        target: 'Moon',
        type: 'Lander',
        year: 1966,
        status: 'Completed',
        description: 'First successful soft landing on the Moon.'
    },
    {
        id: 'luna-15',
        name: 'Luna 15',
        agency: 'Soviet Union',
        target: 'Moon',
        type: 'Sample return (failed)',
        year: 1969,
        status: 'Crashed during descent near Mare Crisium.',
        description: 'Attempted sample return mission that failed during landing.'
    },
    {
        id: 'chang-e-3',
        name: 'Chang\'e 3',
        agency: 'CNSA (China)',
        target: 'Moon',
        type: 'Lander & rover',
        year: 2013,
        status: 'Mission complete.',
        description: 'First soft landing on the Moon since 1976; carried Yutu rover.'
    },
    {
        id: 'chang-e-4',
        name: 'Chang\'e 4',
        agency: 'CNSA (China)',
        target: 'Moon',
        type: 'Lander & rover',
        year: 2018,
        status: 'Operational.',
        description: 'First soft landing on the lunar far side; carries Yutu-2 rover.'
    },
    {
        id: 'chandrayaan-2',
        name: 'Chandrayaan-2',
        agency: 'ISRO (India)',
        target: 'Moon',
        type: 'Orbiter, lander & rover (partial success)',
        year: 2019,
        status: 'Orbiter operational; lander crashed.',
        description: 'India\'s second lunar mission; orbiter continues to study the Moon.'
    },
    {
        id: 'iss',
        name: 'International Space Station',
        agency: 'NASA / Roscosmos / ESA / JAXA / CSA',
        target: 'Earth',
        type: 'Space station',
        year: 1998,
        status: 'Operational',
        description: 'Modular space station in low Earth orbit, permanently crewed.',
        altitudeKm: 420,
        longitudeDeg: 45,
        inclinationDeg: 51.6
    },
    {
        id: 'hubble',
        name: 'Hubble Space Telescope',
        agency: 'NASA / ESA',
        target: 'Earth',
        type: 'Space telescope',
        year: 1990,
        status: 'Operational',
        description: 'Iconic space telescope that revolutionized astronomy.',
        altitudeKm: 540,
        longitudeDeg: 160,
        inclinationDeg: 28.5
    },
    // Mars missions
    {
        id: 'viking-1',
        name: 'Viking 1',
        agency: 'NASA (USA)',
        target: 'Mars',
        type: 'Lander & orbiter',
        year: 1975,
        status: 'Completed',
        description: 'First successful Mars lander and orbiter mission.',
        orbitalRadiusOffset: 1.0,
        alongOrbitDeg: 40
    },
    {
        id: 'venera-7',
        name: 'Venera 7',
        agency: 'Soviet Union',
        target: 'Venus',
        type: 'Lander',
        year: 1970,
        status: 'First successful landing on another planet (short-lived).',
        orbitalRadiusOffset: 0.8,
        alongOrbitDeg: -60
    },
    {
        id: 'mars-climate-orbiter',
        name: 'Mars Climate Orbiter',
        agency: 'NASA (USA)',
        target: 'Mars',
        type: 'Orbiter',
        year: 1998,
        status: 'Lost due to navigation error (metric/imperial mismatch).',
        orbitalRadiusOffset: 0.8,
        alongOrbitDeg: 120
    },
    {
        id: 'sojourner',
        name: 'Mars Pathfinder / Sojourner',
        agency: 'NASA (USA)',
        target: 'Mars',
        type: 'Lander & rover',
        year: 1996,
        status: 'Completed',
        description: 'First successful Mars rover.',
        orbitalRadiusOffset: 0.6,
        alongOrbitDeg: -120
    },
    {
        id: 'spirit',
        name: 'Spirit',
        agency: 'NASA (USA)',
        target: 'Mars',
        type: 'Rover',
        year: 2003,
        status: 'Mission complete',
        description: 'Mars Exploration Rover; operated for over 6 years.',
        orbitalRadiusOffset: 0.4,
        alongOrbitDeg: -10
    },
    {
        id: 'opportunity',
        name: 'Opportunity',
        agency: 'NASA (USA)',
        target: 'Mars',
        type: 'Rover',
        year: 2003,
        status: 'Mission complete',
        description: 'Mars rover that operated for nearly 15 years.',
        orbitalRadiusOffset: 0.4,
        alongOrbitDeg: 30
    },
    {
        id: 'curiosity',
        name: 'Curiosity',
        agency: 'NASA (USA)',
        target: 'Mars',
        type: 'Rover',
        year: 2011,
        status: 'Operational',
        description: 'Nuclear-powered rover exploring Gale Crater.',
        orbitalRadiusOffset: 0.2,
        alongOrbitDeg: 70
    },
    {
        id: 'perseverance',
        name: 'Perseverance',
        agency: 'NASA (USA)',
        target: 'Mars',
        type: 'Rover',
        year: 2020,
        status: 'Operational',
        description: 'Mars rover exploring Jezero Crater with a focus on astrobiology.',
        orbitalRadiusOffset: 0.1,
        alongOrbitDeg: -70
    },
    // Outer solar system
    {
        id: 'voyager-1',
        name: 'Voyager 1',
        agency: 'NASA (USA)',
        target: 'Interstellar space',
        type: 'Flyby / interstellar probe',
        year: 1977,
        status: 'Operational',
        description: 'Most distant human-made object, exploring interstellar space.',
        radialDistance: 140, // scaled distance from Sun
        polarAngleDeg: 20,
        azimuthDeg: 45
    },
    {
        id: 'voyager-2',
        name: 'Voyager 2',
        agency: 'NASA (USA)',
        target: 'Outer planets',
        type: 'Flyby / interstellar probe',
        year: 1977,
        status: 'Operational',
        description: 'Only spacecraft to have visited Uranus and Neptune.',
        radialDistance: 120,
        polarAngleDeg: 40,
        azimuthDeg: -60
    },
    {
        id: 'pioneer-10',
        name: 'Pioneer 10',
        agency: 'NASA (USA)',
        target: 'Jupiter / outer solar system',
        type: 'Flyby probe',
        year: 1972,
        status: 'Mission complete',
        description: 'First spacecraft to travel through the asteroid belt and make direct observations of Jupiter.',
        radialDistance: 80,
        polarAngleDeg: 30,
        azimuthDeg: 120
    },
    {
        id: 'cassini-huygens',
        name: 'Cassini–Huygens',
        agency: 'NASA / ESA / ASI',
        target: 'Saturn & Titan',
        type: 'Orbiter & lander',
        year: 1997,
        status: 'Mission complete (Grand Finale plunge in 2017).',
        description: 'Revealed Saturn\'s rings, moons, and delivered the Huygens probe to Titan.',
        attachTo: 'Saturn',
        radialOffset: 3.0,
        angleDeg: -45
    },
    {
        id: 'juno',
        name: 'Juno',
        agency: 'NASA (USA)',
        target: 'Jupiter',
        type: 'Orbiter',
        year: 2011,
        status: 'Operational',
        description: 'Studies Jupiter\'s composition, gravity field, and magnetosphere.',
        attachTo: 'Jupiter',
        radialOffset: 3.0,
        angleDeg: 60
    },
    {
        id: 'new-horizons',
        name: 'New Horizons',
        agency: 'NASA (USA)',
        target: 'Pluto & Kuiper Belt',
        type: 'Flyby probe',
        year: 2006,
        status: 'Extended mission in Kuiper Belt.',
        description: 'First spacecraft to explore Pluto and its moons, now exploring Kuiper Belt objects.',
        radialDistance: 90,
        polarAngleDeg: 70,
        azimuthDeg: -20
    },
    // Sample missions from other agencies
    {
        id: 'hayabusa2',
        name: 'Hayabusa2',
        agency: 'JAXA (Japan)',
        target: 'Asteroid Ryugu',
        type: 'Sample return',
        year: 2014,
        status: 'Sample returned to Earth in 2020.',
        description: 'Brought samples from asteroid Ryugu to Earth.',
        radialDistance: 50,
        polarAngleDeg: 80,
        azimuthDeg: 10
    },
    {
        id: 'rosetta',
        name: 'Rosetta / Philae',
        agency: 'ESA (Europe)',
        target: 'Comet 67P/Churyumov–Gerasimenko',
        type: 'Comet orbiter & lander',
        year: 2004,
        status: 'Mission complete.',
        description: 'First spacecraft to orbit a comet and deploy a lander (Philae).',
        radialDistance: 65,
        polarAngleDeg: 100,
        azimuthDeg: 150
    }
];

// Learn-more links for every selectable (Wikipedia / official). Key by name for bodies, by id for missions.
const BODY_LINKS = {
    'The Sun': 'https://en.wikipedia.org/wiki/Sun',
    'Mercury': 'https://en.wikipedia.org/wiki/Mercury_(planet)',
    'Venus': 'https://en.wikipedia.org/wiki/Venus',
    'Earth': 'https://en.wikipedia.org/wiki/Earth',
    'Mars': 'https://en.wikipedia.org/wiki/Mars',
    'Jupiter': 'https://en.wikipedia.org/wiki/Jupiter',
    'Saturn': 'https://en.wikipedia.org/wiki/Saturn',
    'Uranus': 'https://en.wikipedia.org/wiki/Uranus',
    'Neptune': 'https://en.wikipedia.org/wiki/Neptune',
    'Moon': 'https://en.wikipedia.org/wiki/Moon',
    'Phobos': 'https://en.wikipedia.org/wiki/Phobos_(moon)',
    'Deimos': 'https://en.wikipedia.org/wiki/Deimos_(moon)',
    'Io': 'https://en.wikipedia.org/wiki/Io_(moon)',
    'Europa': 'https://en.wikipedia.org/wiki/Europa_(moon)',
    'Ganymede': 'https://en.wikipedia.org/wiki/Ganymede_(moon)',
    'Titan': 'https://en.wikipedia.org/wiki/Titan_(moon)',
    'Rhea': 'https://en.wikipedia.org/wiki/Rhea_(moon)',
    'Titania': 'https://en.wikipedia.org/wiki/Titania_(moon)',
    'Triton': 'https://en.wikipedia.org/wiki/Triton_(moon)'
};
const MISSION_LINKS = {
    'sputnik-1': 'https://en.wikipedia.org/wiki/Sputnik_1',
    'apollo-11': 'https://en.wikipedia.org/wiki/Apollo_11',
    'apollo-12': 'https://en.wikipedia.org/wiki/Apollo_12',
    'apollo-13': 'https://en.wikipedia.org/wiki/Apollo_13',
    'apollo-14': 'https://en.wikipedia.org/wiki/Apollo_14',
    'apollo-15': 'https://en.wikipedia.org/wiki/Apollo_15',
    'apollo-16': 'https://en.wikipedia.org/wiki/Apollo_16',
    'apollo-17': 'https://en.wikipedia.org/wiki/Apollo_17',
    'luna-2': 'https://en.wikipedia.org/wiki/Luna_2',
    'luna-9': 'https://en.wikipedia.org/wiki/Luna_9',
    'luna-15': 'https://en.wikipedia.org/wiki/Luna_15',
    'chang-e-3': 'https://en.wikipedia.org/wiki/Chang%27e_3',
    'chang-e-4': 'https://en.wikipedia.org/wiki/Chang%27e_4',
    'chandrayaan-2': 'https://en.wikipedia.org/wiki/Chandrayaan-2',
    'iss': 'https://en.wikipedia.org/wiki/International_Space_Station',
    'hubble': 'https://en.wikipedia.org/wiki/Hubble_Space_Telescope',
    'viking-1': 'https://en.wikipedia.org/wiki/Viking_1',
    'venera-7': 'https://en.wikipedia.org/wiki/Venera_7',
    'mars-climate-orbiter': 'https://en.wikipedia.org/wiki/Mars_Climate_Orbiter',
    'sojourner': 'https://en.wikipedia.org/wiki/Mars_Pathfinder',
    'spirit': 'https://en.wikipedia.org/wiki/Spirit_(rover)',
    'opportunity': 'https://en.wikipedia.org/wiki/Opportunity_(rover)',
    'curiosity': 'https://en.wikipedia.org/wiki/Curiosity_(rover)',
    'perseverance': 'https://en.wikipedia.org/wiki/Perseverance_(rover)',
    'voyager-1': 'https://en.wikipedia.org/wiki/Voyager_1',
    'voyager-2': 'https://en.wikipedia.org/wiki/Voyager_2',
    'pioneer-10': 'https://en.wikipedia.org/wiki/Pioneer_10',
    'cassini-huygens': 'https://en.wikipedia.org/wiki/Cassini%E2%80%93Huygens',
    'juno': 'https://en.wikipedia.org/wiki/Juno_(spacecraft)',
    'new-horizons': 'https://en.wikipedia.org/wiki/New_Horizons',
    'hayabusa2': 'https://en.wikipedia.org/wiki/Hayabusa2',
    'rosetta': 'https://en.wikipedia.org/wiki/Rosetta_(spacecraft)'
};

// --- Global Variables for Three.js and Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentIntersected = null; 
let selectedBody = null; 

const selectableObjects = []; 
const orbitalBodies = []; 
const orbitLines = [];
const asteroidGroups = [];
const kuiperGroups = [];
const labelPairs = [];
let moonMesh = null;
let earthMesh = null;

let focusedBody = null;
let surfaceMarkersList = [];
let surfaceMarkerByMissionId = {};

const ACCENT_BY_BODY = { Moon: 'accent-moon', Earth: 'accent-earth', Mars: 'accent-mars' };

const LAUNCH_SITES = [
    { name: 'Cape Canaveral / KSC', country: 'USA', lat: 28.5, lon: -80.6 },
    { name: 'Baikonur Cosmodrome', country: 'Kazakhstan (Russia)', lat: 45.9, lon: 63.3 },
    { name: 'Vandenberg SFB', country: 'USA', lat: 34.7, lon: -120.6 },
    { name: 'Jiuquan', country: 'China', lat: 40.96, lon: 100.29 },
    { name: 'Tanegashima', country: 'Japan', lat: 30.4, lon: 130.97 },
    { name: 'Plesetsk', country: 'Russia', lat: 62.93, lon: 40.57 },
    { name: 'Guiana Space Centre', country: 'France/ESA', lat: 5.24, lon: -52.77 },
    { name: 'Satish Dhawan (Sriharikota)', country: 'India', lat: 13.72, lon: 80.23 }
];

const selectionDisplay = document.getElementById('selection-display');
const detailModal = document.getElementById('detail-modal');
const detailBody = document.getElementById('detail-body');
const detailCloseBtn = document.getElementById('detail-close');
const focusOverlay = document.getElementById('focus-overlay');
const bodyPanel = document.getElementById('body-panel');
const bodyPanelCloseBtn = document.getElementById('body-panel-close');
const bodyModal = document.getElementById('body-modal');
const bodyModalCloseBtn = document.getElementById('body-modal-close');
const modalGlobeView = document.getElementById('modal-globe-view');
const modalMarkerTooltip = document.getElementById('modal-marker-tooltip');
const textureLoader = new THREE.TextureLoader();

let modalRenderer = null;
let modalCamera = null;
let modalZoomDistance = 3;
let modalAngle = 0;
const MODAL_ZOOM_MIN = 1.5;
const MODAL_ZOOM_MAX = 12; 

// Animation / controls state
let animationPaused = false;
let speedMultiplier = 1;
let showLabels = true;
let cameraTransition = null;

// Store initial camera state for reset function
const INITIAL_CAMERA_POSITION = new THREE.Vector3(0, 0, 70);
const INITIAL_CONTROLS_TARGET = new THREE.Vector3(0, 0, 0);


// --- 1. SETUP ---

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera to initial position
camera.position.copy(INITIAL_CAMERA_POSITION); 

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
// Set control target to initial target (the Sun)
controls.target.copy(INITIAL_CONTROLS_TARGET); 


// Lighting
const ambientLight = new THREE.AmbientLight(0x333333); 
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 3, 500); 
pointLight.position.set(0, 0, 0); 
scene.add(pointLight);


// --- 2. UTILITY FUNCTIONS ---

function calculateDistanceInfo(data) {
    const distLY_Sun = data.distanceAU * AU_TO_LY;
    
    const earthAU = 1.0; 
    const distanceAUFromEarth = Math.abs(data.distanceAU - earthAU);
    const distLY_Earth = distanceAUFromEarth * AU_TO_LY;

    let sunDistText = `${data.distanceAU} AU / ${distLY_Sun.toPrecision(5)} LY`;
    let earthDistText = `${distLY_Earth.toPrecision(5)} LY (approx)`;

    if (data.type === 'Moon') {
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
    const starCount = 9000;
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
    orbitLines.push(orbitRing);

    return orbitRing;
}

// Function handles missing textures gracefully (using solid color fallback)
function createTexturedBody(data, isSun = false) {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    
    let material;
    
    if (isSun) {
        material = new THREE.MeshBasicMaterial({ map: textureLoader.load(data.texture) });
    } else if (data.texture) {
        // Use texture if provided
        material = new THREE.MeshStandardMaterial({ 
            map: textureLoader.load(data.texture), 
        }); 
    } else {
        // Use fallback color if no texture is provided (e.g., for Phobos, Io, etc.)
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
        parentName: data.parentName || 'Sun',
        radius: data.radius || 0,
        radiusKm: data.radiusKm || null,
        orbitalPeriodDays: data.orbitalPeriodDays || null,
        orbitalPeriodYears: data.orbitalPeriodYears || null,
        agency: data.agency || null,
        missionType: data.missionType || null
    }; 
    selectableObjects.push(body);
    
    return body;
}

function createRings(planetMesh, texturePath) {
    const innerRadius = 1.5; 
    const outerRadius = 2.5;
    const segments = 64; 

    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
    
    const ringTexture = textureLoader.load(texturePath);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,      
        opacity: 0.7            
    });

    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    
    rings.rotation.x = Math.PI / 2; 
    rings.rotation.y = Math.PI / 8;
    
    planetMesh.add(rings); }

// Create a small floating text label sprite for a body
function createLabelSprite(text) {
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);
    ctx.font = '28px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(15,23,42,0.9)';
    ctx.strokeStyle = 'rgba(148,163,184,0.9)';
    ctx.lineWidth = 4;

    const cx = size / 2;
    const cy = size / 2;
    const paddingX = 8;
    const paddingY = 6;
    const textMetrics = ctx.measureText(text);
    const w = textMetrics.width + paddingX * 2;
    const h = 34 + paddingY * 2;

    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 10);
    } else {
        ctx.rect(cx - w / 2, cy - h / 2, w, h);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(text, cx, cy + 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(4, 2, 1);

    return sprite;
}

function displayBodyInfo(data) {
    const { sunDistText, earthDistText } = calculateDistanceInfo(data);
    
    const orbitalDays = data.orbitalPeriodDays;
    const orbitalYears = data.orbitalPeriodYears;
    const radiusKm = data.radiusKm;
    const agency = data.agency;
    const missionType = data.missionType;
    const launchYear = data.year || data.launchYear;

    let typeLabel = data.type || 'Body';
    if (data.type === 'Moon') {
        typeLabel = 'Moon';
    } else if (data.type === 'Star') {
        typeLabel = 'Star';
    } else if (missionType) {
        typeLabel = missionType;
    }

    let infoText = `<strong>${data.name}</strong><br>${typeLabel}`;

    if (agency) {
        infoText += ` • ${agency}`;
    }
    if (launchYear) {
        infoText += ` • Launched: ${launchYear}`;
    }

    if (data.type === 'Star') {
        if (data.info) {
            infoText += `<br>${data.info}`;
        }
    } else if (data.type === 'Moon') {
        infoText += `<br>Orbits: ${data.parentName}`;
        if (data.info) {
            infoText += `<br>${data.info}`;
        }
    } else if (missionType) {
        if (data.info) {
            infoText += `<br>${data.info}`;
        }
        if (data.status) {
            infoText += `<br>Status: ${data.status}`;
        }
    } else if (data.info) {
        infoText += `<br>${data.info}`;
    }

    if (radiusKm) {
        infoText += `<br>Radius: ${radiusKm.toLocaleString()} km`;
    }

    if (orbitalDays || orbitalYears) {
        const orbitalParts = [];
        if (orbitalDays) {
            orbitalParts.push(`${orbitalDays.toLocaleString()} days`);
        }
        if (orbitalYears) {
            orbitalParts.push(`${orbitalYears} years`);
        }
        if (orbitalParts.length > 0) {
            infoText += `<br>Orbital period: ${orbitalParts.join(" / ")}`;
        }
    }

    if (!missionType) {
        infoText += `<br>Dist. from Sun: ${sunDistText}`;
        infoText += `<br>Dist. from Earth: ${earthDistText}`;
    }

    selectionDisplay.innerHTML = infoText;
}

// Build HTML for the detail modal (study view)
function buildDetailContent(data) {
    if (!data) return '';
    const name = data.name || 'Unknown';
    const typeLabel = data.type || 'Body';
    let html = `<h2>${name}</h2><p class="detail-type">${typeLabel}</p>`;
    if (data.missionType && data.parentName) {
        const siteLabel = data.parentName === 'Moon' ? 'Lunar site' : data.parentName === 'Earth' ? 'Earth orbit' : data.parentName;
        html += `<p class="detail-site"><strong>Site:</strong> ${siteLabel} — ${data.missionType}</p>`;
    }
    if (data.agency) html += `<p><strong>Agency:</strong> ${data.agency}</p>`;
    if (data.year || data.launchYear) html += `<p><strong>Launch year:</strong> ${data.year || data.launchYear}</p>`;
    if (data.status) html += `<p><strong>Status:</strong> ${data.status}</p>`;
    if (data.info) html += `<div class="detail-section">${data.info}</div>`;
    if (data.radiusKm) html += `<p><strong>Radius:</strong> ${data.radiusKm.toLocaleString()} km</p>`;
    if (data.orbitalPeriodDays || data.orbitalPeriodYears) {
        const parts = [];
        if (data.orbitalPeriodDays) parts.push(`${data.orbitalPeriodDays.toLocaleString()} days`);
        if (data.orbitalPeriodYears) parts.push(`${data.orbitalPeriodYears} years`);
        html += `<p><strong>Orbital period:</strong> ${parts.join(' / ')}</p>`;
    }
    if (data.distanceAU !== undefined && data.type !== 'Star' && !data.missionType) {
        const { sunDistText, earthDistText } = calculateDistanceInfo(data);
        html += `<p><strong>Distance from Sun:</strong> ${sunDistText}</p>`;
        html += `<p><strong>Distance from Earth:</strong> ${earthDistText}</p>`;
    }
    if (data.parentName && data.type === 'Moon') html += `<p><strong>Orbits:</strong> ${data.parentName}</p>`;
    const link = data.url || BODY_LINKS[data.name] || (data.id && MISSION_LINKS[data.id]);
    if (link) html += `<p class="detail-link"><a href="${link}" target="_blank" rel="noopener noreferrer">Learn more →</a></p>`;
    return html;
}

function openDetailModal(content, screenX, screenY) {
    if (!detailModal || !detailBody) return;
    detailBody.innerHTML = content;
    const contentEl = detailModal.querySelector('.detail-content');
    detailModal.classList.remove('hidden');
    detailModal.setAttribute('aria-hidden', 'false');
    if (contentEl) {
        contentEl.removeAttribute('style');
        detailModal.classList.remove('detail-modal--beside');
    }
    if (typeof screenX === 'number' && typeof screenY === 'number' && contentEl) {
        const pad = 16;
        const maxW = 520;
        const maxH = 0.85 * window.innerHeight;
        let left = screenX + pad;
        let top = screenY - 40;
        if (left + maxW > window.innerWidth - pad) left = screenX - maxW - pad;
        if (left < pad) left = pad;
        if (top < pad) top = pad;
        if (top + maxH > window.innerHeight - pad) top = window.innerHeight - maxH - pad;
        contentEl.style.left = left + 'px';
        contentEl.style.top = top + 'px';
        contentEl.style.maxWidth = maxW + 'px';
        contentEl.style.maxHeight = maxH + 'px';
        detailModal.classList.add('detail-modal--beside');
    }
}

function closeDetailModal() {
    if (!detailModal) return;
    detailModal.classList.add('hidden');
    detailModal.setAttribute('aria-hidden', 'true');
}

function getZoomDistanceForBody(radius) {
    return Math.max(3, (radius || 0.5) * 5);
}

function latLonToSpherePosition(latDeg, lonDeg, radius) {
    const phi = (90 - latDeg) * Math.PI / 180;
    const theta = (lonDeg + 180) * Math.PI / 180;
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

function createSurfaceMarkers(bodyName, bodyMesh) {
    clearSurfaceMarkers();
    if (!bodyMesh) return;
    const radius = bodyMesh.userData.radius || (bodyMesh.geometry ? bodyMesh.geometry.parameters.radius : 0.5);
    const r = typeof radius === 'number' ? radius : 0.5;
    surfaceMarkerByMissionId = {};

    if (bodyName === 'Moon' && moonMesh) {
        const lunarMissions = MISSIONS.filter(m => m.target === 'Moon' && (m.latitudeDeg != null || m.longitudeDeg != null));
        lunarMissions.forEach(mission => {
            const lat = mission.latitudeDeg != null ? mission.latitudeDeg : 0;
            const lon = mission.longitudeDeg != null ? mission.longitudeDeg : 0;
            const pos = latLonToSpherePosition(lat, lon, r * 1.02);
            const geom = new THREE.SphereGeometry(0.03, 12, 12);
            const mat = new THREE.MeshBasicMaterial({
                color: 0xffdd88,
                transparent: true,
                opacity: 0.95
            });
            const dot = new THREE.Mesh(geom, mat);
            dot.position.copy(pos);
            dot.userData = { name: mission.name, agency: mission.agency, year: mission.year, type: mission.type, id: mission.id };
            bodyMesh.add(dot);
            surfaceMarkersList.push(dot);
            if (mission.id) {
                surfaceMarkerByMissionId[mission.id] = dot;
            }
        });
    } else if (bodyName === 'Earth' && earthMesh) {
        const earthMissions = MISSIONS.filter(m => m.target === 'Earth');
        earthMissions.forEach(mission => {
            const lon = mission.longitudeDeg != null ? mission.longitudeDeg : 0;
            const lat = mission.inclinationDeg != null ? Math.max(-80, Math.min(80, mission.inclinationDeg)) : 0;
            const pos = latLonToSpherePosition(lat, lon, r * 1.02);
            const geom = new THREE.SphereGeometry(0.03, 12, 12);
            const mat = new THREE.MeshBasicMaterial({
                color: 0x60a5fa,
                transparent: true,
                opacity: 0.9
            });
            const dot = new THREE.Mesh(geom, mat);
            dot.position.copy(pos);
            dot.userData = { name: mission.name, agency: mission.agency, year: mission.year, type: mission.type, id: mission.id };
            bodyMesh.add(dot);
            surfaceMarkersList.push(dot);
            if (mission.id) {
                surfaceMarkerByMissionId[mission.id] = dot;
            }
        });
    }
}

function clearSurfaceMarkers() {
    surfaceMarkersList.forEach(m => {
        if (m.parent) m.parent.remove(m);
    });
    surfaceMarkersList = [];
    surfaceMarkerByMissionId = {};
}

function populateBodyPanel(data) {
    if (!bodyPanel) return;
    const titleEl = document.getElementById('body-panel-title');
    const statsEl = document.getElementById('body-panel-stats');
    const overviewEl = document.getElementById('body-tab-overview');
    const missionsEl = document.getElementById('body-tab-missions');
    const sitesEl = document.getElementById('body-tab-sites');
    if (!titleEl || !statsEl || !overviewEl) return;

    titleEl.textContent = data.name || '—';
    const radiusKm = data.radiusKm;
    const period = data.orbitalPeriodDays || data.orbitalPeriodYears;
    let stats = '';
    if (radiusKm) stats += `Radius: ${radiusKm.toLocaleString()} km`;
    if (period) stats += (stats ? ' · ' : '') + `Orbital period: ${data.orbitalPeriodYears ? data.orbitalPeriodYears + ' yr' : data.orbitalPeriodDays + ' d'}`;
    if (data.parentName && data.type === 'Moon') stats += (stats ? ' · ' : '') + `Orbits: ${data.parentName}`;
    statsEl.textContent = stats || '—';

    overviewEl.innerHTML = buildDetailContent(data);

    const bodyName = data.name;
    const missionsForBody = MISSIONS.filter(m => m.target === bodyName || m.attachTo === bodyName);
    if (missionsEl) {
        if (missionsForBody.length) {
            missionsEl.innerHTML = missionsForBody.map(m => `
                <div class="mission-item">
                    <strong>${m.name}</strong> · ${m.agency || '—'} (${m.year || '—'})<br>
                    <span style="color:#94a3b8">${m.type}</span> · ${m.status || ''}
                </div>
            `).join('');
        } else {
            missionsEl.innerHTML = '<p style="color:#94a3b8">No missions in database for this body.</p>';
        }
    }

    if (sitesEl) {
        if (bodyName === 'Moon') {
            const lunar = MISSIONS.filter(m => m.target === 'Moon');
            sitesEl.innerHTML = '<h3>Landing / impact sites</h3><ul>' + lunar.map(m =>
                `<li><strong>${m.name}</strong> (${m.agency}, ${m.year}) — ${m.type}</li>`
            ).join('') + '</ul>';
        } else if (bodyName === 'Earth') {
            sitesEl.innerHTML = '<h3>Launch sites</h3><ul>' + LAUNCH_SITES.map(s =>
                `<li><strong>${s.name}</strong> — ${s.country}</li>`
            ).join('') + '</ul>';
        } else {
            sitesEl.innerHTML = '<p style="color:#94a3b8">Surface sites available for Moon and Earth.</p>';
        }
    }

    const sitesTab = bodyPanel.querySelector('.body-tab[data-tab="sites"]');
    if (sitesTab) {
        sitesTab.textContent = bodyName === 'Moon' ? 'Landing Sites' : bodyName === 'Earth' ? 'Launch Sites' : 'Sites';
    }
    bodyPanel.classList.remove('accent-moon', 'accent-earth', 'accent-mars');
    const accent = ACCENT_BY_BODY[bodyName];
    if (accent) bodyPanel.classList.add(accent);
}

function openBodyPanel(mesh) {
    if (!mesh || !mesh.userData) return;
    const data = mesh.userData;
    focusedBody = mesh;
    if (focusOverlay) { focusOverlay.classList.remove('hidden'); }
    if (bodyPanel) {
        bodyPanel.classList.remove('hidden');
        populateBodyPanel(data);
        const tabs = bodyPanel.querySelectorAll('.body-tab');
        const panes = bodyPanel.querySelectorAll('.body-tab-pane');
        tabs.forEach((t, i) => {
            t.classList.toggle('active', i === 0);
            if (panes[i]) panes[i].classList.toggle('active', i === 0);
        });
    }
    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);
    const dist = getZoomDistanceForBody(data.radius);
    const dir = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
    const targetPos = worldPos.clone().add(dir.multiplyScalar(dist));
    startCameraTransition(targetPos, worldPos.clone(), 1200);
    createSurfaceMarkers(data.name, mesh);
}

function closeBodyPanel() {
    focusedBody = null;
    clearSurfaceMarkers();
    if (focusOverlay) focusOverlay.classList.add('hidden');
    if (bodyPanel) bodyPanel.classList.add('hidden');
}

function ensureModalRenderer() {
    if (!modalGlobeView || modalRenderer) return;
    const w = modalGlobeView.clientWidth || 400;
    const h = modalGlobeView.clientHeight || 360;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    modalGlobeView.appendChild(canvas);
    modalRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    modalRenderer.setSize(w, h);
    modalRenderer.setClearColor(0x1e293b, 0.15);
    modalCamera = new THREE.PerspectiveCamera(50, w / h, 0.01, 1000);
}

function populateBodyModal(data) {
    if (!bodyModal) return;
    const titleEl = document.getElementById('modal-body-title');
    const subtitleEl = document.getElementById('modal-body-subtitle');
    const factEl = document.getElementById('modal-fact-card');
    const descEl = document.getElementById('modal-body-description');
    const missionsEl = document.getElementById('modal-missions-list');
    if (!titleEl) return;

    titleEl.textContent = data.name || '—';
    if (subtitleEl) subtitleEl.textContent = 'From our project';

    const facts = [];
    if (data.radiusKm) facts.push(`Radius: ${data.radiusKm.toLocaleString()} km`);
    if (data.orbitalPeriodDays) facts.push(`Orbital period: ${data.orbitalPeriodDays} days`);
    if (data.orbitalPeriodYears) facts.push(`Orbital period: ${data.orbitalPeriodYears} years`);
    if (data.parentName && data.type === 'Moon') facts.push(`Orbits: ${data.parentName}`);
    if (factEl) factEl.textContent = facts.length ? facts.join(' · ') : (data.info || 'Select a body to see key facts.');

    if (descEl) descEl.textContent = data.info || (data.type === 'Star' ? 'The center of our solar system.' : 'Explore missions and sites in the list below.');

    const bodyName = data.name;
    const missionsForBody = MISSIONS.filter(m => m.target === bodyName || m.attachTo === bodyName);
    if (missionsEl) {
        if (missionsForBody.length) {
            missionsEl.innerHTML = missionsForBody.map((m, idx) =>
                `<div class="mission-row selectable" data-mission-index="${idx}" data-mission-id="${m.id || ''}"><strong>${m.name}</strong> · ${m.agency || '—'} (${m.year || '—'}) — ${m.type}</div>`
            ).join('');
            missionsEl._missionsData = missionsForBody;
            missionsEl.querySelectorAll('.mission-row.selectable').forEach(row => {
                row.addEventListener('click', () => {
                    const missionId = row.getAttribute('data-mission-id');
                    if (missionId) {
                        selectMissionInModalById(missionId);
                    }
                });
            });
        } else {
            missionsEl.innerHTML = '<div class="mission-row">No missions in database for this body.</div>';
            missionsEl._missionsData = [];
        }
    }
}

function selectMissionInModalById(missionId) {
    if (!missionId) return;
    const missionsEl = document.getElementById('modal-missions-list');
    if (!missionsEl || !missionsEl._missionsData) return;
    const missionsForBody = missionsEl._missionsData;
    const mission = missionsForBody.find(m => m.id === missionId);
    if (!mission) return;

    missionsEl.querySelectorAll('.mission-row.selected').forEach(r => r.classList.remove('selected'));
    const row = missionsEl.querySelector(`.mission-row.selectable[data-mission-id="${missionId}"]`);
    if (row) {
        row.classList.add('selected');
    }

    let detailEl = missionsEl.querySelector('.mission-selected-detail');
    if (!detailEl) {
        detailEl = document.createElement('div');
        detailEl.className = 'mission-selected-detail';
        missionsEl.appendChild(detailEl);
    }
    const desc = mission.description || mission.status || 'No additional details.';
    detailEl.innerHTML = `<p class="mission-detail-text">${desc}</p>`;
    detailEl.classList.remove('hidden');

    if (modalMarkerTooltip) {
        modalMarkerTooltip.textContent = mission.name || 'Missions';
        modalMarkerTooltip.classList.remove('hidden');
    }

    surfaceMarkersList.forEach(m => {
        if (!m || !m.scale) return;
        const isSelected = m.userData && m.userData.id === missionId;
        const s = isSelected ? 1.7 : 1.0;
        m.scale.set(s, s, s);
    });
}

function openBodyModal(mesh) {
    if (!mesh || !mesh.userData) return;
    const data = mesh.userData;
    focusedBody = mesh;
    modalZoomDistance = Math.max(MODAL_ZOOM_MIN, Math.min(MODAL_ZOOM_MAX, (data.radius || 0.5) * 6));
    modalAngle = 0;

    if (focusOverlay) focusOverlay.classList.remove('hidden');
    if (bodyModal) bodyModal.classList.remove('hidden');
    populateBodyModal(data);
    createSurfaceMarkers(data.name, mesh);

    ensureModalRenderer();
    if (modalGlobeView && modalRenderer) {
        const w = modalGlobeView.clientWidth || 400;
        const h = modalGlobeView.clientHeight || 360;
        modalRenderer.setSize(w, h);
        modalRenderer.domElement.width = w;
        modalRenderer.domElement.height = h;
        modalCamera.aspect = w / h;
        modalCamera.updateProjectionMatrix();
    }

    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);
    const dist = getZoomDistanceForBody(data.radius);
    const dir = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
    const targetPos = worldPos.clone().add(dir.multiplyScalar(dist));
    startCameraTransition(targetPos, worldPos.clone(), 1200);
}

function closeBodyModal() {
    focusedBody = null;
    clearSurfaceMarkers();
    if (focusOverlay) focusOverlay.classList.add('hidden');
    if (bodyModal) bodyModal.classList.add('hidden');
    if (modalMarkerTooltip) modalMarkerTooltip.classList.add('hidden');
}

// Function to reset the view
function resetView() {
    closeBodyPanel();
    closeBodyModal();
    controls.reset(); 
    camera.position.copy(INITIAL_CAMERA_POSITION);
    controls.target.copy(INITIAL_CONTROLS_TARGET);
    controls.update();
    selectedBody = null; 
    selectionDisplay.innerHTML = 'View reset. Hover over a planet or the Sun!';
}


// --- 3. BUILD THE SOLAR SYSTEM ---

createStarfield();

// 3a. The Sun
const sun = createTexturedBody(SUN_DATA, true);
scene.add(sun);

// Label for the Sun
const sunLabel = createLabelSprite(SUN_DATA.name);
scene.add(sunLabel);
labelPairs.push({ mesh: sun, label: sunLabel });


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
        createRings(planet, 'textures/saturn_ring.jpg');
    }

    // 5. Store Planet for Animation
    orbitalBodies.push({
        name: planetData.name,
        mesh: planet, 
        group: orbitGroup, 
        orbitSpeed: planetData.orbitSpeed, 
        selfRotateSpeed: planetData.selfRotateSpeed
    });

    if (planetData.name === 'Earth') earthMesh = planet;

    // 6. Label for the planet
    const planetLabel = createLabelSprite(planetData.name);
    scene.add(planetLabel);
    labelPairs.push({ mesh: planet, label: planetLabel });

    // 7. Add Moons (if any exist for this planet)
    const moons = MOON_SYSTEMS[planetData.name];
    if (moons) {
        moons.forEach(moonData => {
            const combinedData = {
                ...moonData,
                type: 'Moon',
                parentName: planetData.name,
                parentAU: planetData.distanceAU, 
                distanceAU: planetData.distanceAU
            };
            const moon = createTexturedBody(combinedData);
            
            const moonOrbitGroup = new THREE.Object3D();
            moonOrbitGroup.add(moon); 
            moon.position.x = moonData.distance;
            planet.add(moonOrbitGroup); 
            
            orbitalBodies.push({
                name: moonData.name,
                mesh: moon,
                group: moonOrbitGroup,
                orbitSpeed: moonData.orbitSpeed,
                selfRotateSpeed: moonData.selfRotateSpeed
            });

            if (planetData.name === 'Earth' && moonData.name === 'Moon') {
                moonMesh = moon;
            }
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
    asteroid.position.z = (Math.random() - 0.5) * 1.5; 
    asteroid.position.y = (Math.random() - 0.5) * 1.5;
    
    const asteroidOrbit = new THREE.Object3D();
    asteroidOrbit.rotation.y = Math.random() * Math.PI * 2;
    asteroidOrbit.add(asteroid);
    scene.add(asteroidOrbit);
    asteroidGroups.push(asteroidOrbit);

    // FIX: Ensure mesh is the asteroid, and group is the orbit.
    orbitalBodies.push({
        name: `Asteroid ${i}`,
        mesh: asteroid,
        group: asteroidOrbit,
        orbitSpeed: 0.0001 + Math.random() * 0.0001, 
        selfRotateSpeed: 0.0
    });
}

// 3d. Kuiper Belt (Beyond Neptune)
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
    kuiperOrbit.add(kuiper);
    scene.add(kuiperOrbit);
    kuiperGroups.push(kuiperOrbit);

    // FIX: Ensure mesh is the kuiper object, and group is the orbit.
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

    if (!animationPaused) {
        sun.rotation.y += 0.001 * speedMultiplier; 

        // Rotate orbital groups and bodies using the current speed multiplier
        orbitalBodies.forEach(body => {
            if (!body) return;
            if (body.group) {
                body.group.rotation.y += body.orbitSpeed * speedMultiplier; 
            }
            if (body.mesh) {
                body.mesh.rotation.y += body.selfRotateSpeed * speedMultiplier;
            }
        });
    }

    // Smooth camera transitions for presets
    if (cameraTransition) {
        const now = performance.now();
        const elapsed = now - cameraTransition.startTime;
        const t = Math.min(1, elapsed / cameraTransition.duration);
        const easedT = t * t * (3 - 2 * t); // smoothstep

        camera.position.lerpVectors(
            cameraTransition.startPosition,
            cameraTransition.endPosition,
            easedT
        );
        controls.target.lerpVectors(
            cameraTransition.startTarget,
            cameraTransition.endTarget,
            easedT
        );

        if (t >= 1) {
            cameraTransition = null;
        }
    }

    // Update label positions and visibility
    labelPairs.forEach(pair => {
        if (!pair || !pair.mesh || !pair.label) return;
        pair.label.visible = showLabels;
        if (!showLabels) {
            return;
        }
        const offset = (pair.mesh.userData.radius || 1) * 2 + 0.5;
        const worldPos = new THREE.Vector3();
        pair.mesh.getWorldPosition(worldPos);
        pair.label.position.copy(worldPos);
        pair.label.position.y += offset;
    });

    // Modal view: render focused body with second camera into modal canvas
    if (bodyModal && !bodyModal.classList.contains('hidden') && focusedBody && modalRenderer && modalCamera && modalGlobeView) {
        const cw = modalGlobeView.clientWidth || 400;
        const ch = modalGlobeView.clientHeight || 360;
        if (modalRenderer.domElement.width !== cw || modalRenderer.domElement.height !== ch) {
            modalRenderer.setSize(cw, ch);
            modalRenderer.domElement.width = cw;
            modalRenderer.domElement.height = ch;
            modalCamera.aspect = cw / ch;
            modalCamera.updateProjectionMatrix();
        }
        const worldPos = new THREE.Vector3();
        focusedBody.getWorldPosition(worldPos);
        const dx = modalZoomDistance * Math.sin(modalAngle);
        const dz = modalZoomDistance * Math.cos(modalAngle);
        modalCamera.position.set(worldPos.x + dx, worldPos.y + modalZoomDistance * 0.15, worldPos.z + dz);
        modalCamera.lookAt(worldPos);
        modalRenderer.render(scene, modalCamera);
    }

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

            // Focus the camera on the selected body
            const worldPos = new THREE.Vector3();
            clickedObject.getWorldPosition(worldPos);

            // Special zoom-in for the Moon
            if (selectedBody.userData && selectedBody.userData.name === 'Moon') {
                const toCamera = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
                const targetPosition = worldPos.clone().add(toCamera.multiplyScalar(5));
                startCameraTransition(targetPosition, worldPos, 1500);
            } else {
                controls.target.copy(worldPos);
            }
        }
    } else {
        selectedBody = null;
        selectionDisplay.innerHTML = 'Hover over a planet or the Sun!';
    }
});

// Double-click: celestial body → zoom + glassmorphic panel + surface markers; mission → popup beside
window.addEventListener('dblclick', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(selectableObjects);
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        const data = obj.userData;
        const isCelestial = data && data.type && data.type !== 'Mission';
        if (isCelestial) {
            openBodyModal(obj);
        } else {
            const content = buildDetailContent(data);
            if (content) {
                const worldPos = new THREE.Vector3();
                obj.getWorldPosition(worldPos);
                worldPos.project(camera);
                const screenX = (worldPos.x + 1) * 0.5 * window.innerWidth;
                const screenY = (1 - worldPos.y) * 0.5 * window.innerHeight;
                openDetailModal(content, screenX, screenY);
            }
        }
    }
});

// Detail modal close
if (detailCloseBtn) detailCloseBtn.addEventListener('click', closeDetailModal);
if (detailModal) {
    const overlay = detailModal.querySelector('.detail-overlay');
    if (overlay) overlay.addEventListener('click', closeDetailModal);
}

// Body panel close and overlay click
if (bodyPanelCloseBtn) bodyPanelCloseBtn.addEventListener('click', closeBodyPanel);
if (focusOverlay) focusOverlay.addEventListener('click', () => { closeBodyPanel(); closeBodyModal(); });

// White modal: close, backdrop, zoom, rotate
if (bodyModalCloseBtn) bodyModalCloseBtn.addEventListener('click', closeBodyModal);
if (bodyModal) {
    const backdrop = bodyModal.querySelector('.body-modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeBodyModal);
}
document.getElementById('modal-zoom-in')?.addEventListener('click', () => {
    modalZoomDistance = Math.max(MODAL_ZOOM_MIN, modalZoomDistance / 1.25);
});
document.getElementById('modal-zoom-out')?.addEventListener('click', () => {
    modalZoomDistance = Math.min(MODAL_ZOOM_MAX, modalZoomDistance * 1.25);
});
document.getElementById('modal-rotate')?.addEventListener('click', () => {
    modalAngle += 0.4;
});

// Modal globe: helpers for surface marker picking + tooltip + selection
function pickSurfaceMarkerAt(clientX, clientY) {
    if (!modalRenderer || !modalCamera || !focusedBody) return null;
    const canvas = modalRenderer.domElement;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        return null;
    }
    const ndcX = (x / rect.width) * 2 - 1;
    const ndcY = -(y / rect.height) * 2 + 1;
    const threshold = 0.08;
    for (let i = 0; i < surfaceMarkersList.length; i++) {
        const m = surfaceMarkersList[i];
        const p = new THREE.Vector3();
        m.getWorldPosition(p);
        p.project(modalCamera);
        if (Math.abs(p.x - ndcX) < threshold && Math.abs(p.y - ndcY) < threshold) {
            return m;
        }
    }
    return null;
}

function updateModalMarkerTooltip(clientX, clientY) {
    if (!modalMarkerTooltip) return;
    const marker = pickSurfaceMarkerAt(clientX, clientY);
    if (marker && marker.userData) {
        modalMarkerTooltip.textContent = marker.userData.name || 'Missions';
        modalMarkerTooltip.classList.remove('hidden');
    } else {
        modalMarkerTooltip.classList.add('hidden');
    }
}

function handleModalMarkerClick(clientX, clientY) {
    const marker = pickSurfaceMarkerAt(clientX, clientY);
    if (!marker || !marker.userData || !marker.userData.id) return;
    selectMissionInModalById(marker.userData.id);
}

if (modalGlobeView) {
    modalGlobeView.addEventListener('mousemove', (e) => { updateModalMarkerTooltip(e.clientX, e.clientY); });
    modalGlobeView.addEventListener('mouseleave', () => { if (modalMarkerTooltip) modalMarkerTooltip.classList.add('hidden'); });
    modalGlobeView.addEventListener('click', (e) => { handleModalMarkerClick(e.clientX, e.clientY); });
}

// Body panel tabs
if (bodyPanel) {
    bodyPanel.querySelectorAll('.body-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            bodyPanel.querySelectorAll('.body-tab').forEach(t => t.classList.remove('active'));
            bodyPanel.querySelectorAll('.body-tab-pane').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const pane = document.getElementById('body-tab-' + tabId);
            if (pane) pane.classList.add('active');
        });
    });
}

// Button click listener bound to the function
document.getElementById('reset-view-button').addEventListener('click', resetView);

// UI control bindings
const toggleAnimationButton = document.getElementById('toggle-animation-button');
const speedSelect = document.getElementById('speed-select');
const toggleOrbitsCheckbox = document.getElementById('toggle-orbits');
const toggleAsteroidsCheckbox = document.getElementById('toggle-asteroids');
const toggleKuiperCheckbox = document.getElementById('toggle-kuiper');
const toggleLabelsCheckbox = document.getElementById('toggle-labels');
const presetButtons = document.querySelectorAll('.preset-button');

if (toggleAnimationButton) {
    toggleAnimationButton.addEventListener('click', () => {
        animationPaused = !animationPaused;
        toggleAnimationButton.textContent = animationPaused ? 'Resume orbits' : 'Pause orbits';
    });
}

if (speedSelect) {
    speedSelect.addEventListener('change', (event) => {
        const value = parseFloat(event.target.value);
        speedMultiplier = isNaN(value) ? 1 : value;
    });
}

if (toggleOrbitsCheckbox) {
    toggleOrbitsCheckbox.addEventListener('change', () => {
        const visible = toggleOrbitsCheckbox.checked;
        orbitLines.forEach(line => {
            if (line) line.visible = visible;
        });
    });
}

if (toggleAsteroidsCheckbox) {
    toggleAsteroidsCheckbox.addEventListener('change', () => {
        const visible = toggleAsteroidsCheckbox.checked;
        asteroidGroups.forEach(group => {
            if (group) group.visible = visible;
        });
    });
}

if (toggleKuiperCheckbox) {
    toggleKuiperCheckbox.addEventListener('change', () => {
        const visible = toggleKuiperCheckbox.checked;
        kuiperGroups.forEach(group => {
            if (group) group.visible = visible;
        });
    });
}

if (toggleLabelsCheckbox) {
    toggleLabelsCheckbox.addEventListener('change', () => {
        showLabels = toggleLabelsCheckbox.checked;
    });
}

// Camera preset helper
function startCameraTransition(targetPosition, targetLookAt, durationMs) {
    cameraTransition = {
        startTime: performance.now(),
        duration: durationMs,
        startPosition: camera.position.clone(),
        endPosition: targetPosition.clone(),
        startTarget: controls.target.clone(),
        endTarget: targetLookAt.clone()
    };
}

if (presetButtons && presetButtons.length) {
    presetButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const preset = btn.getAttribute('data-preset');
            const duration = 1200;
            const center = new THREE.Vector3(0, 0, 0);

            if (preset === 'inner') {
                startCameraTransition(new THREE.Vector3(0, 10, 35), center, duration);
            } else if (preset === 'giants') {
                startCameraTransition(new THREE.Vector3(0, 15, 60), center, duration);
            } else if (preset === 'outer') {
                startCameraTransition(new THREE.Vector3(0, 40, 120), center, duration);
            } else if (preset === 'top') {
                startCameraTransition(new THREE.Vector3(0, 120, 0), center, duration);
            }
        });
    });
}

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
