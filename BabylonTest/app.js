var _this = this;
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
    ready: function () {
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
        container.scaling = new BABYLON.Vector3(20, 10, 10);
        container.position = inputPosition.clone();
        // Configure meshe
        BABYLON.EDITOR.SceneManager.ConfigureObject(container, core);
        BABYLON.EDITOR.SceneFactory.AddBoxMesh(core);
        BABYLON.EDITOR.SceneFactory.AddSkyMesh(core);
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
            get: function () { return (inputPosition.x / 10).toFixed(); },
            set: function (newValue) { inputPosition.x = newValue * 10; }
        },
        inputPositionRow: {
            get: function () { return (inputPosition.z / 10).toFixed(); },
            set: function (newValue) { inputPosition.z = newValue * 10; }
        },
        inputPositionLevel: {
            get: function () { return (inputPosition.y / 10).toFixed(); },
            set: function (newValue) { inputPosition.y = newValue * 10; }
        }
    },
    methods: {
        addContainer: function () {
            var container = BABYLON.Mesh.CreateBox("container" + containerNo++, 1, editorMain.core.currentScene);
            var greenMat = new BABYLON.StandardMaterial("ground", editorMain.core.currentScene);
            greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            greenMat.emissiveColor = BABYLON.Color3.Purple();
            container.material = greenMat;
            container.scaling = new BABYLON.Vector3(20, 10, 10);
            container.position = inputPosition.clone();
            // Configure meshe
            BABYLON.EDITOR.SceneManager.ConfigureObject(container, _this.core);
            //greenBox.checkCollisions = true;
            //container.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1000 });
            //shadowGenerator.getShadowMap().renderList.push(container);
        },
    },
});
//# sourceMappingURL=app.js.map