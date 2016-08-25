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

const multiplicationFactor = 10;

var editorMain = new BABYLON.EDITOR.EditorMain("BABYLON-EDITOR-MAIN", true);

var core = editorMain.core;
var scene = core.currentScene;
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

scene.clearColor = BABYLON.Color3.Black();
var light = BABYLON.EDITOR.SceneFactory.AddYardDirectionalLight(core);
var block = BABYLON.EDITOR.SceneFactory.AddYardBlockGroundMesh(core, '1',9,6);
core.shadowGenerator = new BABYLON.ShadowGenerator(100, light);
editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;


var yardContainer = BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++,
    { column: 4, row: 4, level: 2 },
    new BABYLON.Color3(Math.random(), Math.random(), Math.random()));

var currentMesh = null;

var vm = new Vue({
    el: '#divConsole',
    ready: () => {

        editorMain.createRenderLoop();
    },
    data: {
        scene: scene,
        //startingPoint: startingPoint,
        //selectedContainer: currentMesh,
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



    methods: {
        addContainer: () => {
            var con = BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++,
                { column: 3, row: 3, level: 2 },
                new BABYLON.Color3(Math.random(), Math.random(), Math.random()));

        },

        moveUp: () => {
            currentMesh.position.y += currentMesh.getBoundingInfo().boundingBox.extendSize.y
                * currentMesh.scaling.y * 3;
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

