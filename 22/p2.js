var url = "https://adventofcode.com/2021/day/22/input";
var testData = `on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682`

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n")
			.filter(x => x)
			.map(x => {
				let row = x.split(" ");
				let state = row[0] === "on" ? 1 : 0;
				let ranges = row[1]
					.split(",")
					.map(x => x
						.split("=")[1]
						.split("..")
						.map(x => +x));
				
				return {
					state: state,
					minX: ranges[0][0],
					maxX: ranges[0][1],
					minY: ranges[1][0],
					maxY: ranges[1][1],
					minZ: ranges[2][0],
					maxZ: ranges[2][1],
				};
			});
		
		let onRanges = [];
		
		for (let i = 0; i < input.length; i++) {
			let curr = input[i];
			
			// Partition any intersected ranges
			// (up to 6 ranges need to be added)
			// This needs to be done even if it's on, to avoid duplication
			let intersecting = onRanges
				.filter(x => x.minX <= curr.maxX && x.maxX >= curr.minX && x.minY <= curr.maxY && x.maxY >= curr.minY && x.minZ <= curr.maxZ && x.maxZ >= curr.minZ);
			onRanges = onRanges
				.filter(x => !(x.minX <= curr.maxX && x.maxX >= curr.minX && x.minY <= curr.maxY && x.maxY >= curr.minY && x.minZ <= curr.maxZ && x.maxZ >= curr.minZ));
			
			for (let j = 0; j < intersecting.length; j++) {
				let inter = intersecting[j];
				// top
				if (inter.minY < curr.minY) {
					onRanges.push({
						state: 1,
						minX: inter.minX,
						maxX: inter.maxX,
						minY: inter.minY,
						maxY: curr.minY - 1,
						minZ: inter.minZ,
						maxZ: inter.maxZ,
					})
				}
				// bottom
				if (inter.maxY > curr.maxY) {
					onRanges.push({
						state: 1,
						minX: inter.minX,
						maxX: inter.maxX,
						minY: curr.maxY + 1,
						maxY: inter.maxY,
						minZ: inter.minZ,
						maxZ: inter.maxZ,
					})
				}
				// lower x side
				if (inter.minX < curr.minX) {
					onRanges.push({
						state: 1,
						minX: inter.minX,
						maxX: curr.minX - 1,
						minY: Math.max(curr.minY, inter.minY),
						maxY: Math.min(curr.maxY, inter.maxY),
						minZ: inter.minZ,
						maxZ: inter.maxZ,
					})
				}
				// greater x side
				if (inter.maxX > curr.maxX) {
					onRanges.push({
						state: 1,
						minX: curr.maxX + 1,
						maxX: inter.maxX,
						minY: Math.max(curr.minY, inter.minY),
						maxY: Math.min(curr.maxY, inter.maxY),
						minZ: inter.minZ,
						maxZ: inter.maxZ,
					})
				}
				// lower z cap
				if (inter.minZ < curr.minZ) {
					onRanges.push({
						state: 1,
						minX: Math.max(curr.minX, inter.minX),
						maxX: Math.min(curr.maxX, inter.maxX),
						minY: Math.max(curr.minY, inter.minY),
						maxY: Math.min(curr.maxY, inter.maxY),
						minZ: inter.minZ,
						maxZ: curr.minZ - 1,
					})
				}
				// greater z cap
				if (inter.maxZ > curr.maxZ) {
					onRanges.push({
						state: 1,
						minX: Math.max(curr.minX, inter.minX),
						maxX: Math.min(curr.maxX, inter.maxX),
						minY: Math.max(curr.minY, inter.minY),
						maxY: Math.min(curr.maxY, inter.maxY),
						minZ: curr.maxZ + 1,
						maxZ: inter.maxZ,
					})
				}
			}
			
			// If it's on, just add it to the onRanges list
			if (curr.state === 1) {
				onRanges.push(curr);
			}
		}
		
		return onRanges
			.map(x => (1 + x.maxX - x.minX) * (1 + x.maxY - x.minY) * (1 + x.maxZ - x.minZ))
			.reduce((a, b) => a + b, 0);
	});