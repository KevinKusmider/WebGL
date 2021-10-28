import * as THREE from '../build/three.module.js';

class Controller {
    constructor(scene, materials) {
        this.scene = scene;

        this.elements = {};
        
        this.materials = {};
        this.setMaterials(materials);
        console.log(this.materials);
    }

    setMaterials(data) {
        for(let k in data) {
            let texture = data[k];
            this.materials[k] = new THREE.TextureLoader().load(texture['path']);
        }
    }

    getMaterial(material) {
        if(material !== null) {
            return this.materials[material];
        }
    }

    build(data) {
        if( data != null) {
            let material, geometry, element, object;
            for(let k in data) {
                element = data[k];
                switch (element['type']) {
                    case 'cone':
                        geometry = new THREE.ConeGeometry(element['type'][0], element['type'][1], element['type'][2]);
                        material = new THREE.MeshBasicMaterial( { map: this.getMaterial() } );
                        object = new THREE;
                        break;  
                }
            }
        }
    }
}

export { Controller }