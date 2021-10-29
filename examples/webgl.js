import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import * as data from './data.js';
import { Controller } from './controller.js';

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
    let el = new Controller(scene, data.getTexture());
    el.build(data.getElements());
    el.add();
    const texture_cone = new THREE.TextureLoader().load( 'textures/cone.jpg' );
    const geometry = new THREE.ConeGeometry( 25, 40, 20);
    const material = new THREE.MeshBasicMaterial( { map: texture_cone } );

    cone_arG = new THREE.Mesh( geometry, material );
    cone_arG.position.x = 200;
    cone_arG.position.y = 100;
    cone_arG.position.z = 200;
    scene.add( cone_arG );

//Afficher l'image

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
