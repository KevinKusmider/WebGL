import * as THREE from '../build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import * as creation from './Fonctions.js';       // Appel de notre fichier fonctions.js
import { GUI }  from './jsm/libs/dat.gui.module.js';        // Appel du fichier pour intégrer un GUI

let camera, scene, renderer, controls;

let x, y, z;
let click, raycaster, pivot;
let spotLight, lightHelper, shadowCameraHelper, spotLight2, spotLight3, spotLight4, lightHelper2, dot_light, shadowCameraHelper2;
let elements = {};


// init();
// animate();

init();           // Fonction d'initialisation pour créer les objets

animate();        // Fonction qui permet de faire les animations

creation.init(renderer, scene, camera);
creation.render();       // Fonction pour actualiser le rendu si il y a eu un changement



function init() {
/**********************
    INITIALISATIONS
************************/
// Initialisation camera
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = -600;
  camera.position.y = 100;

// Initialisation scene
  scene = new THREE.Scene();

// Initialisation renderer (rendu final)
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



/**********************
    LIGHTS
************************/
// création d'une lumière ambiante
  const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
  scene.add( ambient );

// création d'un spotLight / source de lumière / soleil
  spotLight = creation.createSpotlight([0xffffff, 1], [-1000,1000,0], Math.PI / 4, 0.1, 2, 1700, null, true, [512, 512], [10, 200, 1]);
  scene.add(spotLight);

// Création d'un deuxième spotlight / Sur la tour au fond à gauche
  spotLight2 = creation.createSpotlight([0xf00020, 0.8], [75,65,75], Math.PI, 0.1, 2, 100, [75, 100, 75], true, [512, 512], [10, 200, 1]);
  scene.add(spotLight2);

// Création d'un troisième spotlight / Sur le mur devant gauche
  spotLight3 = creation.createSpotlight([0xf00020, 0.8], [110,40,-214], Math.PI, 0.1, 2, 100, [110, 70, -214], true, [512, 512], [10, 200, 1]);
  scene.add(spotLight3);

// Création d'un quatrième spotlight / Sur le mur devant droit
  spotLight4 = creation.createSpotlight([0xf00020, 0.8], [-110,40,-214], Math.PI, 0.1, 2, 100, [-110, 70, -214], true, [512, 512], [10, 200, 1]);
  scene.add(spotLight4);

// Helper permet de debugger les problèmes sur les lumières
  // lightHelper = new THREE.SpotLightHelper(dot );
  // scene.add( lightHelper );
  //
  // shadowCameraHelper = new THREE.CameraHelper( dot.shadow.camera );
  // scene.add( shadowCameraHelper );

  const sphere = new THREE.SphereGeometry(30,30,30);// création d'une sphère

  dot_light = new THREE.PointLight( 0x270f36, 100, 150 ); // création d'un point de lumière
  dot_light.add( new THREE.Mesh( sphere, new THREE.MeshPhongMaterial({color: 0x270f36}))); // on ajoute du maillage au point de lumière on met en paramètre du maillage la géométrie de la sphere et le matériel Phong
  dot_light.position.set( -450, 72, -500 ); // position de la sphere
  scene.add( dot_light ); // ajout de la sphere



/**********************
    CONTROLS
************************/
  controls = new OrbitControls(camera, renderer.domElement); // define methode of controls
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxDistance = 1000; //limit camera zoom outward
  controls.minDistance = 100; //limit camera zoom inward
  controls.enablePan = false; //Stop camera panning
  controls.update();



/**********************
    BUILDING
************************/
// Towers
  // Tower behind left
  creation.createCylinder([150, 65, 150], [100, 100, 300, 100], ['texture_wall2'], scene);
  creation.createCone([150, 275, 150], [100, 120, 100], ['texture_cone'], scene);
  creation.createCylinder([78,50,78], [5,0,15,10], ['texture_dirt'], scene);        // Torche

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
  creation.createCylinder([110,30,-212], [5,0,15,10], ['texture_dirt'], scene); // Torche

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
  let torch = creation.createCylinder([-110,30,-212], [5,0,15,10], ['texture_dirt']);  // Torche
  torch.userData.draggable = true;
  torch.userData.name = 'Torche3';
  // torch.add(spotLight4);
  scene.add(torch);
  elements['Torche3'] = torch;

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
/*
  const light = new THREE.AmbientLight(0xffffff, 1);
  light.position.set(375, 50,10);
  scene.add(light);


  const loader = new GLTFLoader();

  loader.load(
      // Ressource URL
      './3Delements/Horse/scene.gltf',
      // Called when the ressource is loaded
      function ( gltf ) {
          const element = gltf.scene;

          let elementMesh = gltf.scene.children[0];
          elementMesh.scale.set(10, 10, 10);

          element.position.set(375,-10,3);
          scene.add(element);
      },
      // called while loading is progressing
      function ( xhr ) {
          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }
  );
*/

/**********************
     SYSTEME SOLAIRE
************************/
  var i = 0;
  let time = setInterval(function(){
    // spotLight4 = elements['Torche3'].children[0];
    if(spotLight.position.x < 0 && spotLight.position.y >= 0){                    // Le soleil se leve
      spotLight2.intensity = 0;                                                   // On éteint les lumières
      spotLight3.intensity = 0;
      spotLight4.intensity = 0;
      if(spotLight.position.x < -500 && spotLight.position.y <= 500){             // Boucle pour avoir le quart bas (lever du soleil)
        ambient.intensity = 0.075;                                                // La luminosité ambiante se met à 0.075
        scene.background = new THREE.Color(0x6394cf);                             // On modifie la couleur du background
        console.log('couleur 2');
      }else{                                                                      // Boucle pour avoir le jour après le lever
        ambient.intensity = 0.1;                                                  // La luminosité ambiante se met à 0.075
        scene.background = new THREE.Color(0x77b5fe);                             // On modifie la couleur du background
        console.log('couleur 1');
      }
    spotLight.position.x += 1;                                                    // On modifie la position x du soleil
    spotLight.position.y = spotLight.position.x + 1000;                           // On modifie la position y du soleil en fonction de x
    }
    if(spotLight.position.x >= 0 && spotLight.position.y > 0){                    // Le soleil se couche
      spotLight2.intensity = 0;                                                   // On éteint les lumières
      spotLight3.intensity = 0;
      spotLight4.intensity = 0;
      if(spotLight.position.x >= 500 && spotLight.position.y < 500){              // Boucle pour avoir le quart bas (coucher du soleil)
        ambient.intensity = 0.075;                                                // La luminosité ambiante se met à 0.075
        scene.background = new THREE.Color(0x6394cf);                             // On modifie la couleur du background
        console.log('couleur 2');
      }else{                                                                      // Boucle pour avoir le jour avant le coucher
        ambient.intensity = 0.1;                                                  // La luminosité ambiante se met à 0.075
        scene.background = new THREE.Color(0x77b5fe);                             // On modifie la couleur du background
        console.log('couleur 1');
      }
    spotLight.position.x += 1;                                                    // On modifie la position x du soleil
    spotLight.position.y = 1000 - spotLight.position.x ;                          // On modifie la position y du soleil en fonction de x
    }
    if(spotLight.position.x > 0 && spotLight.position.y <= 0){                    // Le soleil vient de se coucher
      ambient.intensity = 0.1;                                                    // La luminosité ambiante se met à 0.075
      spotLight2.intensity = 2;                                                   // On allume les lumières
      spotLight3.intensity = 2;
      spotLight4.intensity = 2;
      if(spotLight.position.x > 500 && spotLight.position.y >= -500){             // Boucle pour avoir la nuit juste après le coucher
        scene.background = new THREE.Color(0x5075a2);                             // On modifie la couleur du background
        console.log('couleur 3');
      }else{                                                                      // Boucle pour avoir la nuit après le coucher
        scene.background = new THREE.Color(0x3e5777);                             // On modifie la couleur du background
        console.log('couleur 4');
      }
      spotLight.position.x -= 1;                                                  // On modifie la position x du soleil
      spotLight.position.y = spotLight.position.x - 1000;                         // On modifie la position y du soleil en fonction de x
    }
    if(spotLight.position.x <= 0 && spotLight.position.y < 0){                    // Le soleil est déjà coucher jusqu'au lever
      ambient.intensity = 0.075;                                                  // La luminosité ambiante se met à 0.075
      spotLight2.intensity = 2;                                                   // On allume les lumières
      spotLight3.intensity = 2;
      spotLight4.intensity = 2;
      if(spotLight.position.x <= -500 && spotLight.position.y > -500){            // Boucle pour avoir la nuit juste avant le lever
        scene.background = new THREE.Color(0x5075a2);                             // On modifie la couleur du background
        console.log('couleur 3');
      }else{                                                                      // Boucle pour avoir la nuit avant le lever
        scene.background = new THREE.Color(0x3e5777);                             // On modifie la couleur du background
        console.log('couleur 4');
      }
      spotLight.position.x -= 1;                                                  // On modifie la position x du soleil
      spotLight.position.y = -1000 - spotLight.position.x;                        // On modifie la position y du soleil en fonction de x
    }
    creation.render();                                                                      // On actualise les modifications faites
  }, 10)                                                                          // La boucle est un setInterval il faut donc donner un temps en millisecondes pour dire tout les combien de temps la boucle se repete

  creation.buildGui([spotLight, dot_light]);       // Fonction pour construire un GUI

} // Fin de la fonction init


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

  requestAnimationFrame(animate);

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
      console.log(found[0])
      console.log(found[0].object.userData.name)
      checkAnimation(found[0].object.userData.name);
  }
}


function checkAnimation(name) {
  switch(name) {
      case "bridge":
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
      case "Torche3":

      default:
          console.log("Nothing found");
  }
}
