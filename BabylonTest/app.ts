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

        var editorMain = new BABYLON.EDITOR.EditorMain("BABYLON-EDITOR-MAIN");
        var core = editorMain.core;

var vm = new Vue({
    el: '#divConsole',
    ready: () => {
        core.currentScene.clearColor = BABYLON.Color3.White();
        editorMain.createRenderLoop();
        editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;
        BABYLON.EDITOR.Event.sendSceneEvent(core.currentScene, BABYLON.EDITOR.SceneEventType.OBJECT_PICKED, core);
        //core.editor.sceneGraphTool.fillGraph();

        var container = BABYLON.Mesh.CreateBox("container" + containerNo++, 1, core.currentScene);
        var greenMat = new BABYLON.StandardMaterial("ground", core.currentScene);
        greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        greenMat.emissiveColor = BABYLON.Color3.Purple();

        container.material = greenMat;
        container.scaling = new BABYLON.Vector3(20, 10, 10)
        container.position = inputPosition.clone();


        // Configure meshe
        BABYLON.EDITOR.SceneManager.ConfigureObject(container, core);


        BABYLON.EDITOR.SceneFactory.AddBoxMesh(core);
        BABYLON.EDITOR.SceneFactory.AddSkyMesh(core)
    },
    data: {
        scene: editorMain.core.currentScene,
        //startingPoint: startingPoint,
        //selectedContainer: currentMesh,
        inputPosition: inputPosition
    },

    computed: {
        //selectedContainerLocationColumn: {
        //    get: () => { return (currentMesh.position.x / 10).toFixed(); },
        //    set: (newValue) => { currentMesh.position.x = newValue * 10; }
        //},
        //selectedContainerLocationRow: {
        //    get: () => { return (currentMesh.position.z / 10).toFixed(); },
        //    set: (newValue) => { currentMesh.position.z = newValue * 10; }
        //},
        //selectedContainerLocationLevel: {
        //    get: () => { return (currentMesh.position.y / 10).toFixed(); },
        //    set: (newValue) => { currentMesh.position.y = newValue * 10; }
        //},


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

    

    methods: {
        addContainer: () => {
            var container = BABYLON.Mesh.CreateBox("container" + containerNo++, 1, editorMain.core.currentScene);
            var greenMat = new BABYLON.StandardMaterial("ground", editorMain.core.currentScene);
            greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            greenMat.emissiveColor = BABYLON.Color3.Purple();

            container.material = greenMat;
            container.scaling = new BABYLON.Vector3(20, 10, 10)
            container.position = inputPosition.clone();


            // Configure meshe
            BABYLON.EDITOR.SceneManager.ConfigureObject(container, this.core);
            //greenBox.checkCollisions = true;
            //container.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1000 });

            //shadowGenerator.getShadowMap().renderList.push(container);

        },

        //moveUp: () => {
        //    currentMesh.position.y += currentMesh.getBoundingInfo().boundingBox.extendSize.y
        //        * currentMesh.scaling.y * 2;
        //},
        //moveDown: () => {
        //    currentMesh.position.y -= currentMesh.getBoundingInfo().boundingBox.extendSize.y
        //        * currentMesh.scaling.y * 2;

        //},
        //moveLeft: () => {

        //    currentMesh.position.x += currentMesh.getBoundingInfo().boundingBox.extendSize.x
        //        * currentMesh.scaling.x * 2;
        //},
        //moveRight: () => {
        //    currentMesh.position.x -= currentMesh.getBoundingInfo().boundingBox.extendSize.x
        //        * currentMesh.scaling.x * 2;
        //},
        //moveForward: () => {
        //    currentMesh.position.z += currentMesh.getBoundingInfo().boundingBox.extendSize.z
        //        * currentMesh.scaling.z * 2;

        //},
        //moveBackword: () => {
        //    currentMesh.position.z -= currentMesh.getBoundingInfo().boundingBox.extendSize.z
        //        * currentMesh.scaling.z * 2;

        //},
    },
});

