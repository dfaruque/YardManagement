// showAngleSector(origin, vector1, vector2, radius, type)
// Displays a circle sector between vector1 and vector2 with origin for vertex
// origin (Vector3) : angle vertex for OA-OB = point O
// vector1 (Vector3) : OA vector
// vector2 (Vector3) : OB vector
// radius (number) : circle sector radius (default 1)
// type (integer 0 - 2) : 0 = Lines (default), 1 = DashedLines, 2 = Ribbon
//
// tag : debug, plotting
// PG : http://www.babylonjs-playground.com/#FUK3S#7

function showAngleSector(origin, vector1, vector2, radius, sectorType) {
    radius = radius || 1;
    sectorType = sectorType || 0;
    var cross = BABYLON.Vector3.Cross(vector1, vector2);
    var dot = BABYLON.Vector3.Dot(vector1, vector2);
    var angle = Math.acos(dot / (vector1.length() * vector2.length()));
    var points = [];
    var minNb = 4;
    var factor = 2;
    var nbPoints = Math.floor(radius * angle * factor);
    nbPoints = (nbPoints < minNb) ? minNb : nbPoints;

    var firstPoint = ((BABYLON.Vector3.Normalize(vector1)).scale(radius));
    var lastPoint = ((BABYLON.Vector3.Normalize(vector2)).scale(radius));
    var matrix;
    var ang = angle / nbPoints;
    var rotated;
    for (var i = 0; i < nbPoints; i++) {
      matrix = BABYLON.Matrix.RotationAxis(cross, ang * i);
      rotated = BABYLON.Vector3.TransformCoordinates(firstPoint, matrix);
      points.push(rotated.add(origin));
    }
    points.push(lastPoint.add(origin));
  
    var sector;
    switch (sectorType) {
      case 0:
        sector = BABYLON.Mesh.CreateLines("sector", points, scene);
        break;
      case 1:
        sector = BABYLON.Mesh.CreateDashedLines("sector", points, 3, 1, nbPoints , scene);
        break;
      case 2:
        var pointO = [];
        for (var j = 0; j < points.length; j++) {
          pointO.push(origin);
        }
        sector = BABYLON.Mesh.CreateRibbon("sector", [points, pointO], null, null, 0, scene);
        break;
      default:
        sector = BABYLON.Mesh.CreateLines("sector", points, scene);
        break;
    }
    return sector;
  }