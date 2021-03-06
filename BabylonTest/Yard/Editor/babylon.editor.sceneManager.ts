﻿namespace BABYLON.EDITOR {
    // Configured object interface
    interface IObjectConfiguration {
        mesh: AbstractMesh;
        actionManager: ActionManager;
    }

    export class SceneManager {
        // Public members

        /**
        * Objects configuration
        */
        private static _alreadyConfiguredObjectsIDs: Object = { };

        // Reset configured objects
        static ResetConfiguredObjects(): void {
            this._alreadyConfiguredObjectsIDs = { };
        }

        // Switch action manager (editor and scene itself)
        static SwitchActionManager(): void {
            for (var thing in this._alreadyConfiguredObjectsIDs) {
                var obj: IObjectConfiguration = this._alreadyConfiguredObjectsIDs[thing];
                var actionManager = obj.mesh.actionManager;
                obj.mesh.actionManager = obj.actionManager;
                obj.actionManager = actionManager;
            }
        }

        // Configures and object
        static ConfigureObject(object: AbstractMesh | Scene, core: EditorCore, parentNode?: Node): void {
            if (object instanceof AbstractMesh) {
                var mesh: AbstractMesh = object;
                var scene = mesh.getScene();

                /*
                if (this._alreadyConfiguredObjectsIDs[mesh.id])
                    return;
                */

                if (mesh instanceof Mesh && !mesh.geometry)
                    return;

                this._alreadyConfiguredObjectsIDs[mesh.id] = <IObjectConfiguration>{
                    mesh: mesh,
                    actionManager: mesh.actionManager
                };

                // Configure mesh
                mesh.actionManager = new ActionManager(scene);

                mesh.isPickable = true;

                // Pointer over / out
                mesh.actionManager.registerAction(new SetValueAction(ActionManager.OnPointerOverTrigger, mesh, "showBoundingBox", true));
                mesh.actionManager.registerAction(new SetValueAction(ActionManager.OnPointerOutTrigger, mesh, "showBoundingBox", false));

                // Pointer click
                var mouseX = scene.pointerX;
                var mouseY = scene.pointerY;

                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, (evt: ActionEvent) => {
                    mouseX = scene.pointerX;
                    mouseY = scene.pointerY;
                }));

                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, (evt: ActionEvent) => {
                    if (scene.pointerX === mouseX && scene.pointerY === mouseY) {
                        Event.sendSceneEvent(mesh, SceneEventType.OBJECT_PICKED, core);
                        this.setFocusOnObject(mesh, core);
                    }
                }));

                if (parentNode && !mesh.parent) {
                    mesh.parent = parentNode;
                }
            }

            // Send event configured
            ////var ev = new Event();
            ////ev.eventType = EventType.SCENE_EVENT;
            ////ev.sceneEvent = new SceneEvent(object, BABYLON.EDITOR.SceneEventType.OBJECT_PICKED);
            ////core.sendEvent(ev);
        }

        // Sets the focus of the camera
        static setFocusOnObject(object: any, core: EditorCore): void {
            if (!object || !object.position)
                return;

            var scene = core.scene;
            var camera = core.camera;
            var position = object.position;

            if (object.getAbsolutePosition)
                position = object.getAbsolutePosition();

            if (object.getBoundingInfo)
                position = object.getBoundingInfo().boundingSphere.centerWorld;

            var keys = [
                {
                    frame: 0,
                    value: camera.target
                }, {
                    frame: 1,
                    value: position
                }
            ];

            var animation = new Animation("FocusOnObjectAnimation", "target", 10, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
            animation.setKeys(keys);

            scene.stopAnimation(camera);
            scene.beginDirectAnimation(camera, [animation], 0, 1, false, 1);
        }

    }
}