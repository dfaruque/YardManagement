var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        var EditorCore = (function () {
            /**
            * Constructor
            */
            function EditorCore() {
                // Public members
                this.engine = null;
                this.canvas = null;
                this.camera = null;
                this.playCamera = null;
                this.isPlaying = false;
                this.scenes = new Array();
                this.updates = new Array();
                this.eventReceivers = new Array();
                this.editor = null;
            }
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
            EditorCore.prototype.dispose = function () {
            };
            return EditorCore;
        }());
        EDITOR.EditorCore = EditorCore;
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=babylon.editor.core.js.map