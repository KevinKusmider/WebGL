import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import * as creation from './Fonctions.js';

let camera, scene, renderer, controls;

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
    CONTROLS
************************/
    controls = new OrbitControls(camera, renderer.domElement);
    window.addEventListener( 'resize', onWindowResize );
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 4;



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
   let z = 32;
   for (var i = 0; i < 6; i++) {
   creation.createBox([195, 75, z], [20, 10, 15], ['texture_wall2'], scene);
   z = z - 30;
   }

  // Wall front left
  creation.createBox([137.5, 0, -200], [150, 140, 20], ['texture_wall2'], scene);
  creation.createBox([105, 55, -175], [140, 7.5, 30], ['texture_wood'], scene); // Walk zone
  // Loop remparts wall front left
   let x = 125;
   for (var i = 0; i < 2; i++) {
   creation.createBox([x, 75, -200], [15, 10, 20], ['texture_wall2'], scene);
   x = x - 25;
   }

  // Drawbridge
  creation.createBox([0, 55, -200], [80, 20, 20], ['texture_wall2'], scene);
  creation.createBox([0, -45, -252.5], [65, 5, 105], ['texture_wood'], scene); // Connexion bar

  // Wall front right
  creation.createBox([-137.5, 0, -200], [150, 140, 20], ['texture_wall2'], scene);
  creation.createBox([-105, 55, -175], [140, 7.5, 30], ['texture_wood'], scene); // Walk zone
  // Loop remparts wall front right
   let x2 = -125;
   for (var i = 0; i < 2; i++) {
   creation.createBox([x2, 75, -200], [15, 10, 20], ['texture_wall2'], scene);
   x2 = x2 + 25;
   }

  // Wall right
  creation.createBox([-195, 0, 0], [20, 140, 400], ['texture_wall2'], scene);
  creation.createBox([-170, 55, -10], [30, 7.5, 300], ['texture_wood'], scene); // Walk zone
  // Loop remparts wall right
   let z4 = 90;
   for (var i = 0; i < 8; i++) {
   creation.createBox([-195, 75, z4], [20, 10, 15], ['texture_wall2'], scene);
   z4 = z4 - 30;
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
     let y = -50;
     let x3 = 76;
     for (var i = 0; i < 14; i++) {
       creation.createBox([x3,y,44], [10,7.5,65], ['texture_wall2'], scene );
       y = y + 7.5;
       x3 = x3 + 8;
     }



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
