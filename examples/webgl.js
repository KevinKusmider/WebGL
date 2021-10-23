import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';

let camera, scene, renderer;
let cone, cone2, cone3, cone4, cone5, cone6;
let floor;
let cylinder, cylinder2, cylinder3, cylinder4, cylinder5, cylinder6;
let wall, wall2, wall2bis, wall2ter, wall3, wall4, wall5, wall6, wall7;
let controls;

init();
animate();

function init() {


    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 500;

    scene = new THREE.Scene();

    const texture = new THREE.TextureLoader().load( 'textures/testabode.jpg' );
    const texture2 = new THREE.TextureLoader().load( 'textures/testabode2.jpg' );
    const texture3 = new THREE.TextureLoader().load( 'textures/testabode3.jpg' );

    //LES CONES (J'ai changé la taille et la hauteur des cones => plus stylé)

    const geometry = new THREE.ConeGeometry( 25, 40, 20);
    const material = new THREE.MeshBasicMaterial( { map: texture2 } );
    cone = new THREE.Mesh( geometry, material );
    cone.position.x = 200;
    cone.position.y = 70;
    cone.position.z = 200;
    scene.add( cone );

    cone2 = new THREE.Mesh( geometry, material );
    cone2.position.x = -200;
    cone2.position.y = 70;
    cone2.position.z = 200;
    scene.add( cone2 );

    cone3 = new THREE.Mesh( geometry, material );
    cone3.position.x = -200;
    cone3.position.y = 70;
    cone3.position.z = -200;
    scene.add( cone3 );

    cone4 = new THREE.Mesh( geometry, material );
    cone4.position.x = 200;
    cone4.position.y = 70;
    cone4.position.z = -200;
    scene.add( cone4 );

    cone5 = new THREE.Mesh( geometry, material );
    cone5.position.x = 50;
    cone5.position.y = 70;
    cone5.position.z = -200;
    scene.add( cone5 );

    cone6 = new THREE.Mesh( geometry, material );
    cone6.position.x = -50;
    cone6.position.y = 70;
    cone6.position.z = -200;
    scene.add( cone6 );

    //LES CYLINDER (J'ai ++ la taille des cylinder car c'etait tout petit)

    const geometry2 = new THREE.CylinderGeometry( 25, 25, 100, 100);
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

    //LES WALLS

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

    const geometry8 = new THREE.BoxGeometry( 10, 80, 200)
    wall5 = new THREE.Mesh( geometry8, material3 );
    wall5.position.x = 20;
    wall5.position.y = -10;
    wall5.position.z = 100;
    scene.add( wall5 );

    const geometry9 = new THREE.BoxGeometry( 70, 80, 10)
    wall6 = new THREE.Mesh( geometry9, material3 );
    wall6.position.x = 165;
    wall6.position.y = -10;
    wall6.position.z = 0;
    scene.add( wall6 );

    const geometry10 = new THREE.BoxGeometry( 70, 80, 10)
    wall7 = new THREE.Mesh( geometry9, material3 );
    wall7.position.x = 50;
    wall7.position.y = -10;
    wall7.position.z = 0;
    scene.add( wall7 );

    //LE FLOOR (le sol)
    const material4 = new THREE.MeshBasicMaterial( { map: texture } );
    const geometry7 = new THREE.BoxGeometry( 400, 2, 400);
    floor = new THREE.Mesh( geometry7, material4 );
    floor.position.x = 0;
    floor.position.y = -50;
    scene.add( floor );


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
