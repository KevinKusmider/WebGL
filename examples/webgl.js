import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';

let camera, scene, renderer;
let cone, cone2, cone3, cone4;
let cylinder, cylinder2, cylinder3, cylinder4, cylinder5, cylinder6;
let wall, wall2, wall2bis, wall2ter, wall3, wall4;
let controls;

init();
animate();

function init() {


    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 500;

    scene = new THREE.Scene();

    const texture = new THREE.TextureLoader().load( 'textures/WalkingManSpriteSheet.png' );

    const geometry = new THREE.ConeGeometry( 20, 20, 20);
    const material = new THREE.MeshBasicMaterial( { map: texture } );
    cone = new THREE.Mesh( geometry, material );
    cone.position.x = 200;
    cone.position.y = 60;
    cone.position.z = 200;
    scene.add( cone );

    cone2 = new THREE.Mesh( geometry, material );
    cone2.position.x = -200;
    cone2.position.y = 60;
    cone2.position.z = 200;
    scene.add( cone2 );

    cone3 = new THREE.Mesh( geometry, material );
    cone3.position.x = -200;
    cone3.position.y = 60;
    cone3.position.z = -200;
    scene.add( cone3 );

    cone4 = new THREE.Mesh( geometry, material );
    cone4.position.x = 200;
    cone4.position.y = 60;
    cone4.position.z = -200;
    scene.add( cone4 );

    const geometry2 = new THREE.CylinderGeometry( 20, 20, 100, 100);
    const material2 = new THREE.MeshBasicMaterial( { map: texture } );
    cylinder = new THREE.Mesh( geometry2, material2 );
    cylinder.position.x = 200;
    cylinder.position.z = 200;
    scene.add( cylinder );

    cylinder2 = new THREE.Mesh( geometry2, material2 );
    cylinder2.position.x = -200;
    cylinder2.position.z = 200;
    scene.add( cylinder2 );

    cylinder3 = new THREE.Mesh( geometry2, material2 );
    cylinder3.position.x = -200;
    cylinder3.position.z = -200;
    scene.add( cylinder3 );


    cylinder4 = new THREE.Mesh( geometry2, material2 );
    cylinder4.position.x = 200;
    cylinder4.position.z = -200;
    scene.add( cylinder4 );

    cylinder5 = new THREE.Mesh( geometry2, material2 );
    cylinder5.position.x = 50;
    cylinder5.position.z = -200;
    scene.add( cylinder5 );
    cylinder6 = new THREE.Mesh( geometry2, material2 );
    cylinder6.position.x = -50;
    cylinder6.position.z = -200;
    scene.add( cylinder6 );

    const geometry3 = new THREE.BoxGeometry( 400, 80, 10);
    const material3 = new THREE.MeshBasicMaterial( { map: texture } );
    wall = new THREE.Mesh( geometry3, material3 );
    wall.position.z = 200;
    wall.position.y = -10;
    scene.add( wall );

    const geometry5 = new THREE.BoxGeometry( 150, 80, 10);
    wall2 = new THREE.Mesh( geometry5, material3 );
    wall2.position.x = 137.5;
    wall2.position.z = -200;
    wall2.position.y = -10;
    scene.add( wall2 );
    wall2bis = new THREE.Mesh( geometry5, material3 );
    wall2bis.position.x = -137.5;
    wall2bis.position.z = -200;
    wall2bis.position.y = -10;
    scene.add( wall2bis );
    const geometry6 = new THREE.BoxGeometry( 60, 10, 80);
    wall2ter = new THREE.Mesh( geometry6, material3 );
    wall2ter.position.z = -240;
    wall2ter.position.y = -45;
    scene.add( wall2ter );

    const geometry4 = new THREE.BoxGeometry( 10, 80, 400);
    wall3 = new THREE.Mesh( geometry4, material3 );
    wall3.position.x = -200;
    wall3.position.y = -10;
    scene.add( wall3 );

    wall4 = new THREE.Mesh( geometry4, material3 );
    wall4.position.x = 200;
    wall4.position.y = -10;
    scene.add( wall4 );


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    /*
        CONTROLS
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
