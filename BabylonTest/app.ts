var containerNo = 1;
var inputPosition = new BABYLON.Vector3(0, 0, 0);

var yard = {
    name: 'yard1',
    blocks: [{
        name: 'block1',
        size: {
            width: 100, heigth: 40,
            length: 200
        },
        containerSize: 20,
        position: { x: 0, y: 0, z: 0 },
        slots: []
    }]
};

var vm = new Vue({
    el: '#divConsole',
    data: {
        scene: scene,
        startingPoint: startingPoint,
        selectedContainer: currentMesh,
        inputPosition: inputPosition
    },

    computed: {
        selectedContainerLocationColumn: {
            get: () => { return (currentMesh.position.x / 10).toFixed(); },
            set: (newValue) => { currentMesh.position.x = newValue * 10; }
        },
        selectedContainerLocationRow: {
            get: () => { return (currentMesh.position.z / 10).toFixed(); },
            set: (newValue) => { currentMesh.position.z = newValue * 10; }
        },
        selectedContainerLocationLevel: {
            get: () => { return (currentMesh.position.y / 10).toFixed(); },
            set: (newValue) => { currentMesh.position.y = newValue * 10; }
        },


        inputPositionColumn: {
            get: () => { return (inputPosition.x / 10).toFixed(); },
            set: (newValue) => { inputPosition.x = newValue * 10; }
        },
        inputPositionRow: {
            get: () => { return (inputPosition.z / 10).toFixed(); },
            set: (newValue) => { inputPosition.z = newValue * 10; }
        },
        inputPositionLevel: {
            get: () => { return (inputPosition.y / 10).toFixed(); },
            set: (newValue) => { inputPosition.y = newValue * 10; }
        }

    },

    ready: () => {
        // block
        //var block1 = BABYLON.Mesh.CreatePlane("block1", 100, scene, false);
        //block1.sideOrientation = BABYLON.Mesh.DOUBLESIDE;

        //var defaultGridMaterial = new BABYLON.GridMaterial("default", scene);
        //defaultGridMaterial.gridRatio = 1;
        //defaultGridMaterial.isFrozen = true;
        //block1.material = defaultGridMaterial;
        //block1.receiveShadows = true;

    },

    methods: {
        addContainer: () => {
            var container = BABYLON.Mesh.CreateBox("container" + containerNo++, 20, scene);
            var greenMat = new BABYLON.StandardMaterial("ground", scene);
            greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            greenMat.emissiveColor = BABYLON.Color3.Green();

            container.material = greenMat;
            container.scaling = new BABYLON.Vector3(2, 1, 1)
            container.position = inputPosition.clone();

            container.showBoundingBox = true;
            //greenBox.checkCollisions = true;
            container.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1000 });

            shadowGenerator.getShadowMap().renderList.push(container);

        },

        moveUp: () => {
            currentMesh.position.y += currentMesh.getBoundingInfo().boundingBox.extendSize.y
                * currentMesh.scaling.y * 2;
        },
        moveDown: () => {
            currentMesh.position.y -= currentMesh.getBoundingInfo().boundingBox.extendSize.y
                * currentMesh.scaling.y * 2;

        },
        moveLeft: () => {

            currentMesh.position.x += currentMesh.getBoundingInfo().boundingBox.extendSize.x
                * currentMesh.scaling.x * 2;
        },
        moveRight: () => {
            currentMesh.position.x -= currentMesh.getBoundingInfo().boundingBox.extendSize.x
                * currentMesh.scaling.x * 2;
        },
        moveForward: () => {
            currentMesh.position.z += currentMesh.getBoundingInfo().boundingBox.extendSize.z
                * currentMesh.scaling.z * 2;

        },
        moveBackword: () => {
            currentMesh.position.z -= currentMesh.getBoundingInfo().boundingBox.extendSize.z
                * currentMesh.scaling.z * 2;

        },
    },
});

