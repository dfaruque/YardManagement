/// <reference path="babylon.d.ts" />
declare const multiplicationFactor: number;
declare namespace YARD {
    class main {
        constructor();
    }
}
declare namespace BABYLON {
    class yardBlock extends BABYLON.Mesh {
        capacity: yardLocationVector;
        size: yardSizeVector;
        yardLocations: yardLocationVector[];
    }
    class yardContainer extends BABYLON.Mesh {
        private _yardLocation;
        yardLocation: yardLocationVector;
    }
}
declare var blockGrid: (block: BABYLON.yardBlock) => any;
declare function showNormals(mesh: any, size: any, color: any, sc: any): BABYLON.LinesMesh;
declare function showWorldAxis(size: any, scene: any): void;
declare namespace BABYLON.EDITOR {
    class EditorCore implements ICustomUpdate, IDisposable {
        engine: Engine;
        canvas: HTMLCanvasElement;
        camera: ArcRotateCamera;
        playCamera: Camera;
        isPlaying: boolean;
        scenes: Array<ICustomScene>;
        currentScene: Scene;
        updates: Array<ICustomUpdate>;
        eventReceivers: Array<IEventReceiver>;
        editor: EditorMain;
        shadowGenerator: any;
        /**
        * Constructor
        */
        constructor();
        /**
        * Removes a scene
        */
        removeScene(scene: Scene): boolean;
        /**
        * Removes an event receiver
        */
        removeEventReceiver(receiver: IEventReceiver): boolean;
        /**
        * On pre update
        */
        onPreUpdate(): void;
        /**
        * On post update
        */
        onPostUpdate(): void;
        /**
        * Send an event to the event receivers
        */
        sendEvent(event: IEvent): void;
        /**
        * IDisposable
        */
        dispose(): void;
    }
}
declare namespace BABYLON.EDITOR {
    class EditorMain implements IDisposable, IEventReceiver {
        core: EditorCore;
        transformer: Transformer;
        container: string;
        mainContainer: string;
        antialias: boolean;
        options: any;
        filesInput: FilesInput;
        renderMainScene: boolean;
        renderHelpers: boolean;
        static DummyNodeID: string;
        /**
        * Constructor
        */
        constructor(containerID: string, antialias?: boolean, options?: any);
        /**
        * Event receiver
        */
        onEvent(event: Event): boolean;
        /**
        * Creates the UI
        */
        private _createUI();
        /**
        * Handles just opened scenes
        */
        private _handleSceneLoaded();
        /**
        * Creates the babylon engine
        */
        private _createBabylonEngine();
        /**
        * Creates the editor camera
        */
        private _createBabylonCamera();
        /**
        * Creates the render loop
        */
        createRenderLoop(): void;
        /**
        * Simply update the scenes and updates
        */
        update(): void;
        dispose(): void;
    }
}
declare namespace BABYLON.EDITOR {
    interface IEnabledPostProcesses {
        hdr: boolean;
        attachHDR: boolean;
        ssao: boolean;
        ssaoOnly: boolean;
        attachSSAO: boolean;
        vls: boolean;
    }
    class SceneFactory {
        static GenerateUUID(): string;
        static ConfigureObject(object: any, core: EditorCore): void;
        static HDRPipeline: HDRRenderingPipeline;
        static SSAOPipeline: SSAORenderingPipeline;
        static VLSPostProcess: VolumetricLightScatteringPostProcess;
        static EnabledPostProcesses: IEnabledPostProcesses;
        static NodesToStart: IAnimatable[];
        static AnimationSpeed: number;
        /**
        * Post-Processes
        */
        static CreateSSAOPipeline(core: EditorCore, serializationObject?: any): SSAORenderingPipeline;
        static CreateVLSPostProcess(core: EditorCore, mesh?: Mesh, serializationObject?: any): VolumetricLightScatteringPostProcess;
        /**
        * Nodes
        */
        static AddPointLight(core: EditorCore): PointLight;
        static AddDirectionalLight(core: EditorCore): DirectionalLight;
        static AddSpotLight(core: EditorCore): SpotLight;
        static AddHemisphericLight(core: EditorCore): HemisphericLight;
        static AddBoxMesh(core: EditorCore): Mesh;
        static AddSphereMesh(core: EditorCore): Mesh;
        static AddPlaneMesh(core: EditorCore): Mesh;
        static AddGroundMesh(core: EditorCore): Mesh;
        static AddHeightMap(core: EditorCore): Mesh;
        static AddLensFlare(core: EditorCore, system: LensFlareSystem, size: number, position: number, color: any): LensFlare;
        static AddReflectionProbe(core: EditorCore): ReflectionProbe;
        static AddRenderTargetTexture(core: EditorCore): RenderTargetTexture;
        static AddSkyMesh(core: EditorCore): Mesh;
        static AddYardContainer(core: EditorCore, id: any, block: yardBlock, size: number, yardLocation: yardLocationVector, color: Color3): Mesh;
        static AddYardBlockGroundMesh(core: EditorCore, id: any, containerSize: any, columns: any, rows: any, levels: any): yardBlock;
        static AddYardSkyMesh(core: EditorCore): Mesh;
        static AddYardDirectionalLight(core: EditorCore): DirectionalLight;
    }
}
declare namespace BABYLON.EDITOR {
    class SceneManager {
        /**
        * Objects configuration
        */
        private static _alreadyConfiguredObjectsIDs;
        static ResetConfiguredObjects(): void;
        static SwitchActionManager(): void;
        static ConfigureObject(object: AbstractMesh | Scene, core: EditorCore, parentNode?: Node): void;
        static setFocusOnObject(object: any, core: any): void;
    }
}
declare namespace BABYLON.EDITOR {
    enum TransformerType {
        POSITION = 0,
        ROTATION = 1,
        SCALING = 2,
        NOTHING = 3,
    }
    class Transformer implements IEventReceiver, ICustomUpdate {
        core: EditorCore;
        private _scene;
        private _node;
        private _helperPlane;
        private _planeMaterial;
        private _subMesh;
        private _batch;
        private _cameraTexture;
        private _soundTexture;
        private _lightTexture;
        private _transformerType;
        private _xTransformers;
        private _yTransformers;
        private _zTransformers;
        private _sharedScale;
        private _pickingPlane;
        private _mousePositionInPlane;
        private _mousePosition;
        private _mouseDown;
        private _pickPosition;
        private _pickingInfo;
        private _vectorToModify;
        private _selectedTransform;
        private _distance;
        private _multiplier;
        private _ctrlIsDown;
        /**
        * Constructor
        * @param core: the editor core instance
        */
        constructor(core: EditorCore);
        createHelpers(core: EditorCore): void;
        onEvent(event: Event): boolean;
        onPreUpdate(): void;
        onPostUpdate(): void;
        transformerType: TransformerType;
        node: Node;
        getScene(): Scene;
        private _getNodePosition();
        private _renderHelperPlane(array, onConfigure);
        private _updateTransform(distance);
        private _getIntersectionWithLine(linePoint, lineVect);
        private _findMousePositionInPlane(pickingInfos);
        private _createTransformers();
        private _createPositionTransformer(color, id);
        private _createRotationTransformer(color, id);
        private _createScalingTransformer(color, id);
    }
}
declare namespace BABYLON.EDITOR {
    /**
    * Event Type
    */
    enum EventType {
        SCENE_EVENT = 0,
        GUI_EVENT = 1,
        UNKNOWN = 2,
    }
    enum GUIEventType {
        FORM_CHANGED = 0,
        FORM_TOOLBAR_CLICKED = 1,
        LAYOUT_CHANGED = 2,
        PANEL_CHANGED = 3,
        GRAPH_SELECTED = 4,
        GRAPH_DOUBLE_SELECTED = 5,
        TAB_CHANGED = 6,
        TOOLBAR_MENU_SELECTED = 7,
        GRAPH_MENU_SELECTED = 8,
        GRID_SELECTED = 9,
        GRID_ROW_REMOVED = 10,
        GRID_ROW_ADDED = 11,
        GRID_ROW_EDITED = 12,
        GRID_ROW_CHANGED = 13,
        GRID_MENU_SELECTED = 14,
        GRID_RELOADED = 15,
        WINDOW_BUTTON_CLICKED = 16,
        OBJECT_PICKED = 17,
        UNKNOWN = 18,
    }
    enum SceneEventType {
        OBJECT_PICKED = 0,
        OBJECT_ADDED = 1,
        OBJECT_REMOVED = 2,
        OBJECT_CHANGED = 3,
        UNKNOWN = 4,
    }
    /**
    * Base Event
    */
    class BaseEvent {
        data: any;
        constructor(data?: Object);
    }
    /**
    * Scene Event
    */
    class SceneEvent extends BaseEvent {
        object: any;
        eventType: SceneEventType;
        /**
        * Constructor
        * @param object: the object generating the event
        */
        constructor(object: any, eventType: number, data?: Object);
    }
    /**
    * GUI Event
    */
    class GUIEvent extends BaseEvent {
        caller: GUI.IGUIElement;
        eventType: GUIEventType;
        /**
        * Constructor
        * @param caller: gui element calling the event
        * @param eventType: the gui event type
        */
        constructor(caller: any, eventType: number, data?: Object);
    }
    /**
    * IEvent implementation
    */
    class Event implements IEvent {
        eventType: EventType;
        sceneEvent: SceneEvent;
        guiEvent: GUIEvent;
        static sendSceneEvent(object: any, type: SceneEventType, core: EditorCore): void;
        static sendGUIEvent(object: any, type: GUIEventType, core: EditorCore): void;
    }
}
declare namespace BABYLON.EDITOR {
    class Tools {
        /**
        * Returns a vector3 string from a vector3
        */
        static GetStringFromVector3(vector: Vector3): string;
        /**
        * Returns a vector3 from a vector3 string
        */
        static GetVector3FromString(vector: string): Vector3;
        /**
        * Converts a base64 string to array buffer
        * Largely used to convert images, converted into base64 string
        */
        static ConvertBase64StringToArrayBuffer(base64String: string): Uint8Array;
        /**
        * Opens a window popup
        */
        static OpenWindowPopup(url: string, width: number, height: number): any;
        /**
        * Returns the base URL of the window
        */
        static getBaseURL(): string;
        /**
        * Creates an input element
        */
        static CreateFileInpuElement(id: string): JQuery;
        /**
        * Beautify a variable name (escapeds + upper case)
        */
        static BeautifyName(name: string): string;
        /**
        * Cleans an editor project
        */
        static CleanProject(project: any): void;
        /**
        * Returns the constructor name of an object
        */
        static GetConstructorName(obj: any): string;
        /**
        * Converts a boolean to integer
        */
        static BooleanToInt(value: boolean): number;
        /**
        * Converts a number to boolean
        */
        static IntToBoolean(value: number): boolean;
        /**
        * Returns a particle system by its name
        */
        static GetParticleSystemByName(scene: Scene, name: string): ParticleSystem;
    }
}
