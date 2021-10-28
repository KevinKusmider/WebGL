function getMaterials() {
    const data = {
        'texture_wall': {
            'path': 'textures/wall.jpg',
        },
    }

    return data;
}

function getElements() {
    const data = {
        'cone_arG': {
            'type': 'cone',
            'texture': 'texture_cone',
            'material': 'BasicMaterial',
            'geometry': [200, 100, 200]
        },
        'cone_arD': {
            'type': 'cone',
            'texture': 'texture_cone',
            'material': 'BasicMaterial',
            'geometry': [-200, 100, 200]
        },
        'cone_avG': {
            'type': 'cone',
            'texture': 'texture_cone',
            'material': 'BasicMaterial',
            'geometry': [-200, 100, -200]
        },
        'cone_avD': {
            'type': 'cone',
            'texture': 'texture_cone',
            'material': 'BasicMaterial',
            'geometry': [200, 100, -200]
        },
    }

    return data;
}

export { getElements, getMaterials };