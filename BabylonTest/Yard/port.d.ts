declare class YARDLocationVector{
    column_z: number;
    row_x: number;
    level_y: number;

    isEmpty: boolean;
    //yardContainer: YARD.YARDContainer;
}

//actual size
declare class YARDSizeVector {
    length_z: number;
    height_y: number;
    width_x: number;
}

//one TEU - 20 feet (6.1 m) x 8- foot(2.4 m) x 8- foot - 6 - inch(2.59 m)
//two TEU - 40 feet (12 m) x 8- foot(2.4 m) x 8- foot - 6 - inch(2.59 m)

//20 feet container ratio
//length = 2
//width=0.8
//higth = 0.86

//40 feet container ratio
//length = 4
//width = 0.8
//higth = 0.86