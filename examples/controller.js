import * as THREE from '../build/three.module.js';

class Controller {
    constructor(scene, materials) {
        this.scene = scene;
        this.elements;
        
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

    build(data) {
        if( data != null) {
            data.forEach(element => {
                switch (element['type']) {
                    case 'cone':
                        break;  
                }
            });
        }
    }
}

export { Controller }