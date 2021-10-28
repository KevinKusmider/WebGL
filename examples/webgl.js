import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import * as creation from './Fonctions.js';

let camera, scene, renderer;
let cone_arG, cone_arD, cone_avD, cone_avG, cone_avMG, cone_avMD;
let floor;
let cylinder_arG, cylinder_arD, cylinder_avG, cylinder_avD, cylinder_avMD, cylinder_avMG;
let wall_ar, wall_avG, wall_avD, pont_levis, wall_D, wall_G, wall5, wall6, wall7;
let water;
let grass_av, grass_ar, grass_D, grass_G;
let controls;

init();
animate();

function init() {

//Initialisation de la caméra
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = -600;
    camera.position.y = 100;

    scene = new THREE.Scene();

//Declaration des textures

//     const texture_wall = new THREE.TextureLoader().load( 'textures/wall.jpg' );
//     const texture_wall2 = new THREE.TextureLoader().load( 'textures/wall2.jfif' );
//     const texture_cone = new THREE.TextureLoader().load( 'textures/cone.jpg' );
//     const texture_water = new THREE.TextureLoader().load( 'textures/watertest.jpg' );
//     const texture_wood = new THREE.TextureLoader().load( 'textures/wood.jpg' );
//     const texture_grass = new THREE.TextureLoader().load( 'textures/grass.jpg' );
//     const texture_dirt = new THREE.TextureLoader().load( 'textures/dirt.jfif' );
//
//
// //LES CONES / chapeau des tours
//
//     //Chapeau tours des coins
//     const material = new THREE.MeshBasicMaterial( { map: texture_cone } );

      creation.createCone([200, 100, 200], [25, 40, 25], scene);
      creation.createCone([-200, 100, 200], [25, 40, 25], scene);
      creation.createCone([-200, 100, -200], [25, 40, 25], scene);
      creation.createCone([200, 100, -200], [25, 40, 25], scene);



//
//     // Chapeau des tours de l'entrée
//     const geometry12 = new THREE.ConeGeometry( 18, 30 , 20);
//
//     cone_avMG = new THREE.Mesh( geometry12, material );
//     cone_avMG.position.x = 50;
//     cone_avMG.position.y = 65;
//     cone_avMG.position.z = -200;
//     scene.add( cone_avMG );
//
//     cone_avMD = new THREE.Mesh( geometry12, material );
//     cone_avMD.position.x = -50;
//     cone_avMD.position.y = 65;
//     cone_avMD.position.z = -200;
//     scene.add( cone_avMD );
//
//
// //CYLINDRES / base des tours
//
//     //Base tours des coins
//     const geometry2 = new THREE.CylinderGeometry( 25, 25, 150, 100);
//     const material2 = new THREE.MeshBasicMaterial( { map: texture_wall } );
//
//     cylinder_arG = new THREE.Mesh( geometry2, material2 );
//     cylinder_arG.position.x = 200;
//     cylinder_arG.position.y = 5;
//     cylinder_arG.position.z = 200;
//     scene.add( cylinder_arG );
//
//     cylinder_arD = new THREE.Mesh( geometry2, material2 );
//     cylinder_arD.position.x = -200;
//     cylinder_arD.position.y = 5;
//     cylinder_arD.position.z = 200;
//     scene.add( cylinder_arD );
//
//     cylinder_avG = new THREE.Mesh( geometry2, material2 );
//     cylinder_avG.position.x = 200;
//     cylinder_avG.position.y = 5;
//     cylinder_avG.position.z = -200;
//     scene.add( cylinder_avG );
//
//     cylinder_avD = new THREE.Mesh( geometry2, material2 );
//     cylinder_avD.position.x = -200;
//     cylinder_avD.position.y = 5;
//     cylinder_avD.position.z = -200;
//     scene.add( cylinder_avD );
//
//     //Bases tours milieu
//     const geometry11 = new THREE.CylinderGeometry( 18, 18, 120, 100);
//
//     cylinder_avMD = new THREE.Mesh( geometry11, material2 );
//     cylinder_avMD.position.x = -50;
//     cylinder_avMD.position.y = -10;
//     cylinder_avMD.position.z = -200;
//     scene.add( cylinder_avMD );
//
//     cylinder_avMG = new THREE.Mesh( geometry11, material2 );
//     cylinder_avMG.position.x = 50;
//     cylinder_avMG.position.y = -10;
//     cylinder_avMG.position.z = -200;
//     scene.add( cylinder_avMG );
//
//
// //LES WALLS
//
//   //Mur arrière
      //creation.createWall([0, -5, 200], [400, 400, 400], scene);


      // Mur avant
      creation.createWall([137.5, -15, -200], [150, 100, 20], scene); // Mur Avant Gauche
      creation.createWall([-137.5, -15, -200], [150, 100, 20], scene); // Mur Avant Droit

//
//     //Pont-levis
//     const material6 = new THREE.MeshBasicMaterial( { map: texture_wood } );
//     const geometry6 = new THREE.BoxGeometry( 65, 5, 120);
//
//     pont_levis = new THREE.Mesh( geometry6, material6 );
//     pont_levis.position.z = -260;
//     pont_levis.position.y = -45;
//     scene.add( pont_levis );
//
      //Mur droit
      creation.createWall([-200, -5, 0], [20, 125, 400], scene); // Mur wall_d
      //Mur gauche
      creation.createWall([200, -5, 0], [20, 125, 400], scene); // Mur wall_g
//
// /*
// CHAMBRE
//     const geometry8 = new THREE.BoxGeometry( 10, 80, 200)
//     wall5 = new THREE.Mesh( geometry8, material3 );
//     wall5.position.x = 20;
//     wall5.position.y = -10;
//     wall5.position.z = 100;
//     scene.add( wall5 );
//
//     const geometry9 = new THREE.BoxGeometry( 70, 80, 10)
//     wall6 = new THREE.Mesh( geometry9, material3 );
//     wall6.position.x = 165;
//     wall6.position.y = -10;
//     wall6.position.z = 0;
//     scene.add( wall6 );
//
//     const geometry10 = new THREE.BoxGeometry( 70, 80, 10)
//     wall7 = new THREE.Mesh( geometry9, material3 );
//     wall7.position.x = 50;
//     wall7.position.y = -10;
//     wall7.position.z = 0;
//     scene.add( wall7 ); */
//
//
// //LE FLOOR (le sol)
//
//     const material4 = new THREE.MeshBasicMaterial( { map: texture_dirt } );
//     const geometry7 = new THREE.BoxGeometry( 400, 40, 400);
//
//     floor = new THREE.Mesh( geometry7, material4 );
//     floor.position.y = -65;
//     scene.add( floor );
//
// //WATER
//
//     const material5 = new THREE.MeshBasicMaterial( { map: texture_water } );
//     const geometry13 = new THREE.BoxGeometry( 600, 10, 610);
//
//     water = new THREE.Mesh( geometry13, material5 );
//     water.position.y = -70;
//     scene.add( water );
//
// //Grass
//     const material7 = new THREE.MeshBasicMaterial( { map: texture_grass } );
//     const geometry14 = new THREE.BoxGeometry( 1200, 40, 300);
//     const geometry15 = new THREE.BoxGeometry( 300, 40, 1200);
//
//     grass_av = new THREE.Mesh( geometry14, material7 );
//     grass_av.position.z = -450;
//     grass_av.position.y = -70;
//     scene.add( grass_av );
//
//     grass_ar = new THREE.Mesh( geometry14, material7 );
//     grass_ar.position.z = 450;
//     grass_ar.position.y = -70;
//     scene.add( grass_ar );
//
//     grass_D = new THREE.Mesh( geometry15, material7 );
//     grass_D.position.x = -450;
//     grass_D.position.y = -70;
//     scene.add( grass_D );
//
//     grass_G = new THREE.Mesh( geometry15, material7 );
//     grass_G.position.x = 450;
//     grass_G.position.y = -70;
//     scene.add( grass_G );
//
//
// //Afficher l'image

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    /*
        CONTROLS de la caméra
    */
    controls = new OrbitControls(camera, renderer.domElement);
    window.addEventListener( 'resize', onWindowResize );

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
