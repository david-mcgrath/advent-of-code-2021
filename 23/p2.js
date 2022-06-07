var url = "https://adventofcode.com/2021/day/23/input";
var testData = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

const TypeCosts = { A: 1, B: 10, C: 100, D: 1000 };
const TypeDestinations = { A: 0, B: 1, C: 2, D: 3 };
const DistanceMap = {
	RoomNumber: [
		{ HallwayIndex: [3,2,2,4,6,8,9] },
		{ HallwayIndex: [5,4,2,2,4,6,7] },
		{ HallwayIndex: [7,6,4,2,2,4,5] },
		{ HallwayIndex: [9,8,6,4,2,2,3] }
	]
};
const MoveThroughMap = {
	RoomNumber: [
		{ HallwayIndex: [
			[1],
			[],
			[],
			[2],
			[2,3],
			[2,3,4],
			[2,3,4,5]
		] },
		{ HallwayIndex: [
			[1,2],
			[2],
			[],
			[],
			[3],
			[3,4],
			[3,4,5]
		] },
		{ HallwayIndex: [
			[1,2,3],
			[2,3],
			[3],
			[],
			[],
			[4],
			[4,5]
		] },
		{ HallwayIndex: [
			[1,2,3,4],
			[2,3,4],
			[3,4],
			[4],
			[],
			[],
			[5]
		] }
	]
};
const MoveTypes = {
	RoomToHallway: 0,
	HallwayToRoom: 1
};

class Amphipod {
	constructor(type) {
		this.Type = type;
		this.MoveCost = TypeCosts[type];
		this.DestinationRoom = TypeDestinations[type];
	}
}

class MoveOption {
	constructor(type, hallwayIndex, roomNumber, roomIndex) {
		this.Type = type;
		this.HallwayIndex = hallwayIndex;
		this.RoomNumber = roomNumber;
		this.RoomIndex = roomIndex;
		
		this.Distance = roomIndex + DistanceMap.RoomNumber[roomNumber].HallwayIndex[hallwayIndex];
	}
	
	CheckValid(map) {
		// Check that there's nothing in the way in the room
		for (let i = this.RoomIndex - 1; i >= 0; i--) {
			if (map.Rooms[this.RoomNumber][i])
				return false;
		}
		
		// Check that there's an Amphipod to move, and no Amphipod currently in the destination position
		if (this.Type === MoveTypes.RoomToHallway && (map.Hallway[this.HallwayIndex] || !map.Rooms[this.RoomNumber][this.RoomIndex]))
			return false;
		if (this.Type === MoveTypes.HallwayToRoom && (map.Rooms[this.RoomNumber][this.RoomIndex] || !map.Hallway[this.HallwayIndex]))
			return false;
		
		// Check that an Amphipod isn't currently trying to move into a room it doesn't belong too, or if it is if there's currently an incorrect Amphipod in the room
		if (this.Type === MoveTypes.HallwayToRoom) {
			let amphipod = map.Hallway[this.HallwayIndex];
			if (amphipod.DestinationRoom !== this.RoomNumber)
				return false;
			
			for (let i = 0; i < map.Rooms[this.RoomNumber].length; i++) {
				if (map.Rooms[this.RoomNumber][i] && map.Rooms[this.RoomNumber][i].DestinationRoom !== this.RoomNumber)
					return false;
			}
		}
		
		// Check that an Amphipod isn't currently trying to leave a room that's full on the correct Amphipods
		if (this.Type === MoveTypes.RoomToHallway) {
			let fullRoom = true;
			for (let i = 0; i < map.Rooms[this.RoomNumber].length; i++) {
				if (!map.Rooms[this.RoomNumber][i] || map.Rooms[this.RoomNumber][i].DestinationRoom !== this.RoomNumber) {
					fullRoom = false
				}
			}
			if (fullRoom)
				return false;
		}
		
		// Check all cells the Amphipod will move through
		let moveThrough = MoveThroughMap.RoomNumber[this.RoomNumber].HallwayIndex[this.HallwayIndex];
		
		for (let i = 0; i < moveThrough.length; i++) {
			if (map.Hallway[moveThrough[i]])
				return false;
		}
		
		return true;
	}
	
	Cost(map) {
		return this.Type === MoveTypes.RoomToHallway
			? map.Rooms[this.RoomNumber][this.RoomIndex].MoveCost * this.Distance
			: map.Hallway[this.HallwayIndex].MoveCost * this.Distance;
	}
}

class Map {
	constructor() {	
		this.Hallway = [null,null,null,null,null,null,null];
		this.Rooms = [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];
		this.CurrentCost = 0;
	}
	
	GetState() {
		return this.Hallway
			.map(x => x ? x.Type : " ")
			.concat(this.Rooms
				.flatMap(x => x
					.map(y => y ? y.Type : " ")))
			.reduce((a, b) => a + b);
	}
	GetOptions() {
		return [MoveTypes.RoomToHallway, MoveTypes.HallwayToRoom]
			.flatMap(type => [0,1,2,3,4,5,6]
				.flatMap(hallwayIndex => [0,1,2,3]
					.flatMap(roomNumber => [0,1,2,3]
						.map(roomIndex => new MoveOption(type, hallwayIndex, roomNumber, roomIndex)))))
			.filter(x => x.CheckValid(this))
			.map(x => new MapWrapper(this, x));
	}
	Copy() {
		let cp = new Map();
		for (let i = 0; i < this.Hallway.length; i++) {
			cp.Hallway[i] = this.Hallway[i];
		}
		for (let i = 0; i < this.Rooms.length; i++) {
			for (let j = 0; j < this.Rooms[i].length; j++) {
				cp.Rooms[i][j] = this.Rooms[i][j];
			}
		}
		cp.CurrentCost = this.CurrentCost;
		
		return cp;
	}
	ApplyMove(move) {
		let cp = this.Copy();
		let amphipod = null;
		
		if (move.Type === MoveTypes.RoomToHallway) {
			amphipod = cp.Rooms[move.RoomNumber][move.RoomIndex];
			cp.Hallway[move.HallwayIndex] = amphipod;
			cp.Rooms[move.RoomNumber][move.RoomIndex] = null;
		}
		else {
			amphipod = cp.Hallway[move.HallwayIndex];
			cp.Rooms[move.RoomNumber][move.RoomIndex] = amphipod;
			cp.Hallway[move.HallwayIndex] = null;
		}
		
		cp.CurrentCost += amphipod.MoveCost * move.Distance;
		
		return cp;
	}
	IsComplete() {
		for (let i = 0; i < this.Rooms.length; i++) {
			for (let j = 0; j < this.Rooms[i].length; j++) {
				let amphipod = this.Rooms[i][j];
				if (!amphipod)
					return false;
				if (amphipod.DestinationRoom !== i)
					return false;
			}
		}
		
		return true;
	}
}

class MapWrapper {
	constructor(map, moveOption) {
		this.Map = map;
		this.MoveOption = moveOption;
		this.Cost = map.CurrentCost + moveOption.Cost(map);
	}
}

class PriorityQueue {
	constructor(comparator = (a, b) => a - b) {
		this.array = [];
		this.comparator = (i1, i2) => comparator(this.array[i1], this.array[i2]);
		this.size = 0;
	}
	
	enqueue(value) {
		this.array.push(value);
		this.size++;
		this.bubbleUp();
	}
	dequeue() {
		if (!this.size)
			return null;
		this.swap(0, this.size - 1);
		let value = this.array.pop();
		this.size--;
		this.bubbleDown();
		return value;
	}
	
	swap(i1, i2) {
		let tmp = this.array[i1];
		this.array[i1] = this.array[i2];
		this.array[i2] = tmp;
	}
	bubbleUp() {
		let index = this.size - 1;
		let parent = (i) => Math.ceil(i / 2 - 1);
		while (parent(index) >= 0 && this.comparator(parent(index), index) > 0) {
			this.swap(parent(index), index)
			index = parent(index)
		}
	}
	bubbleDown() {
		let curr = 0;
		let left = (i) => 2 * i + 1;
		let right = (i) => 2 * i + 2;
		let getTopChild = (i) => (right(i) < this.size && this.comparator(left(i), right(i)) > 0 ? right(i) : left(i));
		
		while (left(curr) < this.size && this.comparator(curr, getTopChild(curr)) > 0) {
			let next = getTopChild(curr);
			this.swap(curr, next);
			curr = next;
		}
	}
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n");
		
		let baseMap = new Map();
		let priorityQueue = new PriorityQueue((a, b) => a.Cost - b.Cost);
		
		baseMap.Rooms[0][0] = new Amphipod(input[2][3]);
		baseMap.Rooms[0][1] = new Amphipod("D");
		baseMap.Rooms[0][2] = new Amphipod("D");
		baseMap.Rooms[0][3] = new Amphipod(input[3][3]);
		baseMap.Rooms[1][0] = new Amphipod(input[2][5]);
		baseMap.Rooms[1][1] = new Amphipod("C");
		baseMap.Rooms[1][2] = new Amphipod("B");
		baseMap.Rooms[1][3] = new Amphipod(input[3][5]);
		baseMap.Rooms[2][0] = new Amphipod(input[2][7]);
		baseMap.Rooms[2][1] = new Amphipod("B");
		baseMap.Rooms[2][2] = new Amphipod("A");
		baseMap.Rooms[2][3] = new Amphipod(input[3][7]);
		baseMap.Rooms[3][0] = new Amphipod(input[2][9]);
		baseMap.Rooms[3][1] = new Amphipod("A");
		baseMap.Rooms[3][2] = new Amphipod("C");
		baseMap.Rooms[3][3] = new Amphipod(input[3][9]);
		
		let baseOptions = baseMap.GetOptions();
		for (let i = 0; i < baseOptions.length; i++) {
			priorityQueue.enqueue(baseOptions[i]);
		}
		
		let finalCost = null;
		
		let seenStates = {};
		
		let n = 0;
		while (priorityQueue.size > 0) {
			
			let curr = priorityQueue.dequeue();
			let currMap = curr.Map.ApplyMove(curr.MoveOption);
			if (currMap.IsComplete()) {
				finalCost = currMap.CurrentCost;
				break;
			}
			
			if (!(n % 10000))
				console.log("Iteration: " + n + ", Queue Size: " + priorityQueue.size + ", Min Cost: " + currMap.CurrentCost);
			
			// Check that the current state hasn't already been seen
			let state = currMap.GetState();
			if (!seenStates[state]) {
				seenStates[state] = true;
			
				let options = currMap.GetOptions();
				for (let i = 0; i < options.length; i++) {
					priorityQueue.enqueue(options[i]);
				}
			}
			n++;
		}
		
		return finalCost;
	});