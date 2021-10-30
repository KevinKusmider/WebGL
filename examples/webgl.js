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

// Towers

  // Tower behind left
  creation.createCylinder([150, 65, 150], [100, 100, 300, 100], ['texture_wall2'], scene);
  creation.createCone([150, 275, 150], [100, 120, 100], ['texture_cone'], scene);

  // Tower behind right
  creation.createCylinder([-175, 30, 175], [70, 70, 230, 100], ['texture_wall2'], scene); // Base
  creation.createCylinder([-175, 150, 175], [85, 85, 40, 100], ['texture_wall2'], scene); // Haut de la tour

  // Tower front right
  creation.createCylinder([-190, 5, -190], [50, 50, 175, 100], ['texture_wall2'], scene);
  creation.createCone([-190, 125, -190], [50, 65, 50], ['texture_cone'], scene);

  // Tower front middle right
  creation.createCylinder([-57, -5, -200], [25, 25, 160, 100], ['texture_wall2'], scene);

  // Tower front middle left
  creation.createCylinder([57, -5, -200], [25, 25, 160, 100], ['texture_wall2'], scene);

  // Tower front left
  creation.createCylinder([190, 5, -190], [50, 50, 175, 100], ['texture_wall2'], scene);
  creation.createCone([190, 125, -190], [50, 65, 50], ['texture_cone'], scene);



// Walls

  // Wall behind
  creation.createBox([10, -5, 150], [270, 120, 110], ['texture_wall2'], scene);

  // Wall left
  creation.createBox([195, -5, 0], [30, 125, 400], ['texture_wall2'], scene);

  // Wall front left
  creation.createBox([137.5, -15, -200], [150, 100, 20], ['texture_wall2'], scene);

  // Drawbridge
  creation.createBox([0, -45, -252.5], [65, 5, 105], ['texture_wood'], scene);

  // Wall front right
  creation.createBox([-137.5, -15, -200], [150, 100, 20], ['texture_wall2'], scene);

  // Wall right
  creation.createBox([-195, -5, 0], [30, 125, 400], ['texture_wall2'], scene);



// Floor

  // Floor into castle
  creation.createBox([0, -65, 0], [400, 40, 400], ['texture_dirt'], scene);

  // Water
  creation.createBox([0, -70, 0], [600, 10, 610], ['texture_water'], scene);

  // Grass
  creation.createBox([0, -70, -450], [1200, 40, 300], ['texture_grass'], scene);

  creation.createBox([0, -70, 450], [1200, 40, 300], ['texture_grass'], scene);

  creation.createBox([-450, -70, 0], [300, 40, 1200], ['texture_grass'], scene);

  creation.createBox([450, -70, 0], [300, 40, 1200], ['texture_grass'], scene);



/**********************
    Camera movement
************************/

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
