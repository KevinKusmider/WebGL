import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import * as creation from './Fonctions.js';
import { GUI }  from './jsm/libs/dat.gui.module.js';

let camera, scene, renderer, controls;

let x, y, z;
let gui;
let click, raycaster, pivot;
let spotLight,lightHelper, shadowCameraHelper, spotLight2,lightHelper2, shadowCameraHelper2,clock,mixer;
let elements = {};


// init();
// animate();

init();

animate();


buildGui();
render();



function init() {
/**********************
    INITIALISATIONS
************************/
  clock = new THREE.Clock();
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
    // enable les ombres et le type de l'ombre
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;


// Initialisation Raycaster
    click = new THREE.Vector2(); // capture x & y position in Vector2 var
    raycaster = new THREE.Raycaster(); // capture the clicked element, mouse picking

// Event Listenners
    window.addEventListener('click', onClick); // When click
    window.addEventListener('resize', onWindowResize); // When window's resized

//lights
    const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
    scene.add( ambient );


    spotLight = new THREE.SpotLight( 0xffffff, 1);
    spotLight.position.set( -1000,1000,0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 1700;

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.focus = 1;
    scene.add( spotLight );

        // lightHelper = new THREE.SpotLightHelper( spotLight );
				// scene.add( lightHelper );
        //
				// shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
				// scene.add( shadowCameraHelper );

        // spotLight2 = new THREE.SpotLight( 0xffffff, 1);
				// spotLight2.position.set( 0,500,400 );
				// spotLight2.angle = Math.PI / 4;
				// spotLight2.penumbra = 0.1;
				// spotLight2.decay = 2;
				// spotLight2.distance = 1700;
        //
				// spotLight2.castShadow = true;
				// spotLight2.shadow.mapSize.width = 512;
				// spotLight2.shadow.mapSize.height = 512;
				// spotLight2.shadow.camera.near = 10;
				// spotLight2.shadow.camera.far = 200;
				// spotLight2.shadow.focus = 1;
				// scene.add( spotLight2 );
        //
        // lightHelper2 = new THREE.SpotLightHelper( spotLight2 );
				// scene.add( lightHelper2 );
        //
				// shadowCameraHelper2 = new THREE.CameraHelper( spotLight2.shadow.camera );
				// scene.add( shadowCameraHelper2 );





/**********************
    CONTROLS
************************/
    controls = new OrbitControls(camera, renderer.domElement); // define methode of controls
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxDistance = 10000; //limit camera zoom outward
    controls.minDistance = 1000; //limit camera zoom inward
    controls.enablePan = false; //Stop camera panning
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
    creation.createBox([0, 68, -200], [80, 15, 20], ['texture_wall2'], scene); // wall above
    creation.createBox([0, -55, -200], [80, 20, 10], ['texture_wall2'], scene); // wall uper
    pivot = new THREE.Group(); // permet d'avoir un point d'encrage/origine au milieu de la base de la box
    pivot.position.set( 32.5, -45, -200); // Dawnbridge's Origin
    let bridge = creation.createBox([-32, 0, -52.5], [65, 5, 105], ['texture_wood'])  // Création du pont-levis
    bridge.userData.draggable = true; // Ajout de l'attribut draggable
    bridge.userData.name = "bridge"; // On définit le nom du pont
    pivot.userData.status = "up"; // On définit la position du pont-levis au debut
    pivot.add(bridge); // Ajout du pont dans le groupe pivot
    scene.add(pivot); // Ajout dans la scène de l'objet pivot
    elements['bridge'] = pivot;   // On applique la valeur de pivot dans elements['bridge'] // C'est un tableaau si on veut rajouter des éléments plus tard
    elements['bridge'].rotation.x = 1.5; // Rotation initiale du pont-levis (0 si en bas, 1.5 si il est fermé)

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
     ANIMALS
************************/

    // const light = new THREE.AmbientLight(0xffffff, 1);
    // light.position.set(375, 50,10);
    // scene.add(light);


    const loader = new GLTFLoader();

    loader.load(
        // Ressource URL
        './3Delements/Pheonix/untitled.glb',
        // Called when the ressource is loaded
        function ( gltf ) {
            const model = gltf.scene;
            const animations = gltf.animations;

            let elementMesh = gltf.scene.children[0];
            elementMesh.scale.set(1, 1, 1);
            model.position.set(0, 500,0);
            model.rotation.z = Math.PI/16;
            model.rotation.y = Math.PI/2;
            model.traverse(function (object) { if(object.isMesh) object.castShadow = true;})
            mixer = new THREE.AnimationMixer( model );

            const action = mixer.clipAction( animations[ 0 ] ); // play the first animation
            action.play();
            scene.add(model);
        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        }
    );

var i = 0;
let time = setInterval(function(){
  if(i == 0){
    if(spotLight.position.y != 1000){
      spotLight.position.y += 2;
      i = 0;
      render()
    }else{
      if(spotLight.position.x != 1000){
        spotLight.position.x += 1;
        i = 0;
        render()
      }else {
        i = 1;
      }
    }
  }
  if(i == 1){
    if(spotLight.position.y != -1000){
      spotLight.position.y -= 2;
      i = 1;
      render()
    }else{
      if(spotLight.position.x != -1000){
        spotLight.position.x -= 1;
        i = 1;
        render()
      }else {
        i = 0;
      }
    }
  }
}, 10)
} // Fin de la fonction init


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}


function animate() {

    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    mixer.update(delta);
    renderer.render(scene, camera);
}


function onClick(event) {
    // Calculates mouse position in normalized device coordinates
    // Allow to have a value between -1 & 1

    click.x = (event.clientX / window.innerWidth) * 2 - 1;
    click.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera( click, camera); // mets à jours le rayon selon son origine et une direction

    const found = raycaster.intersectObjects( scene.children, true); // détecte les objets en intérsection avec le rayon cf l.236

    if(found.length > 0 && found[0].object.userData.draggable == true) {
        checkAnimation(found[0].object.userData.name);
    }
}


function checkAnimation(name) {
    switch(name) {
        case "bridge":
            let counter;
            elements[name].children[0].userData.draggable = false;
            if(elements[name].userData.status == "down") {
                elements[name].userData.status = "up";
                counter = 0;
                let open = setInterval(function(){
                    elements['bridge'].rotation.x = counter * 0.01;
                    if(elements['bridge'].rotation.x == 1.5) {
                      elements[name].children[0].userData.draggable = true;
                      clearInterval(open);
                    }
                    counter++;
                }, 10)
            } else {
                elements[name].userData.status = "down";
                counter = 150;
                let open = setInterval(function(){
                    elements['bridge'].rotation.x = counter * 0.01;
                    if(elements['bridge'].rotation.x == 0) {
                      elements[name].children[0].userData.draggable = true;
                      clearInterval(open);
                    }
                    counter--;
                }, 10)
            }
            break;
        default:
            console.log("Nothing found");
    }
}


function render() {

  //lightHelper.update();

  //shadowCameraHelper.update();

  renderer.render( scene, camera );

}


function buildGui() {

  gui = new GUI();

  const params = {
    'light color': spotLight.color.getHex(),
    intensity: spotLight.intensity,
    distance: spotLight.distance,
    angle: spotLight.angle,
    penumbra: spotLight.penumbra,
    decay: spotLight.decay,
    focus: spotLight.shadow.focus,
    positionx: spotLight.position.x,
    positiony: spotLight.position.y,
    positionz: spotLight.position.z,
  };

  gui.addColor( params, 'light color' ).onChange( function ( val ) {

    spotLight.color.setHex( val );
    render();

  } );
  gui.add( params, 'positionx', -1000, 1000 ).onChange( function ( val ) {

    spotLight.position.x = val;
    render();

  } );

  gui.add( params, 'positionz', -1000, 1000 ).onChange( function ( val ) {

    spotLight.position.z = val;
    render();

  } );

  gui.add( params, 'positiony', -1000, 1000 ).onChange( function ( val ) {

    spotLight.position.y = val;
    render();

  } );


  gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {

    spotLight.intensity = val;
    render();

  } );


  gui.add( params, 'distance', 50, 5000 ).onChange( function ( val ) {

    spotLight.distance = val;
    render();

  } );

  gui.add( params, 'angle', 0, Math.PI / 2 ).onChange( function ( val ) {

    spotLight.angle = val;
    render();

  } );

  gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {

    spotLight.penumbra = val;
    render();

  } );

  gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {

    spotLight.decay = val;
    render();

  } );

  gui.add( params, 'focus', 0, 1 ).onChange( function ( val ) {

    spotLight.shadow.focus = val;
    render();

  } );

  gui.open();

}
