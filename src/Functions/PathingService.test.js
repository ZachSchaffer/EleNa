import { PathingService, Dijkstra} from './PathingService';
import Location from './Location';

test('test getStartCorner', () => {
  var startBR = new Location(42.37781, -72.513204, 0); // bottom right
  var endTL = new Location(42.382467, -72.518201, 0); // top left
  var ps0 = new PathingService(startBR, endTL);
  expect(ps0.getStartCorner()).toEqual(0);

  var startBL = new Location(42.377491, -72.522535, 0); // bottom left
  var endTR = new Location(42.382467, -72.518201, 0); // top right
  var ps1 = new PathingService(startBL, endTR);
  expect(ps1.getStartCorner()).toEqual(1);

  var startTR = new Location(42.382467, -72.518201, 0); // top right
  var endBL = new Location(42.377491, -72.522535, 0); // bottom left
  var ps2 = new PathingService(startTR, endBL);
  expect(ps2.getStartCorner()).toEqual(2);

  var startTL = new Location(42.382467, -72.518201, 0); // top left
  var endBR = new Location(42.37781, -72.513204, 0); // bottom right
  var ps3 = new PathingService(startTL, endBR);
  expect(ps3.getStartCorner()).toEqual(3);
});

test('test getSearchArea', () => {
  var start = new Location(42.377491, -72.522535, 0);
  var end = new Location(42.382467, -72.518201, 0);

  var ps = new PathingService(start, end);
  var latDif = 0.005292999999994663;
  var lngDif = 0.003832000000002722;

  //test with k value of 0
  var actualCorners = ps.getSearchArea(latDif, lngDif, 0);
  expect(actualCorners).toEqual([
    [42.377491, -72.518201],
    [42.382467, -72.518201],
    [42.377491, -72.522535],
    [42.382467, -72.522535],
  ]);

  // test with k value of 2
  var actualCorners2 = ps.getSearchArea(latDif, lngDif, 2);
  expect(actualCorners2).toEqual([
    [42.37738514, -72.51812436],
    [42.382572859999996, -72.51812436],
    [42.37738514, -72.52261164000001],
    [42.382572859999996, -72.52261164000001],
  ]);
});

test('test Djikstra', () =>{

})

test('test determinePath', () => {

})

test('test createAdjacencyMatrix', () => {

  let nodesList = [
    new Location(1,1, 0),
    new Location(2,2, 10),
    new Location(3,3,2),
    new Location(4,4,7),
    new Location(5,5,8),
    new Location(6,6,4),
  ];

  let test = new Dijkstra(nodesList, true, 20);
  let result = test.createAdjacencyMatrix();
  expect(result).toEqual([
    [0, 10, 2, 7, 8, 4],
    [0, 0, 0, 0, 0, 0],
    [0, 8, 0, 5, 6, 2],
    [0, 3, 0, 0, 1, 0],
    [0, 2, 0, 0, 0, 0],
    [0, 6, 0, 3, 4, 0]

  ])

})
