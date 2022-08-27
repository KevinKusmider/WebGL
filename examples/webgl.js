import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { CharacterControls } from './characterControls.js';
import Stats from './jsm/libs/stats.module.js';
import * as creation from './Fonctions.js';       // Appel de notre fichier fonctions.js
import { GUI }  from './jsm/libs/dat.gui.module.js';        // Appel du fichier pour intégrer un GUI

/****** PARAMETRES ******/
let RESOURCES_LOADED = true; // Permet de savoir si toutes les ressources ont été chargée, pour enlever la page de chargement
let SCREEN_LOADER = true; // Si true affiche une page de chargement
let FPV_MODE = true;

/****** CONSTANTES ******/
const pi = Math.PI;
const twoPi = Math.PI * 2;
const manager = creation.manager;
const loader = new GLTFLoader(manager);

/****** VARIABLES ******/
let loadingScreen, loadingBar;
let cameras = creation.getCameras();
let camera, scene, renderer, controls;
camera = cameras["main"];

let x, y, z;
let pivot; // Pont levis
let ambient, spotLight, spotLight2, spotLight3, spotLight4, dot_light, sphere;
let lightHelper, shadowCameraHelper;
let elements = {};
let characterControls, characterOrbitControls, keysPressed = {};
let stats, mixer, clock = new THREE.Clock();
let phoenixGroup = new THREE.Group();


/****** SCREEN LOADER ******/
if (SCREEN_LOADER) {
  RESOURCES_LOADED = false;

  let loaderPercentage = document.getElementById("loading");

  loadingScreen = {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 1, 100 )
  };

  loadingScreen.camera.lookAt(0,0,0);
  loadingScreen.camera.position.z = 20;

  loadingBar = new THREE.Mesh(new THREE.RingGeometry( 9, 10, 150, 30, pi, 0 ), new THREE.MeshBasicMaterial({color: "#ffffff", side: THREE.DoubleSide}))
  loadingBar.rotation.y = pi;
  loadingScreen.scene.add(loadingBar);
  loaderPercentage.classList = "";
  loaderPercentage.classList.add("show");
  loaderPercentage.textContent = "0%";

  /****** MANAGER ACTIONS ******/
  manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
      console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  };

  manager.onLoad = function ( ) {
      RESOURCES_LOADED = true;
      loaderPercentage.classList = "";
      loaderPercentage.classList.add("hide");
      // console.log( 'Loading complete!');
  };

  manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      let percentage = itemsLoaded/itemsTotal;
      loaderPercentage.textContent = percentage.toFixed(2)*100 + "%";
      loadingBar.geometry = new THREE.RingGeometry( 9, 10, 50, 30, pi*0.5, twoPi * percentage);
      // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  };

  manager.onError = function ( url ) {
      console.log( 'There was an error loading ' + url );
  };
}


init();           // Fonction d'initialisation pour créer les objets
animate();        // Fonction qui permet de faire les animations


function init() {
  /****** SCENE ******/
  scene = new THREE.Scene();

  /****** RENDERER ******/
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // enable les ombres et le type de l'ombre
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  /****** EVENT LISTENNERS ******/
  window.addEventListener('resize', onWindowResize); // When window's resized
  document.addEventListener("keypress", (event) => {
    if(event.key.toLowerCase() == "m") {
        FPV_MODE = !FPV_MODE;
    }
  })

  document.addEventListener("keydown", (event) => {
      keysPressed[event.key.toLowerCase()] = true;
  })

  document.addEventListener("keyup", (event) => {
      keysPressed[event.key.toLowerCase()] = false;
  })

  /****** STATS ******/
  stats = new Stats();
  document.body.appendChild(stats.dom);

  /****** CONTROLS ******/
  // Main
  controls = new OrbitControls(camera, renderer.domElement); // define methode of controls
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 4;
  // controls.maxDistance = 2000; //limit camera zoom outward
  controls.minDistance = 100; //limit camera zoom inward
  controls.enablePan = false; //Stop camera panning
  controls.update();

  // Character
  characterOrbitControls = new OrbitControls(cameras["character"], renderer.domElement);
  characterOrbitControls.minDistance = 30;
  characterOrbitControls.maxDistance = 30;
  characterOrbitControls.enablePan = false;
  characterOrbitControls.maxPolarAngle = Math.PI - pi/4;
  characterOrbitControls.update();

  /****** SKYBOX ******/
  console.log("hello");
  let sb_materials = [creation.getMaterial("sb_right", "skybox"),
                      creation.getMaterial("sb_left", "skybox"),
                      creation.getMaterial("sb_top", "skybox"),
                      creation.getMaterial("sb_bottom", "skybox"),
                      creation.getMaterial("sb_back", "skybox"),
                      creation.getMaterial("sb_front", "skybox")];
  let skybox = new THREE.Mesh(new THREE.BoxGeometry(5000, 5000, 5000), sb_materials);
  // scene.add(skybox);

  /****** FUNCTIONS CALLS ******/
  lights();
  solarSystem();
  loadCharacter();


  loader.load(
    // Ressource URL
    './3Delements/Mountain/mountain.glb',
    // Called when the ressource is loaded
    function ( gltf ) {
      const model = gltf.scene;
      model.position.set(-6000,-4200,-3000);
      let elementMesh = gltf.scene.children[0];
      elementMesh.scale.set(10000, 10000, 10000);

      scene.add(model);
    }
  );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

  requestAnimationFrame(animate);

  if(!(RESOURCES_LOADED)) {
    renderer.render(loadingScreen.scene, loadingScreen.camera);
    return; // Stop the function here.
  }

  let mixerUpdateDelta = clock.getDelta();
  if(characterControls && FPV_MODE) {
      characterControls.update(mixerUpdateDelta, keysPressed);
  }

  stats.update();
  // mixer.update(mixerUpdateDelta);
  renderer.render(scene, FPV_MODE ? cameras["character"] : camera);
}

function lights() {
  /***** LIGHTS *****/
  // création d'une lumière ambiante
  ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
  scene.add( ambient );

  // création d'un spotLight / source de lumière / soleil
  spotLight = creation.createSpotlight([0xffffff, 1], [-2000,2000,0], Math.PI / 4, 0.1, 2, 2500, null, true, [512, 512], [10, 200, 1]);
  scene.add(spotLight);

  // Création d'un deuxième spotlight / Sur la tour au fond à gauche
  spotLight2 = creation.createSpotlight([0xf00020, 0.8], [150,130,150], Math.PI, 0.1, 2, 100, [150, 200, 150], true, [512, 512], [10, 200, 1]);
  scene.add(spotLight2);

  // Création d'un troisième spotlight / Sur le mur devant gauche
  spotLight3 = creation.createSpotlight([0xf00020, 0.8], [220,80,-428], Math.PI, 0.1, 2, 100, [220, 140, -428], true, [512, 512], [10, 200, 1]);
  scene.add(spotLight3);

  // Création d'un quatrième spotlight / Sur le mur devant droit
  spotLight4 = creation.createSpotlight([0xf00020, 0.8], [-220,80,-428], Math.PI, 0.1, 2, 100, [-220, 140, -428], true, [512, 512], [10, 200, 1]);
  scene.add(spotLight4);

  // Création de la sphère lumineuse
  sphere = new THREE.SphereGeometry(30,30,30);// création d'une sphère
  dot_light = new THREE.PointLight( 0x270f36, 100, 150 ); // création d'un point de lumière
  dot_light.add( new THREE.Mesh( sphere, new THREE.MeshPhongMaterial({color: 0x270f36}))); // on ajoute du maillage au point de lumière on met en paramètre du maillage la géométrie de la sphere et le matériel Phong
  dot_light.position.set( -900, 144, -1000 ); // position de la sphere
  scene.add( dot_light ); // ajout de la sphere

  // Helper permet de debugger les problèmes sur les lumières
  // lightHelper = new THREE.SpotLightHelper(dot );
  // scene.add( lightHelper );
  //
  // shadowCameraHelper = new THREE.CameraHelper( dot.shadow.camera );
  // scene.add( shadowCameraHelper );
}

function solarSystem() {
    /**********************
       SYSTEME SOLAIRE
  ************************/
  let i = 0;
  let time = setInterval(function(){
    if(spotLight.position.x < 0 && spotLight.position.y >= 0){                  // Le soleil se leve
      spotLight2.intensity = 0;                                                   // On éteint les lumières
      spotLight3.intensity = 0;
      spotLight4.intensity = 0;
      spotLight2.position.y = 130;
      spotLight3.position.y = 80;
      spotLight4.position.y = 80;
      if(spotLight.position.x < -1000 && spotLight.position.y <= 1000){             // Boucle pour avoir le quart bas (lever du soleil)
        ambient.intensity = 0.075;                                                // La luminosité ambiante se met à 0.075
        scene.background = new THREE.Color(0x6394cf);                             // On modifie la couleur du background
      }else{                                                                      // Boucle pour avoir le jour après le lever
        ambient.intensity = 0.1;                                                  // La luminosité ambiante se met à 0.075
        scene.background = new THREE.Color(0x77b5fe);                             // On modifie la couleur du background
      }
      spotLight.position.x += 2;                                                  // On modifie la position x du soleil
      spotLight.position.y = spotLight.position.x + 2000;                         // On modifie la position y du soleil en fonction de x
    }
    if(spotLight.position.x >= 0 && spotLight.position.y > 0){                    // Le soleil se couche
      spotLight2.intensity = 0;                                                   // On éteint les lumières
      spotLight3.intensity = 0;
      spotLight4.intensity = 0;
      spotLight2.position.y = 130;
      spotLight3.position.y = 80;
      spotLight4.position.y = 80;
      if(spotLight.position.x >= 1000 && spotLight.position.y < 1000){              // Boucle pour avoir le quart bas (coucher du soleil)
        ambient.intensity = 0.075;                                                // La luminosité ambiante se met à 0.075
        scene.background = new THREE.Color(0x6394cf);                             // On modifie la couleur du background
      }else{                                                                      // Boucle pour avoir le jour avant le coucher
        ambient.intensity = 0.1;                                                  // La luminosité ambiante se met à 0.075
        scene.background = new THREE.Color(0x77b5fe);                             // On modifie la couleur du background
      }
    spotLight.position.x += 2;                                                    // On modifie la position x du soleil
    spotLight.position.y = 2000 - spotLight.position.x ;                          // On modifie la position y du soleil en fonction de x
    }
    if(spotLight.position.x > 0 && spotLight.position.y <= 0){                    // Le soleil vient de se coucher
      ambient.intensity = 0.1;                                                    // La luminosité ambiante se met à 0.075
      if (spotLight2.intensity == 0 && spotLight3.intensity == 0 && spotLight4.intensity == 0){   // On regarde si toutes les lumières sont à 0, on les allume et on met le son
        spotLight2.intensity = 2;                                                   // On allume les lumières
        spotLight3.intensity = 2;
        spotLight4.intensity = 2;
      }
      if(spotLight.position.x > 1000 && spotLight.position.y >= -1000){             // Boucle pour avoir la nuit juste après le coucher
        scene.background = new THREE.Color(0x5075a2);                             // On modifie la couleur du background
      }else{                                                                      // Boucle pour avoir la nuit après le coucher
        scene.background = new THREE.Color(0x3e5777);                             // On modifie la couleur du background
      }
      spotLight.position.x -= 2;                                                  // On modifie la position x du soleil
      spotLight.position.y = spotLight.position.x - 2000;                         // On modifie la position y du soleil en fonction de x
    }
    if(spotLight.position.x <= 0 && spotLight.position.y < 0){                    // Le soleil est déjà coucher jusqu'au lever
      ambient.intensity = 0.075;                                                  // La luminosité ambiante se met à 0.075
      if (spotLight2.intensity == 0 && spotLight3.intensity == 0 && spotLight4.intensity == 0){
        spotLight2.intensity = 2;                                                   // On allume les lumières
        spotLight3.intensity = 2;
        spotLight4.intensity = 2;
      }
      if(spotLight.position.x <= -1000 && spotLight.position.y > -1000){            // Boucle pour avoir la nuit juste avant le lever
        scene.background = new THREE.Color(0x5075a2);                             // On modifie la couleur du background
      }else{                                                                      // Boucle pour avoir la nuit avant le lever
        scene.background = new THREE.Color(0x3e5777);                             // On modifie la couleur du background
      }
      spotLight.position.x -= 2;                                                  // On modifie la position x du soleil
      spotLight.position.y = -2000 - spotLight.position.x;                        // On modifie la position y du soleil en fonction de x
    }
  }, 10)                                                                          // La boucle est un setInterval il faut donc donner un temps en millisecondes pour dire tout les combien de temps la boucle se repete
}

function loadCharacter() {
  loader.load (
    // Ressource URL
    "./3Delements/scooterr/source/scene.glb",
    // Called when the ressource is loaded
    function ( gltf ) {
        const model = gltf.scene;
        model.traverse(function (object) { if(object.isMesh) object.castShadow = true;})
        scene.add(model);
        model.position.set(0,-80,0);
        model.children[0].scale.set(5, 5, 5);

        const gltfAnimations = gltf.animations;
        const mixer = new THREE.AnimationMixer(model); // Définition du mixer object qui permet de jouer les animations
        const animationsMap = new Map(); // Création d'un dictionnaire qui contiendra les animations du personnage
        gltfAnimations.filter(a => a.name != 'TPose').forEach(a => {
            animationsMap.set(a.name, mixer.clipAction(a)); // ajouter les animations instance de AnimationAction au dictionnaires
        });

        characterControls = new CharacterControls(model, mixer, animationsMap, characterOrbitControls, cameras["character"], "Idle");
    }
  );
}




