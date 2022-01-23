import * as THREE from '../build/three.module.js'

export class CharacterControls {    
    // temporary data
    walkDirection = new THREE.Vector3();
    rotateAngle = new THREE.Vector3(0, 1, 0);
    rotateQuaternion = new THREE.Quaternion();
    cameraTarget = new THREE.Vector3();
    
    // constants
    fadeDuration = 0.2;
    runVelocity = 300;
    walkVelocity = 100;

    constructor(model,mixer, animationsMap, orbitControl, camera, currentAction, scene) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;
        this.animationsMap.forEach((value, key) => {
            if (key == currentAction) { // Recherche l'animation dans le dictionnaire et la joue.
                value.play();
            }
        })
        this.orbitControl = orbitControl;
        this.camera = camera;
        this.raycasterY = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 60);
        this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 10);
        this.rayOrigin = new THREE.Vector3();
        this.scene = scene;
        this.rayObjects = this.scene.children.filter(a => a.userData.name != 'soldier');
        this.updateCameraTarget(0,0)
    }

    update(delta, keysPressed) {
        const directionPressed = ["z","q","s","d"].some(key => keysPressed[key] == true);

        let play = "";
        if (directionPressed && keysPressed["shift"]) {
            play = 'Run';
        } else if (directionPressed) {
            play = 'Walk';
        } else {
            play = 'Idle';
        }

        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play);
            const current = this.animationsMap.get(this.currentAction);

            current.fadeOut(this.fadeDuration); // Diminue le degré d'influence (weight) de l'animation progressivement
            toPlay.reset().fadeIn(this.fadeDuration).play(); // Reinitialise l'animation puis augmente le weight progressivement

            this.currentAction = play;
        }

        this.mixer.update(delta); // Met à jour l'animation avec la nouvelle valeur delta

        this.rayOrigin.set(this.model.position.x, this.model.position.y+50, this.model.position.z);
        this.raycasterY.ray.origin = this.rayOrigin;
        const intersectionsY = this.raycasterY.intersectObjects( this.rayObjects);
        const nearestY = intersectionsY[0];
        if(typeof(nearestY) == "undefined" && this.currentAction == "Idle") {
            this.model.position.y -= 5;
            this.updateCameraTarget(0, 0, -5);
        }

        if (this.currentAction == 'Run' || this.currentAction == 'Walk') {
            // calculate towards camera direction
            let angleYCameraDirection = Math.atan2(
                    (this.camera.position.x - this.model.position.x), 
                    (this.camera.position.z - this.model.position.z));
            // diagonal movement angle offset
            let directionOffset = this.directionOffset(keysPressed);

            // rotate model
            this.rotateQuaternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset);
            this.model.quaternion.rotateTowards(this.rotateQuaternion, 0.2);

            // calculate direction
            this.camera.getWorldDirection(this.walkDirection);
            this.walkDirection.y = 0;
            this.walkDirection.normalize();
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset); // Appliquer une rotation

            // run/walk velocity
            const velocity = this.currentAction == 'Run' ? this.runVelocity : this.walkVelocity;

            // move model & camera
            const moveX = this.walkDirection.x * velocity * delta;
            const moveZ = this.walkDirection.z * velocity * delta;

            this.raycaster.ray.set(this.rayOrigin, this.walkDirection);
            // let object = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: "#ffffff"}))
            // object.position.set(this.raycasterY.ray.origin.x, this.raycasterY.ray.origin.y, this.raycasterY.ray.origin.z);
            // this.scene.add(object);
            const intersections = this.raycaster.intersectObjects( this.rayObjects, true);

            let difY = 0;
            if(typeof(nearestY) != "undefined") {
                for(let i=0 ; i<intersectionsY.length; i++) {
                    // let object = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: "#ff0000"}))
                    // object.position.set(intersectionsY[i].point.x, intersectionsY[i].point.y, intersectionsY[i].point.z);
                    // this.scene.add(object);
                }
                difY = nearestY.point.y - this.model.position.y;
                this.model.position.y = nearestY.point.y; 
            } else {
                this.model.position.y -= 5
                difY = -5;
            }

            if(typeof(intersections[0]) == "undefined") {
                this.model.position.x += moveX;
                this.model.position.z += moveZ;
                this.updateCameraTarget(moveX, moveZ, difY);
            }
        }
    }

    updateCameraTarget(moveX, moveZ, difY = 0) {
        // move camera
        this.camera.position.x += moveX;
        this.camera.position.z += moveZ;
        this.camera.position.y += difY;

        // update camera target
        this.cameraTarget.x = this.model.position.x;
        this.cameraTarget.y = this.model.position.y + 80;
        this.cameraTarget.z = this.model.position.z;
        this.orbitControl.target = this.cameraTarget; // On définit le point de centrage de l'obitcontrol la ou se situe le model 3D
        this.orbitControl.update();
    }

    directionOffset(keysPressed) {
        let directionOffset = 0; // z

        if (keysPressed["z"]) {
            if (keysPressed["q"]) {
                directionOffset = Math.PI / 4; // z+q
            } else if (keysPressed["d"]) {
                directionOffset = - Math.PI / 4; // z+d
            }
        } else if (keysPressed["s"]) {
            if (keysPressed["q"]) {
                directionOffset = Math.PI / 4 + Math.PI / 2; // s+q
            } else if (keysPressed["d"]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
            } else {
                directionOffset = Math.PI; // s
            }
        } else if (keysPressed["q"]) {
            directionOffset = Math.PI / 2; // q
        } else if (keysPressed["d"]) {
            directionOffset = - Math.PI / 2; // d
        }

        return directionOffset;
    }
}