import * as THREE from '../build/three.module.js';
import { GUI }  from './jsm/libs/dat.gui.module.js';

/*
  Appelée lorsqu'on a besoin de récupérer une texture
  @param { string } nom de la texture
  @return { object } texture
*/
function getTexture(name) {
  const textures = {    // on crée un tableau qui contient toutes les textures que l'on utilise
    'texture_wall' : 'textures/wall.jpg',
    'texture_wall2': 'textures/wall2.jfif',
    'texture_cone': 'textures/cone.jpg',
    'texture_water': 'textures/watertest.jpg',
    'texture_wood': 'textures/wood.jpg',
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
  switch (type) { // On utilise un switch au cas ou on veuille rajouter des matériaux plus tard
    case 'basic':
      if(texture !== null) {
        return new THREE.MeshPhongMaterial( { map: texture, dithering: true } );   // cas où le MESH utilisé est le mesh basic (default)
      }

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

// function disco(para) {
//
//
// let test =
//   switch (para) {
//
//     case "disco": let spotLight = new THREE.SpotLight( 0xffffff, 1);
//
//       break;
//     default:
//
//   }
//
//
// }

export { getTexture, getMaterial, createCone, createBox, createCylinder} // pour pouvoir utiliser les fonctions dans un autre fichier
