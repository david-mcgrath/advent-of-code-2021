var url = "https://adventofcode.com/2021/day/17/input";
var testData = `target area: x=20..30, y=-10..-5`

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

await getInput(false)
	.then(input => {
		input = input
			.split("\n")
			.filter(x => x)[0]
            .split("x=")[1]
			.split(", y=")
			.map(x => x
				.split("..")
				.map(y => +y));
		
		let min_x = input[0][0],
			max_x = input[0][1],
			min_y = input[1][0],
			max_y = input[1][1];
		
		// x distance before drag reduces it to 0 is: n(n + 1)/2
		// let n(n + 1)/2 = min_x
		// n^2 + n - 2 * min_x = 0
		// n = (-1 +/- sqrt(-1^2 - 4 * 1 * (-2 * min_x))) / (2 * 1)
		// positive solution only
		// n = (-1 + sqrt(1 + 8 * min_x)) / 2
		// round up, assume that there is a solution
		
		let min_x_velocity = Math.ceil((Math.sqrt(1 + 8 * min_x) - 1) / 2);
		
		// max x velocity is just equal to max x (so only one step)
		
		let max_x_velocity = max_x;
		
		// assuming a positive y velocity, there will always be a point where the current height is equal to the initial height
		// so the max height will be achieved when the NEXT step beyond that point is the minimum y height (assuming negative y, which it is)
		// so the previous step (which is the inverse of the initial velocity) is equal to min_y + 1
		// so initial velocity is -(min_y + 1);
		
		let max_y_velocity = -(min_y + 1);
		
		// min y velocity is min y
		
		let min_y_velocity = min_y;
		
		let valid = [];
		
		for (let vx = min_x_velocity; vx <= max_x_velocity; vx++) {
			for (let vy = min_y_velocity; vy <= max_y_velocity; vy++) {
				let x = 0,
					y = 0,
					dx = vx,
					dy = vy;
				
				while (x <= max_x && y >= min_y) {
					x += dx;
					y += dy;
					dx = dx > 0 ? dx - 1 : 0;
					dy--;
					
					if (x >= min_x && x <= max_x && y >= min_y && y <= max_y) {
						valid.push([vx, vy]);
						break;
					}
				}
			}				
		}
		
		// At this point I have a min x and a max y, 
		
		return valid.length;
	});