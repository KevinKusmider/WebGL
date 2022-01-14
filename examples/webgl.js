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
let FPV_MODE = false;

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
let click, raycaster, pivot; // Pont levis
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

  /****** RAYCASTER ******/
  click = new THREE.Vector2(); // capture x & y position in Vector2 var
  raycaster = new THREE.Raycaster(); // capture the clicked element, mouse picking

  /****** EVENT LISTENNERS ******/
  window.addEventListener('click', onClick); // When click
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
  controls.maxDistance = 2000; //limit camera zoom outward
  controls.minDistance = 100; //limit camera zoom inward
  controls.enablePan = false; //Stop camera panning
  controls.update();

  // Character
  characterOrbitControls = new OrbitControls(cameras["character"], renderer.domElement);
  characterOrbitControls.minDistance = 150;
  characterOrbitControls.maxDistance = 150;
  characterOrbitControls.enablePan = false;
  characterOrbitControls.maxPolarAngle = Math.PI - pi/4;
  characterOrbitControls.update(); 


  lights();
  buildCastle();
  solarSystem();
  loadCharacter();
  scene.add(phoenixGroup);
  loadPhoenix();
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


  phoenixGroup.rotation.y += 0.004;

  stats.update();
  mixer.update(mixerUpdateDelta);
  renderer.render(scene, FPV_MODE ? cameras["character"] : camera);
}

function onClick(event) {
  // Calculates mouse position in normalized device coordinates
  // Allow to have a value between -1 & 1

  click.x = (event.clientX / window.innerWidth) * 2 - 1;
  click.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera( click, FPV_MODE ? cameras["character"] : camera); // mets à jours le rayon selon son origine et une direction

  const found = raycaster.intersectObjects( scene.children, true); // détecte les objets en intérsection avec le rayon cf l.236

  if(found.length > 0 && found[0].object.userData.draggable == true) {
      checkAnimation(found[0].object.userData.name);
  }
}

function checkAnimation(name) {
  switch(name) {
      case "bridge":                      // animation du pont-levis
      creation.getMusic('pont');          // On lance l'audio du pont-levis
          let counter;
          elements[name].children[0].userData.draggable = false;
          if(elements[name].userData.status == "down") { // Récupération élément['bridge'] = pivot et vérification de son status
              elements[name].userData.status = "up";     // Changement du status to up
              counter = 0;
              let open = setInterval(function(){  // Ouverture du pont
                  elements['bridge'].rotation.x = counter * 0.01; // Le pont s'incline de 0.01 en 0.01 jusqu'a arrivé à la limite
                  if(elements['bridge'].rotation.x == 1.5) {
                    elements[name].children[0].userData.draggable = true;
                    clearInterval(open);// Declaration de la limite pour l'inclinaison du pont
                  }
                  counter++;
              }, 10)   // 10 correspond à la répétition de la fonction toutes les 10 millisecondes
          } else {
              elements[name].userData.status = "down";
              counter = 150;
              let open = setInterval(function(){  // Fermeture du pont
                  elements['bridge'].rotation.x = counter * 0.01;// Le pont s'incline de 0.01 en 0.01 jusqu'a arrivé à la limite
                  if(elements['bridge'].rotation.x == 0) { // Declaration de la limite pour l'inclinaison du pont
                    elements[name].children[0].userData.draggable = true;
                    clearInterval(open);
                  }
                  counter--;
              }, 10)
          }
          break;
      case "Torche1":                                 // Animation de la torche sur la tour au fond à gauche
          if (spotLight2.position.y == 130) {          // Si sa position y est à 65 c'est qu'elle est allumée
            spotLight2.position.y = -2000;            // On l'a met à -1000 pour ne plus la voir et donc croire qu'elle est eteinte
          }else{
            creation.getMusic('torche');              // Si elle était éteinte on lance l'audio de l'allumage de torche
            spotLight2.position.y = 130;               // On l'a met à la bonne position
          }
          creation.render();                          // On actualise le rendu
          break;
      case "Torche2":                                 // Animation de la torche sur le mur avant gauche
          if (spotLight3.position.y == 80) {
            spotLight3.position.y = -2000;
          }else{
            creation.getMusic('torche');
            spotLight3.position.y = 80;
          }
          creation.render();
          break;
      case "Torche3":                                 // Animation de la torche sur le mur avant droit
          if (spotLight4.position.y == 80) {          // Si sa position y est à 40 c'est qu'elle est allumée
            spotLight4.position.y = -2000;
          }else{
            creation.getMusic('torche');
            spotLight4.position.y = 80;
          }
          creation.render();
          break;
      default:
          console.log("Nothing found");
  }
}

function buildCastle() {
  /***** TOWERS *****/
  // Tower behind left
  creation.createCylinder([300, 130, 300], [200, 200, 600, 200], ['texture_wall2'], scene);
  creation.createCone([300, 550, 300], [200, 240, 200], ['texture_cone'], scene);
  let torch = creation.createCylinder([156,100,156], [10,0,30,20], ['texture_dirt']);        // Torche
  torch.userData.draggable = true;
  torch.userData.name = 'Torche1';
  scene.add(torch);

  // Tower behind right
  creation.createCylinder([-350, 60, 350], [140, 140, 460, 200], ['texture_wall2'], scene); // Base
  creation.createCylinder([-350, 300, 350], [170, 170, 80, 200], ['texture_wall2'], scene); // Top of tower

  // Tower front right
  creation.createCylinder([-380, 10, -380], [100, 100, 350, 200], ['texture_wall2'], scene);
  creation.createCone([-380, 250, -380], [100, 130, 100], ['texture_cone'], scene);
  creation.createCylinder([-310, 110, -320], [60, 60, 15, 100], ['texture_wood'], scene); // Walk zone

  // Tower front middle right
  creation.createCylinder([-114, 0, -400], [50, 50, 340, 200], ['texture_wall2'], scene);
  creation.createCylinder([-114, 175, -400], [60, 60, 40, 200], ['texture_wall2'], scene);

  // Tower front middle left
  creation.createCylinder([114, 0, -400], [50, 50, 340, 200], ['texture_wall2'], scene);
  creation.createCylinder([114, 175, -400], [60, 60, 40, 200], ['texture_wall2'], scene);

  // Tower front left
  creation.createCylinder([380, 10, -380], [100, 100, 350, 200], ['texture_wall2'], scene);
  creation.createCone([380, 250, -380], [100, 130, 100], ['texture_cone'], scene);
  creation.createCylinder([310, 110, -320], [60, 60, 15, 100], ['texture_wood'], scene); // Walk zone


  /***** WALLS *****/
  // Wall behind
  creation.createBox([20, 40, 390], [540, 340, 100], ['texture_wall2'], scene);

  // Wall left
  creation.createBox([385, 0, 0], [40, 280, 800], ['texture_wall2'], scene);
  creation.createBox([340, 110, -140], [60, 15, 330], ['texture_wood'], scene); // Walk zone

  // Loop remparts wall left
  z = 64;
  for (var i = 0; i < 6; i++) {
      creation.createBox([385, 150, z], [40, 20, 30], ['texture_wall2'], scene);
      z = z - 60;
  }

  // Wall front left
  creation.createBox([275, 0, -400], [300, 280, 40], ['texture_wall2'], scene);
  creation.createBox([210, 110, -350], [280, 15, 60], ['texture_wood'], scene); // Walk zone
  torch = creation.createCylinder([220,60,-424], [10,0,30,20], ['texture_dirt']); // Torche
  torch.userData.draggable = true;
  torch.userData.name = 'Torche2';
  scene.add(torch);

  // Loop remparts wall front left
  x = 250;
  for (var i = 0; i < 2; i++) {
      creation.createBox([x, 150, -400], [30, 20, 40], ['texture_wall2'], scene);
      x = x - 50;
  }

  // Drawbridge
  creation.createBox([0, 136, -400], [160, 30, 40], ['texture_wall2'], scene); // wall above
  creation.createBox([0, -110, -400], [160, 40, 20], ['texture_wall2'], scene); // wall uper
  pivot = new THREE.Group(); // permet d'avoir un point d'encrage/origine au milieu de la base de la box
  pivot.position.set( -65, -100, -395); // Dawnbridge's Origin
  let bridge = creation.createBox([65, 5, -115], [130, 10, 210], ['texture_wood'])  // Création du pont-levis
  bridge.userData.draggable = true; // Ajout de l'attribut draggable
  bridge.userData.name = "bridge"; // On définit le nom du pont
  pivot.userData.status = "up"; // On définit la position du pont-levis au debut
  pivot.add(bridge); // Ajout du pont dans le groupe pivot
  scene.add(pivot); // Ajout dans la scène de l'objet pivot
  elements['bridge'] = pivot;   // On applique la valeur de pivot dans elements['bridge'] // C'est un tableaau si on veut rajouter des éléments plus tard
  elements['bridge'].rotation.x = 1.5; // Rotation initiale du pont-levis (0 si en bas, 1.5 si il est fermé)

  // Wall front right
  creation.createBox([-275, 0, -400], [300, 280, 40], ['texture_wall2'], scene);
  creation.createBox([-210, 110, -350], [280, 15, 60], ['texture_wood'], scene); // Walk zone
  torch = creation.createCylinder([-220,60,-424], [10,0,30,20], ['texture_dirt']);  // Torche
  torch.userData.draggable = true;
  torch.userData.name = 'Torche3';
  scene.add(torch);

  // Loop remparts wall front right
  x = -250;
  for (var i = 0; i < 2; i++) {
      creation.createBox([x, 150, -400], [30, 20, 40], ['texture_wall2'], scene);
      x = x + 50;
  }

  // Wall right
  creation.createBox([-390, 0, 0], [40, 280, 800], ['texture_wall2'], scene);
  creation.createBox([-340, 110, -20], [60, 15, 600], ['texture_wood'], scene); // Walk zone

  // Loop remparts wall right
  z = 180;
  for (var i = 0; i < 8; i++) {
      creation.createBox([-390, 150, z], [40, 20, 30], ['texture_wall2'], scene);
      z = z - 60;
  }

  /***** FLOOR *****/
  // Floor inside castle
  creation.createBox([0, -130, 0], [800, 80, 800], ['texture_dirt'], scene);

  // Water
  creation.createBox([0, -140, 0], [1220, 20, 1220], ['texture_water'], scene);

  // Grass
  creation.createBox([0, -140, -900], [2400, 80, 600], ['texture_grass'], scene);
  creation.createBox([0, -140, 900], [2400, 80, 600], ['texture_grass'], scene);
  creation.createBox([-900, -140, 0], [600, 80, 2400], ['texture_grass'], scene);
  creation.createBox([900, -140, 0], [600, 80, 2400], ['texture_grass'], scene);
  creation.createBox([0, -170, 0], [1800, 20, 1800], ['texture_grass'], scene);

  // Stairs
  y = -100;
  x = 147;
  for (var i = 0; i < 14; i++) {
      creation.createBox([x, y, 88], [20, 15, 130], ['texture_wall2'], scene);
      y = y + 15;
      x = x + 16;
  }
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
        creation.getMusic('torche');
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
        creation.getMusic('torche');
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

  creation.buildGui([spotLight, dot_light]);       // Fonction pour construire un GUI
}

function loadCharacter() {
  loader.load (
    // Ressource URL
    "./3Delements/Soldier/soldier.glb",
    // Called when the ressource is loaded
    function ( gltf ) {
        const model = gltf.scene;
        model.traverse(function (object) { if(object.isMesh) object.castShadow = true;})
        scene.add(model);
        model.position.set(0,-90,0);
        model.children[0].scale.set(0.6, 0.6, 0.6);

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

function loadPhoenix() {
  loader.load(
    // Ressource URL
    './3Delements/Phoenix/phoenix.glb',
    // Called when the ressource is loaded
    function ( gltf ) {
      const model = gltf.scene;
      const animations = gltf.animations;

      let elementMesh = gltf.scene.children[0];
      elementMesh.scale.set(0.6, 0.6, 0.6);

      model.position.set(1000, 500,0);
      model.rotation.z = Math.PI/16;
      model.rotation.y = Math.PI/2;

      model.traverse(function (object) { if(object.isMesh) object.castShadow = true;})

      mixer = new THREE.AnimationMixer( model );

      const action = mixer.clipAction( animations[ 0 ] ); // play the first animation
      action.weight = 1;
      action.play();
      phoenixGroup.add(model);
    }
  );
}