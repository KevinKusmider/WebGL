function getTexture() {
    const data = {
        'texture_wall': {
            'path': 'textures/wall.jpg',
        },
        'texture_wall2': {
            'path': 'textures/wall2.jfif',
        },
        'texture_cone': {
            'path': 'textures/cone.jpg',
        },
        'texture_water': {
            'path': 'textures/watertest.jpg',
        },
        'texture_wood': {
            'path': 'textures/wood.jpg',
        },
        'texture_grass': {
            'path': 'textures/grass.jpg',
        },
        'texture_dirt': {
            'path': 'textures/dirt.jfif',
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
            'geometry': [25, 40, 20],
            'position': [200, 100, 200],
        },
        'cone_arD': {
            'type': 'cone',
            'texture': 'texture_cone',
            'material': 'BasicMaterial',
            'position': [-200, 100, 200]
        },
        'cone_avG': {
            'type': 'cone',
            'texture': 'texture_cone',
            'material': 'BasicMaterial',
            'geometry': [25, 40, 20],
            'position': [-200, 100, -200]
        },
        'cone_avD': {
            'type': 'cone',
            'texture': 'texture_cone',
            'material': 'BasicMaterial',
            'geometry': [25, 40, 20],
            'position': [200, 100, -200]
        }
    }

    return data;
}

export { getElements, getTexture };