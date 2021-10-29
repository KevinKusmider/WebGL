import * as THREE from '../build/three.module.js';

/*
  Appelée lorsqu'on a besoin de récupérer une texture
  @param { string } nom de la texture
  @return { object } texture
*/
function getTexture(name) {
  const textures = {
    'texture_wall' : 'textures/wall.jpg',
    'texture_wall2': 'textures/wall2.jfif',
    'texture_cone': 'textures/cone.jpg',
    'texture_water': 'textures/watertest.jpg',
    'texture_wood': 'textures/wood.jpg',
    'texture_grass': 'textures/grass.jpg',
    'texture_dirt': 'textures/dirt.jfif',
  }

  let path = textures[name];

  if(path !== undefined) {
    return new THREE.TextureLoader().load( path);
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
function getMaterial(texture_name, type = 'basic') {
  let texture = getTexture(texture_name);
  switch (type) {
    case 'basic':
      if(texture !== null) {
        return new THREE.MeshBasicMaterial( { map: texture } );
      }
    default:
      console.log('Le type de material spécifié est introuvable.');
      return null;
  }  
}

/*
  Appelée pour créer un cone
  @param { array } position x,y,z
  @param { array } geometry
  @param { array } nom de texture et type de la matière
  @param { scene } facultatif si ajouté affiche directement l'objet sans le renvoyer
  @return { object / bool } S'il n'y a pas de paramètre scene renvoie directement le cone sinon ça ajoute le cone à la scène et renvoie true
*/
function createCone(position, geometry_info, material_info, scene = null ) {
  const geometry = new THREE.ConeGeometry( geometry_info[0], geometry_info[1], geometry_info[2]);
  const material = getMaterial(material_info[0], material_info[1]);

  if(geometry !== undefined && material !== null) {
    const cone = new THREE.Mesh( geometry, material );
    cone.position.x = position[0];
    cone.position.y = position[1];
    cone.position.z = position[2];
    
    if(scene == null) {
      return cone;
    } else {
      scene.add(cone)
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
    scene.add(cylinder);
  
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


export { getTexture, getMaterial, createCone, createBox, createCylinder }
