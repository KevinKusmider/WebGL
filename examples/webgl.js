import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import * as creation from './Fonctions.js';

let camera, scene, renderer;
let cone_arG, cone_arD, cone_avD, cone_avG, cone_avMG, cone_avMD;
let floor;
let cylinder_arG, cylinder_arD, cylinder_avG, cylinder_avD, cylinder_arDbis, cylinder_avMD, cylinder_avMG;
let wall_ar, wall_avG, wall_avD, pont_levis, wall_D, wall_G, wall5, wall6, wall7, wall_avM;
let water;
let grass_av, grass_ar, grass_D, grass_G;
let controls;

init();
animate();

function init() {

/**********************
    INITIALISATIONS
************************/
//Initialisation de la caméra
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = -600;
    camera.position.y = 100;

// Initialisation de la scène
    scene = new THREE.Scene();

// Initialisation du renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

/**********************
    COTROLS
************************/
    controls = new OrbitControls(camera, renderer.domElement);
    window.addEventListener( 'resize', onWindowResize );

/**********************
    BUILDING
************************/

    creation.createCylinder([0,0,0], [20,20,20], ['texture_wall'], scene);

//Les Cones

    creation.createCone([175, 210, 175], [75, 100, 70], ['texture_cone'], scene);

    creation.createCone([-190, 125, -190], [50, 65, 50], ['texture_cone'], scene);

    creation.createCone([190, 125, -190], [50, 65, 50], ['texture_cone'], scene);

    creation.createCone([175, 210, 175], [75, 100, 70], ['texture_cone'], scene);


//Les Cylindres

    creation.createCylinder([175, 35, 175], [75, 75, 250, 100], ['texture_wall2'], scene);

    creation.createCylinder([-175, 30, 175], [70, 70, 230, 100], ['texture_wall2'], scene);

    creation.createCylinder([-175, 150, 175], [85, 85, 40, 100], ['texture_wall2'], scene);

    creation.createCylinder([190, 5, -190], [50, 50, 175, 100], ['texture_wall2'], scene);

    creation.createCylinder([-190, 5, -190], [50, 50, 175, 100], ['texture_wall2'], scene);

//Bases tours milieu

    creation.createCylinder([-57, -10, -200], [25, 25, 120, 100], ['texture_wall2'], scene);

    creation.createCylinder([57, -10, -200], [25, 25, 120, 100], ['texture_wall2'], scene);


//LES WALLS

//Mur arrière

    creation.createBox([0, -5, 200], [400, 125, 80], ['texture_wall2'], scene);

//Mur avant

    creation.createBox([137.5, -15, -200], [150, 100, 20], ['texture_wall2'], scene);

    creation.createBox([-137.5, -15, -200], [150, 100, 20], ['texture_wall2'], scene);


//Pont-levis

    creation.createBox([0, -45, -260], [65, 5, 120], ['texture_wood'], scene);


//Mur droit

    creation.createBox([-200, -5, 0], [20, 125, 400], ['texture_wall2'], scene);


//Mur gauche

    creation.createBox([200, -5, 0], [20, 125, 400], ['texture_wall2'], scene);

// CHAMBRE



//LE FLOOR (le sol)

    creation.createBox([0, -65, 0], [400, 40, 400], ['texture_dirt'], scene);


//WATER

    creation.createBox([0, -70, 0], [600, 10, 610], ['texture_water'], scene);


//Grass

    creation.createBox([0, -70, -450], [1200, 40, 300], ['texture_grass'], scene);

    creation.createBox([0, -70, 450], [1200, 40, 300], ['texture_grass'], scene);

    creation.createBox([-450, -70, 0], [300, 40, 1200], ['texture_grass'], scene);

    creation.createBox([450, -70, 0], [300, 40, 1200], ['texture_grass'], scene);





}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    controls.update();

    renderer.render( scene, camera );

}
