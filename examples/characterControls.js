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

    constructor(model,mixer, animationsMap, orbitControl, camera, currentAction) {
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
            const moveX = this.walkDirection.x * velocity * 0.007;
            const moveZ = this.walkDirection.z * velocity * 0.007;
            this.model.position.x += moveX;
            this.model.position.z += moveZ;
            this.updateCameraTarget(moveX, moveZ);
        }
    }

    updateCameraTarget(moveX, moveZ) {
        // move camera
        this.camera.position.x += moveX;
        this.camera.position.z += moveZ;

        // update camera target
        this.cameraTarget.x = this.model.position.x;
        this.cameraTarget.y = this.model.position.y + 80;
        this.cameraTarget.z = this.model.position.z;
        this.orbitControl.target = this.cameraTarget; // On définit le point de centrage de l'obitcontrol la ou se situe le model 3D
    }

    directionOffset(keysPressed) {
        let directionOffset = 0; // w

        if (keysPressed["z"]) {
            if (keysPressed["q"]) {
                directionOffset = Math.PI / 4; // w+a
            } else if (keysPressed["d"]) {
                directionOffset = - Math.PI / 4; // w+d
            }
        } else if (keysPressed["s"]) {
            if (keysPressed["q"]) {
                directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
            } else if (keysPressed["d"]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
            } else {
                directionOffset = Math.PI; // s
            }
        } else if (keysPressed["q"]) {
            directionOffset = Math.PI / 2; // a
        } else if (keysPressed["d"]) {
            directionOffset = - Math.PI / 2; // d
        }

        return directionOffset;
    }
}