module BABYLON.EDITOR {
    export class EditorCore implements /*ICustomUpdate,*/ IDisposable {
        // Public members
        public engine: Engine = null;
        public canvas: HTMLCanvasElement = null;

        public camera: ArcRotateCamera = null;

        public playCamera: Camera = null;
        public isPlaying: boolean = false;

        public scenes: Array<any> = new Array<any>();
        public currentScene: Scene;

        public updates: Array<any> = new Array<any>();
        public eventReceivers: Array<any> = new Array<any>();

        public editor = null;

        /**
        * Constructor
        */
        constructor()
        { }

        ///**
        //* Removes a scene
        //*/
        //public removeScene(scene: Scene): boolean {
        //    for (var i = 0; i < this.scenes.length; i++) {
        //        if (this.scenes[i].scene === scene) {
        //            this.scenes.splice(i, 1);
        //            return true;
        //        }
        //    }

        //    return false;
        //}

        ///**
        //* Removes an event receiver
        //*/
        //public removeEventReceiver(receiver): boolean {
        //    for (var i = 0; i < this.eventReceivers.length; i++) {
        //        if (this.eventReceivers[i] === receiver) {
        //            this.eventReceivers.splice(i, 1);
        //            return true;
        //        }
        //    }
        //    return false;
        //}

        ///**
        //* On pre update
        //*/
        //public onPreUpdate(): void {
        //    for (var i = 0; i < this.updates.length; i++) {
        //        this.updates[i].onPreUpdate();
        //    }
        //}

        ///**
        //* On post update
        //*/
        //public onPostUpdate(): void {
        //    for (var i = 0; i < this.updates.length; i++) {
        //        this.updates[i].onPostUpdate();
        //    }
        //}

        ///**
        //* Send an event to the event receivers
        //*/
        //public sendEvent(event) {
        //    for (var i = 0; i < this.eventReceivers.length; i++)
        //        this.eventReceivers[i].onEvent(event);
        //}

        /**
        * IDisposable
        */ 
        public dispose(): void {

        }
    }
}