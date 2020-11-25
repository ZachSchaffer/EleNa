import { Dijkstra } from './Dijkstra';
import Location from './Location';

test('test createAdjacencyMatrix', () => {
  
  let nodesList = [
    [1,1,1]
  ]

  let test = new Dijkstra(nodesList,  new Location(1,1, 0) , new Location(6,6,4), 100, 100, true, 100);
  let result = test.createAdjacencyMatrix();

  expect(result).toEqual([[[[0, 1]], [[0, 0], [0, 2]], [[0, 1]]]])

})

test('test isAdjacent', () => {

  let test = new Dijkstra([], 0, 0, 0, 0, 0, 0);

  expect(test.isAdjacent(1, 0, 0, 0)).toBeTruthy()
  expect(test.isAdjacent(0, 1, 0, 0)).toBeTruthy()
  expect(test.isAdjacent(-1, 0, 0, 0)).toBeTruthy()
  expect(test.isAdjacent(0, -1, 0, 0)).toBeTruthy()
  expect(test.isAdjacent(-1, -1, 0, 0)).toBeTruthy()
  expect(test.isAdjacent(1, 1, 0, 0)).toBeTruthy()

  expect(test.isAdjacent( 0, 0, 1, 0)).toBeTruthy()
  expect(test.isAdjacent(0, 0, 0 , 1)).toBeTruthy()
  expect(test.isAdjacent(0, 0, -1, 0)).toBeTruthy()
  expect(test.isAdjacent( 0, 0, 0, -1)).toBeTruthy()
  expect(test.isAdjacent( 0, 0, -1, -1)).toBeTruthy()
  expect(test.isAdjacent(0, 0, 1, 1)).toBeTruthy()

  expect(test.isAdjacent(2, 0, 0, 0)).toBeFalsy()
  expect(test.isAdjacent(0, 2, 0, 0)).toBeFalsy()
  expect(test.isAdjacent(-2, 0, 0, 0)).toBeFalsy()
  expect(test.isAdjacent(0, -2, 0, 0)).toBeFalsy()
  expect(test.isAdjacent(-2, -2, 0, 0)).toBeFalsy()
  expect(test.isAdjacent(2, 2, 0, 0)).toBeFalsy()

  expect(test.isAdjacent( 0, 0, 2, 0)).toBeFalsy()
  expect(test.isAdjacent(0, 0, 0 , 2)).toBeFalsy()
  expect(test.isAdjacent(0, 0, -2, 0)).toBeFalsy()
  expect(test.isAdjacent( 0, 0, 0, -2)).toBeFalsy()
  expect(test.isAdjacent( 0, 0, -2, -2)).toBeFalsy()
  expect(test.isAdjacent(0, 0, 2, 2)).toBeFalsy()


})

test('test distance', () => {

  let i = new Location(42.374332, -72.521331, 10)
  let j = new Location(42.377221, -72.516295, 100)

  let test = new Dijkstra([], 0, 0, 0, 0, 0, 0);

  expect(test.distance( i, j )).toEqual(2115.2191253525707)

})

test('test adjacentPoints', () => {

  let nodesList = [
    new Location(1,1, 0),
    new Location(2,2, 10),
    new Location(3,3,2),
    new Location(4,4,7),
    new Location(5,5,8),
    new Location(6,6,4),
  ];


  let test = new Dijkstra(nodesList, 0, 0, 0, 0, 0, 0);

  expect(test.getAdjacentPoints(1,1)).toEqual( [ [0, 0], [0, 1], [2, 0], [2, 1], [1, 0] ])

})

test('test isStartPosition', () => {

  let test = new Dijkstra([], [1,1], [2,2], 1, 1, 0, 0)

  expect(test.isStartPosition(1,1)).toBeTruthy()

})
