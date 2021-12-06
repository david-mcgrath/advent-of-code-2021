var url = "https://adventofcode.com/2021/day/1/input";
await fetch(url)
    .then(res => res.text())
    .then(input => input
        .split("\n")
        .map(x => +x)
        .map((curr, i, array) => i > 0 ? [array[i-1], curr] : null)
        .filter(x => x && x[0] < x[1])
        .length);