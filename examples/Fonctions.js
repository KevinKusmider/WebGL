import * as THREE from '../build/three.module.js';


function createCone(position, geometry_info, scene = null ) {
  const texture_cone = new THREE.TextureLoader().load( 'textures/cone.jpg' );

  const geometry = new THREE.ConeGeometry( geometry_info[0], geometry_info[1], geometry_info[2]);
  const material = new THREE.MeshBasicMaterial( { map: texture_cone } );

  const cone = new THREE.Mesh( geometry, material );
  cone.position.x = position[0];
  cone.position.y = position[1];
  cone.position.z = position[2];

  if(scene == null) {
    return cone;
  } else {
    scene.add(cone)
  }

}



function createWall(position, geometry_info, scene = null) {
  const texture_wall = new THREE.TextureLoader().load( 'textures/wall.jpg' );

  const geometry = new THREE.BoxGeometry( geometry_info[0], geometry_info[1], geometry_info[2]);
  const material = new THREE.MeshBasicMaterial( { map: texture_wall } );

  const wall = new THREE.Mesh( geometry, material );
  wall.position.x = position[0];
  wall.position.y = position[1];
  wall.position.z = position[2];

  if(scene == null) {
    return wall;
  } else {
    scene.add(wall)
  }

}




function createCylinder(position, geometry_info, scene = null) {
  const texture_wall = new THREE.TextureLoader().load( 'textures/wall.jpg' );

  const geometry = new THREE.CylinderGeometry( geometry_info[0], geometry_info[1], geometry_info[2],geometry_info[3]);
  const material = new THREE.MeshBasicMaterial( { map: texture_cone } );

  const cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.x = position[0];
  cylinder.position.y = position[1];
  cylinder.position.z = position[2];
  scene.add(cylinder);

  if(scene == null) {
    return cylinder;
  } else {
    scene.add(cylinder)
  }

}


export { createCone, createWall, createCylinder }
