import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import * as creation from './Fonctions.js';

let camera, scene, renderer, controls;

let x, y, z;

let click, raycaster, pivot;
let elements = {};

init();
animate();

function init() {

/**********************
    INITIALISATIONS
************************/
// Initialisation camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = -600;
    camera.position.y = 100;

// Initialisation scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);

// Initialisation renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

// Initialisation Raycaster
    click = new THREE.Vector2();
    raycaster = new THREE.Raycaster();

// Event Listenners
    window.addEventListener('click', onClick); // When click
    window.addEventListener('resize', onWindowResize); // When window's resized

/**********************
    CONTROLS
************************/
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 4;
    controls.update();

/**********************
    BUILDING
************************/

// Towers

    // Tower behind left
    creation.createCylinder([150, 65, 150], [100, 100, 300, 100], ['texture_wall2'], scene);
    creation.createCone([150, 275, 150], [100, 120, 100], ['texture_cone'], scene);

  // Tower behind right
  creation.createCylinder([-175, 30, 175], [70, 70, 230, 100], ['texture_wall2'], scene); // Base
  creation.createCylinder([-175, 150, 175], [85, 85, 40, 100], ['texture_wall2'], scene); // Top of tower

  // Tower front right
  creation.createCylinder([-190, 5, -190], [50, 50, 175, 100], ['texture_wall2'], scene);
  creation.createCone([-190, 125, -190], [50, 65, 50], ['texture_cone'], scene);
  creation.createCylinder([-155, 55, -160], [30, 30, 7.5, 50], ['texture_wood'], scene); // Walk zone

    // Tower front middle right
    creation.createCylinder([-57, 0, -200], [25, 25, 170, 100], ['texture_wall2'], scene);
    creation.createCylinder([-57, 87.5, -200], [30, 30, 20, 100], ['texture_wall2'], scene);

    // Tower front middle left
    creation.createCylinder([57, 0, -200], [25, 25, 170, 100], ['texture_wall2'], scene);
    creation.createCylinder([57, 87.5, -200], [30, 30, 20, 100], ['texture_wall2'], scene);

  // Tower front left
  creation.createCylinder([190, 5, -190], [50, 50, 175, 100], ['texture_wall2'], scene);
  creation.createCone([190, 125, -190], [50, 65, 50], ['texture_cone'], scene);
  creation.createCylinder([155, 55, -160], [30, 30, 7.5, 50], ['texture_wood'], scene); // Walk zone




// Walls

    // Wall behind
    creation.createBox([10, 20, 195], [270, 170, 50], ['texture_wall2'], scene);

    // Wall left
    creation.createBox([195, 0, 0], [20, 140, 400], ['texture_wall2'], scene);
    creation.createBox([170, 55, -70], [30, 7.5, 165], ['texture_wood'], scene); // Walk zone

    // Loop remparts wall left
    z = 32;
    for (var i = 0; i < 6; i++) {
        creation.createBox([195, 75, z], [20, 10, 15], ['texture_wall2'], scene);
        z = z - 30;
    }

    // Wall front left
    creation.createBox([137.5, 0, -200], [150, 140, 20], ['texture_wall2'], scene);
    creation.createBox([105, 55, -175], [140, 7.5, 30], ['texture_wood'], scene); // Walk zone

    // Loop remparts wall front left
    x = 125;
    for (var i = 0; i < 2; i++) {
        creation.createBox([x, 75, -200], [15, 10, 20], ['texture_wall2'], scene);
        x = x - 25;
    }

    // Drawbridge
    creation.createBox([0, 55, -200], [80, 20, 20], ['texture_wall2'], scene); // Mur au-dessus
    creation.createBox([0, -55, -210], [80, 20, 20], ['texture_wall2'], scene); // Mur en-dessous
    pivot = new THREE.Group();
    pivot.position.set( 32, -45, -200);
    let bridge = creation.createBox([-32, 0, -52.5], [65, 5, 105], ['texture_wood'])
    bridge.userData.draggable = true;
    bridge.userData.name = "bridge";
    pivot.userData.status = "down";
    pivot.add(bridge);
    scene.add(pivot);
    elements['bridge'] = pivot;

    // Wall front right
    creation.createBox([-137.5, 0, -200], [150, 140, 20], ['texture_wall2'], scene);
    creation.createBox([-105, 55, -175], [140, 7.5, 30], ['texture_wood'], scene); // Walk zone

    // Loop remparts wall front right
    x = -125;
    for (var i = 0; i < 2; i++) {
        creation.createBox([x, 75, -200], [15, 10, 20], ['texture_wall2'], scene);
        x = x + 25;
    }

    // Wall right
    creation.createBox([-195, 0, 0], [20, 140, 400], ['texture_wall2'], scene);
    creation.createBox([-170, 55, -10], [30, 7.5, 300], ['texture_wood'], scene); // Walk zone

    // Loop remparts wall right
    z = 90;
    for (var i = 0; i < 8; i++) {
        creation.createBox([-195, 75, z], [20, 10, 15], ['texture_wall2'], scene);
        z = z - 30;
    }

// Floor

    // Floor inside castle
    creation.createBox([0, -65, 0], [400, 40, 400], ['texture_dirt'], scene);

    // Water
    creation.createBox([0, -70, 0], [600, 10, 610], ['texture_water'], scene);

    // Grass
    creation.createBox([0, -70, -450], [1200, 40, 300], ['texture_grass'], scene);

    creation.createBox([0, -70, 450], [1200, 40, 300], ['texture_grass'], scene);

    creation.createBox([-450, -70, 0], [300, 40, 1200], ['texture_grass'], scene);

    creation.createBox([450, -70, 0], [300, 40, 1200], ['texture_grass'], scene);

  creation.createBox([0, -85, 0], [900, 10, 900], ['texture_grass'], scene);

// Stairs
    y = -50;
    x = 76;
    for (var i = 0; i < 14; i++) {
        creation.createBox([x, y, 44], [10, 7.5, 65], ['texture_wall2'], scene);
        y = y + 7.5;
        x = x + 8;
    }



    /**********************
        Camera movement
    ************************/

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}


function onClick(event) {
    // Calculates mouse position in normalized device coordinates
    // Allow to have a value between -1 & 1

    click.x = (event.clientX / window.innerWidth) * 2 - 1;
    click.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera( click, camera);
    const found = raycaster.intersectObjects( scene.children, true);
    if(found.length > 0 && found[0].object.userData.draggable == true) {
        checkAnimation(found[0].object.userData.name);
    }
}

function checkAnimation(name) {
    switch(name) {
        case "bridge":
            let counter;
            if(elements[name].userData.status == "down") {
                elements[name].userData.status = "up";
                counter = 0;
                let open = setInterval(function(){
                    elements['bridge'].rotation.x = counter * 0.01;
                    if(elements['bridge'].rotation.x == 1.5) clearInterval(open);
                    counter++;
                }, 10)
            } else {
                elements[name].userData.status = "down";
                counter = 150;
                let open = setInterval(function(){
                    elements['bridge'].rotation.x = counter * 0.01;
                    if(elements['bridge'].rotation.x == 0) clearInterval(open);
                    counter--;
                }, 10)
            }
            break;
        default:
            console.log("Nothing found");
    }
}
