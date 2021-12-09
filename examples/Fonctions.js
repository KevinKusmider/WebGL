import * as THREE from '../build/three.module.js';
import { GUI }  from './jsm/libs/dat.gui.module.js';


// Variables Globalss

let renderer, scene, camera;
let gui;


/*
  Appelée au début du fichier webgl afin de définir des variables globales dans le fichiers Fonctions.js
  @param { object } renderer du ficher webgl.ls
  @param { object } scene du ficher webgl.ls
  @param { object } camera du ficher webgl.ls
  @return { void }
*/

function init(rendererWeb, sceneWeb, cameraWeb) {
  renderer = rendererWeb;
  scene = sceneWeb;
  camera = cameraWeb;
}



/*
  Appelée lorsqu'on a besoin de récupérer une texture
  @param { string } nom de la texture
  @return { object } texture
*/
function getTexture(name) {
  const textures = {    // on crée un tableau qui contient toutes les textures que l'on utilise
    'texture_wall' : 'textures/wall.jpg',
    'texture_wall2': 'textures/wall2.jpg',
    'texture_cone': 'textures/cone.jpg',
    'texture_water': 'textures/watertest.jpg',
    'texture_wood': 'textures/wood2.jpg',
    'texture_grass': 'textures/grass.jpg',
    'texture_dirt': 'textures/dirt.jfif',
  }

  let path = textures[name];  // On va chercher le chemin qui correspond au nom de la texture

  if(path !== undefined) {
    return new THREE.TextureLoader().load( path); // create and return the texture
  } else {
    console.log('Texture non existante');
    return null;
  }

}



/*
  Appelée lorsqu'on a besoin de récupérer une matière
  @param { string } nom de la texture
  @param { string } type de la matière
  @return { object } material
*/
function getMaterial(texture_name, type = 'basic') { //définit la valeur par défaut de type (ici basic)
  let texture = getTexture(texture_name);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 2, 2 );
  switch (type) { // On utilise un switch au cas ou on veuille rajouter des matériaux plus tard
    case 'basic':
      if(texture !== null) {
        return new THREE.MeshPhongMaterial( { map: texture, dithering: true } );   // cas où le MESH utilisé est le mesh basic (default)
      } else { return null }
      break;

    default:
      console.log('Le type de material spécifié est introuvable.');
      return null;
  }
}



/*
  Appelée pour créer un cone
  @param { array } position x,y,z
  @param { array } geometry , paramètres du cone (taille,radius,segment)
  @param { array } nom de texture et type de la matière (basic par défaut)
  @param { scene } facultatif si ajouté affiche directement l'objet sans le renvoyer
  @return { object / bool } S'il n'y a pas de paramètre scene renvoie directement le cone sinon ça ajoute le cone à la scène et renvoie true
*/
function createCone(position, geometry_info, material_info, scene = null ) { // scene = null --> par défaut scene n'est pas pris en compte dans les paramètres, sinon ranger dans un var
  const geometry = new THREE.ConeGeometry( geometry_info[0], geometry_info[1], geometry_info[2]); // On crée un nouvel élément qui prend en compte la géométrie de notre objet que l'on range dans la constante geometry
  const material = getMaterial(material_info[0], material_info[1]); // la constante material récupère le résultat de la fonction getMaterial (la texture)

  if(geometry !== undefined && material !== null) { // On vérifie que geometry et materiel sont définis
    const cone = new THREE.Mesh( geometry, material );
    cone.position.x = position[0];
    cone.position.y = position[1];
    cone.position.z = position[2];
    cone.castShadow = true;
    cone.receiveShadow = true;

    if(scene == null) {
      return cone; // si scene = null alors l'objet créer est à ranger dans une var (utilisé pour faire des traitements sur l'objet)
    } else {
      scene.add(cone) // si on ajoute scene en paramètre alors ce l'objet créer est affiché
      return true;
    }
  } else {
    console.log('Probleme lors de la création du cone');
    return null;
  }

}



/*
  Appelée pour créer un cube
  @param { array } position x,y,z
  @param { array } geometry
  @param { array } nom de texture et type de la matière
  @param { scene } facultatif si ajouté affiche directement l'objet sans le renvoyer
  @return { object / bool } S'il n'y a pas de paramètre scene renvoie directement le cone sinon ça ajoute le cone à la scène et renvoie true
*/
function createBox(position, geometry_info, material_info, scene = null) {
  const geometry = new THREE.BoxGeometry( geometry_info[0], geometry_info[1], geometry_info[2]);
  const material = getMaterial(material_info[0], material_info[1]);

  if(geometry !== undefined && material !== null) {
    const wall = new THREE.Mesh( geometry, material );
    wall.position.x = position[0];
    wall.position.y = position[1];
    wall.position.z = position[2];
    wall.castShadow = true;
    wall.receiveShadow = true;


    if(scene == null) {
      return wall;
    } else {
      scene.add(wall)
      return true;
    }
  } else {
    console.log('Problème lors de la création du cube');
    return null;
  }

}



/*
  Appelée pour créer un cylindre
  @param { array } position x,y,z
  @param { array } geometry
  @param { array } nom de texture et type de la matière
  @param { scene } facultatif si ajouté
  @return { object / bool } S'il n'y a pas de paramètre scene renvoie directement le cone sinon ça ajoute le cone à la scène et renvoie true
*/
function createCylinder(position, geometry_info, material_info, scene = null) {
  const geometry = new THREE.CylinderGeometry( geometry_info[0], geometry_info[1], geometry_info[2],geometry_info[3]);
  const material = getMaterial(material_info[0], material_info[1]);

  if(geometry !== undefined && material !== null) {
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.x = position[0];
    cylinder.position.y = position[1];
    cylinder.position.z = position[2];

    cylinder.castShadow = true;
    cylinder.receiveShadow = true;

    if(scene == null) {
      return cylinder;
    } else {
      scene.add(cylinder)
      return true;
    }
  } else {
    console.log('Problème lors de la création du cylindre');
    return null;
  }

}



/*
  Appelée pour créer une SpotLight
  @param { array } color, intensity
  @param { array } x, y, z
  @param { int } Angle de projection de la lumière en radian
  @param { int } Précision / Netteté de la lumière
  @param { int } Quantité de lumière selon la distance de celle ci
  @param { int } Distance du spotlight par rapport au centre
  @param { array } Position de la target
  @param { bool } Reflète la lumière pour créer des ombres
  @param { array } shadowMapSize.width, shadowMapSize.height
  @param { array } shadowCamera.near, shadowCamera.far, shadowCamera.focus
  @param { scene } facultatif si ajouté
  @return { object / bool } S'il n'y a pas de paramètre scene renvoie directement le cone sinon ça ajoute le cone à la scène et renvoie true
*/
function createSpotlight(color, position, angle, penumbra, decay, distance, targetPosition, castShadow, shadowMapSize, shadowCamera, scene = null) {
  const spotLight = new THREE.SpotLight( color[0], color[1]);             // création d'un spotLight / source de lumière
  spotLight.position.set( position[0], position[1], position[2]);        // Initialisation de la position du spotlight
  spotLight.angle = angle;                                              // Angle de projection de la lumière
  spotLight.penumbra = penumbra;                                       // Netteté de la lumière / Précision
  spotLight.decay = decay;                                            // Quantité de lumière selon la distance de celle ci
  spotLight.distance = distance;                                     // Distance du spotlight par rapport au centre

  if(targetPosition != null) {
    spotLight.target.position.set( targetPosition[0], targetPosition[1], targetPosition[2]);
    spotLight.target.updateMatrixWorld();                         //to update target position
  }

  spotLight.castShadow = castShadow;                           // Reflète la lumière pour créer des ombres
  spotLight.shadow.mapSize.width = shadowMapSize[0];          //  Proportion de l'ombre (largeur)
  spotLight.shadow.mapSize.height = shadowMapSize[1];        // Proportion de l'ombre (hauteur)
  spotLight.shadow.camera.near = shadowCamera[0];           // affichage de l'ombre selon la distance (proche)
  spotLight.shadow.camera.far = shadowCamera[1];           // affichage de l'ombre selon la distance (loin)
  spotLight.shadow.focus = shadowCamera[2];               // Présence/Intensité de l'ombre

  if(scene == null) {
    return spotLight;
  } else {
    scene.add(spotLight)  // Ajout de la lumière dans la scène
    return true;
  }
}



/*
  Appelée pour rafraîchir le rendu de la scene
  Utilise les variables globales définies à la ligne 8 et 10 avec la fonction init
  Ces variables contiennent le renderer, la scene et la camera créés dans le fichier webgl
  @return { void }
*/
function render() {

  // lightHelper.update();

  // shadowCameraHelper.update();

  renderer.render( scene, camera );
}



/*
  Appelée pour construire une graphical user interface
  @param { array } objets pour lesquels il faut modifier les paramètres
  @return { void }
*/
function buildGui(objects) {

  if(objects == null && objects == '') {
    console.log('Impossible to build GUI : no objects sent');
    return null;
  }

  gui = new GUI();

  const params = {                                  // Création d'un objet avec les différents paramètres du GUI
    'light color': objects[0].color.getHex(),
    intensity: objects[0].intensity,
    distance: objects[0].distance,
    angle: objects[0].angle,
    penumbra: objects[0].penumbra,
    decay: objects[0].decay,
    focus: objects[0].shadow.focus,
    positionx: objects[0].position.x,
    positiony: objects[0].position.y,
    positionz: objects[0].position.z,
    movelight: objects[1].position.x,
    movelighty: objects[1].position.y,
    movelightz: objects[1].position.z
  };

  gui.addColor( params, 'light color' ).onChange( function ( val ) {      // Couleur de la lumière
    objects[0].color.setHex( val );
    render();
  } );

  gui.add( params, 'positionx', -1000, 1000 ).onChange( function ( val ) {    // Position x de la lumière
    objects[0].position.x = val;
    render();
  } );

  gui.add( params, 'positionz', -1000, 1000 ).onChange( function ( val ) {    // Position z de la lumière
    objects[0].position.z = val;
    render();
  } );

  gui.add( params, 'positiony', -1000, 1000 ).onChange( function ( val ) {    // Position y de la lumière
    objects[0].position.y = val;
    render();
  } );

/*
  gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {       // Intensitée de la lumière

    spotLight.intensity = val;
    render();

  } );


  gui.add( params, 'distance', 50, 5000 ).onChange( function ( val ) {    // Distance de la lumière

    spotLight.distance = val;
    render();

  } );

  gui.add( params, 'angle', 0, Math.PI / 2 ).onChange( function ( val ) {       // Angle éclairé

    spotLight.angle = val;
    render();

  } );

  gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {      // Penombre de la lumière

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

  } );*/

  gui.add( params, 'movelight', -500, 500 ).onChange( function ( val ) {      // Position x de la boule lumineuse
    objects[1].position.x = val;
    render();
  } );

  gui.add( params, 'movelightz', -500, 500 ).onChange( function ( val ) {     // Position z de la boule lumineuse
    objects[1].position.z = val;
    render();
  } );

  gui.add( params, 'movelighty', -500, 500 ).onChange( function ( val ) {     // Position y de la boule lumineuse
    objects[1].position.y = val;
    render();
  } );

  gui.open();

}

function getMusic(name) {
  const music = {    // on crée un tableau qui contient toutes les musiques que l'on utilise
    'torche' : './sounds/torche.mp3',
    'pont': './sounds/pont-levis.mp3',
  }

  if(music[name] != null) {
    const listener = new THREE.AudioListener();                               //
    const sound = new THREE.Audio( listener );                                //
    const audioLoader = new THREE.AudioLoader();                              //
    audioLoader.load( music[name] , function( buffer ) {                             //
      sound.setBuffer( buffer );                                              //
      sound.play();                                                           //
    });
  } else {
    console.log("Le son n'a pas été trouvé");
    return null;
  }

}




export { init, getTexture, getMaterial, createCone, createBox, createCylinder, createSpotlight, getMusic, buildGui, render} // pour pouvoir utiliser les fonctions dans un autre fichier
