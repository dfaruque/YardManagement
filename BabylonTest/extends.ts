namespace BABYLON {
    export class yardBlock extends BABYLON.Mesh {
        capacity: yardLocationVector;

        size: yardSizeVector;
        yardLocations: yardLocationVector[];

        //private _yardContainerSize: yardSizeVector;
        //get yardContainerSize(): yardSizeVector {
        //    return {
        //        width_z: this.size.width_z / this.capacity.column_z,
        //        length_x: this.size.length_x / this.capacity.row_x,
        //        height_y: this.size.height_y / this.capacity.level_y
        //    };
        //}
        //set yardContainerSize(theValue: yardSizeVector) {
        //    this._yardContainerSize = theValue;
        //};



        //get yardContainers(): yardContainer[] {
        //    return {
        //        };
        //}


    }
    export class yardContainer extends BABYLON.Mesh {

        private _yardLocation: yardLocationVector;

        public get yardLocation(): yardLocationVector {
            return this._yardLocation;
        }
        public set yardLocation(theValue: yardLocationVector) {
            this._yardLocation = theValue;

            var block = this.parent as Mesh;
            this.position = new Vector3(
                (theValue.row_x - 1 / 2) * this.scaling.x + block._boundingInfo.minimum.x,
                this.scaling.y / 2,
                (theValue.column_z - 1 / 2) * this.scaling.z + block._boundingInfo.minimum.z);
        };


    }

}