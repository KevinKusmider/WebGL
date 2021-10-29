import * as THREE from '../build/three.module.js';

class Controller {
    constructor(scene, textures) {
        this.scene = scene;

        this.elements = {};
        
        this.textures = {};
        this.setTextures(textures);

    }

    setTextures(data) {
        for(let key in data) {
            let texture = data[key];
            this.textures[key] = new THREE.TextureLoader().load(texture['path']);
        }
    }

    getTexture(key) {
        let texture = this.textures[key];
        if(texture != null){
            return texture;
        }
    }

    getMaterial(texture, type = 'BasicMaterial') {
        switch (type) {
            case 'BasicMaterial':
                return new THREE.MeshBasicMaterial( { map: this.getTexture(texture) } );
                break;
            default:
                return null
                break;
        }
    }

    build(data) {
        if( data != null) {
            let geometry, element, object, material;
            for(let key in data) {
                element = data[key];
                switch (element['type']) {
                    case 'cone':
                        geometry = new THREE.ConeGeometry(element['type'][0], element['type'][1], element['type'][2]);
                        material = this.getMaterial(element['texture'], element['material'])
                        object = new THREE.Mesh( geometry, material );
                        object.position.x = element['position'][0];
                        object.position.y = element['position'][1];
                        object.position.z = element['position'][2];
                        console.log(object);
                        this.scene.add(object);
                        this.elements[key] = object;
                        break;  
                }
            }
        }
    }

    add() {
        if(this.elements != null && this.scene != null) {
            for(let key in this.elements) {
                let element = this.elements[key];
                this.scene.add(element);
            }
        }
    }
}

export { Controller }