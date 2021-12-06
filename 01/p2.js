var url = "https://adventofcode.com/2021/day/1/input";
await fetch(url)
    .then(res => res.text())
    .then(input => input
        .split("\n")
        .map(x => +x)
        .map((curr, i, array) => i > 2 ? [array[i-3] + array[i-2] + array[i-1], array[i-2] + array[i-1] + curr] : null)
        .filter(x => x !== null && x[0] < x[1])
        .length);