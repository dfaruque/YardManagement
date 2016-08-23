/// <reference path="scripts/babylon.gridmaterial.d.ts" />

var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
var engine = new BABYLON.Engine(canvas, true);

var scene = new BABYLON.Scene(engine);

var camera = new BABYLON.ArcRotateCamera("Camera", 10, 10, 10, new BABYLON.Vector3(500, 100, 500), scene);
camera.setPosition(new BABYLON.Vector3(1000, 500, 500));

camera.lowerBetaLimit = 0.1;
camera.upperBetaLimit = (Math.PI / 2) * 0.99;
camera.lowerRadiusLimit = 150;
camera.attachControl(canvas, true);

scene.clearColor = BABYLON.Color3.Black();

// Light
var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
light.diffuse = new BABYLON.Color3(1, 1, 1);
light.specular = new BABYLON.Color3(1, 1, 1);
light.position = new BABYLON.Vector3(20, 100, 20);

var light1 = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 100, 0), scene);
var light2 = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 100, 0), scene);
var light3 = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 100, 0), scene);

light1.diffuse = BABYLON.Color3.Red();
light2.diffuse = BABYLON.Color3.Green();
light3.diffuse = BABYLON.Color3.Blue();

// Define states
light1.state = "on";
light2.state = "on";
light3.state = "on";


// Shadows
var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);


// Ground
var ground = BABYLON.MeshBuilder.CreateTiledGround("ground", { xmin: 0, xmax: 1000, zmin: 0, zmax: 1000, subdivisions: { w: 10, h: 20 }, precision: { w: 10, h:20 } }, scene);
ground.position = BABYLON.Vector3.Zero();
var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
//groundMaterial.specularColor = BABYLON.Color3.Black();
groundMaterial.emissiveColor = BABYLON.Color3.Black();
ground.material = groundMaterial;
ground.receiveShadows = true;

// Meshes
// Sphere
var sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 20, scene);
var sphereMat = new BABYLON.StandardMaterial("ground", scene);
sphereMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
sphereMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
sphereMat.emissiveColor = BABYLON.Color3.Purple();
sphere.material = sphereMat;
sphere.position.z += 500;

var greenBox = BABYLON.Mesh.CreateBox("green", 20, scene);
var greenMat = new BABYLON.StandardMaterial("ground", scene);
greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
greenMat.emissiveColor = new BABYLON.Color3(0.4,1,0.4);
greenBox.material = greenMat;
greenBox.scaling = new BABYLON.Vector3(2, 1, 1)
greenBox.position.x += 200;
greenBox.position.z += 100;
greenBox.position.y = 10;

shadowGenerator.getShadowMap().renderList.push(greenBox);

var blueBox = BABYLON.Mesh.CreateBox("blue", 20, scene);
var blueMat = new BABYLON.StandardMaterial("ground", scene);
blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
blueMat.emissiveColor = new BABYLON.Color3(0, 0.58, 0.86);
blueBox.material = blueMat;
blueBox.scaling = new BABYLON.Vector3(2, 1, 1)
blueBox.position.x += 100;
blueBox.position.z += 100;
blueBox.position.y = 100;

shadowGenerator.getShadowMap().renderList.push(blueBox);



//Actions
currentMesh = blueBox;
// On pick interpolations
var prepareButton = function (mesh, color, light) {
    var goToColorAction = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", color, 1000, null, true);

    mesh.actionManager = new BABYLON.ActionManager(scene);
    mesh.actionManager.registerAction(
        new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.Black(), 1000))
        .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action. 
            goToColorAction,                                                 // First click: root action. Second click: child action. Third click: going back to root action and so on...   
            new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, mesh.material, "wireframe", false)
        ]));
    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, mesh.material, "wireframe", true))
        .then(new BABYLON.DoNothingAction());
    mesh.actionManager.registerAction(new BABYLON.SetStateAction(BABYLON.ActionManager.OnPickTrigger, light, "off"))
        .then(new BABYLON.SetStateAction(BABYLON.ActionManager.OnPickTrigger, light, "on"));
}

prepareButton(greenBox, BABYLON.Color3.Green(), light2);
prepareButton(blueBox, BABYLON.Color3.Blue(), light3);

// Conditions
sphere.actionManager = new BABYLON.ActionManager(scene);
var condition1 = new BABYLON.StateCondition(sphere.actionManager, light1, "off");
var condition2 = new BABYLON.StateCondition(sphere.actionManager, light1, "on");

sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnLeftPickTrigger, camera, "alpha", 0, 500, condition1));
sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnLeftPickTrigger, camera, "alpha", Math.PI, 500, condition2));

// Over/Out
var makeOverOut = function (mesh) {
    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.Black()));
    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor));
}

makeOverOut(greenBox);
makeOverOut(blueBox);

// scene's actions
//scene.actionManager = new BABYLON.ActionManager(scene);

//var rotate = function (mesh) {
//    scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, mesh, "rotation.y", 0.01));
//}

//rotate(greenBox);
//rotate(blueBox);

var enablePhysics = function () {
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    //blueBox.checkCollisions = true;
    blueBox.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1000, friction: 0.7, restitution: 0.5 });
    //greenBox.checkCollisions = true;
    greenBox.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1000 });
    //ground.checkCollisions = true;
    ground.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0 });

}
//enablePhysics();

// Events
var startingPoint: BABYLON.Vector3;
var currentMesh: BABYLON.AbstractMesh;

var getGroundPosition = function (): BABYLON.Vector3 {
    var pickinfo = scene.pick(scene.pointerX, scene.pointerY);
    if (pickinfo.hit) {
        return pickinfo.pickedPoint;
    }

    return null;
}

var onPointerDown = function (evt) {
    if (evt.button !== 0) {
        return;
    }

    // check if we are under a mesh
    var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
    if (pickInfo.hit) {
        currentMesh = pickInfo.pickedMesh;

        startingPoint = getGroundPosition();

        if (startingPoint) { // we need to disconnect camera from canvas
            setTimeout(function () {
                //scene.disablePhysicsEngine();
                camera.detachControl(canvas);
            }, 0);
        }
    }
}

var onPointerUp = function () {
    if (startingPoint) {
        //scene.enablePhysics();
        camera.attachControl(canvas, true);
        //camera.setTarget(startingPoint);
        startingPoint = null;

        return;
    }
}

var onPointerMove = function (evt) {
    if (!startingPoint) {
        return;
    }

    var current = getGroundPosition();

    if (!current) {
        return;
    }

    if (current.y < 20) current.y = 20;

    var diff = current.subtract(startingPoint);
    currentMesh.position.addInPlace(diff);

    startingPoint = current;

}

canvas.addEventListener("pointerdown", onPointerDown, false);
canvas.addEventListener("pointerup", onPointerUp, false);
canvas.addEventListener("pointermove", onPointerMove, false);

scene.onDispose = function () {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointermove", onPointerMove);
}



engine.runRenderLoop(function () {
    scene.render();
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

