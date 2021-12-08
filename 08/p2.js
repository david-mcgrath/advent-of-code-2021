var url = "https://adventofcode.com/2021/day/8/input";
var testData = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

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
            .map(x => x
				.split(" | ")
				.map(y => y
					.split(" ")));

        // 1: 2 length
        // 7: 3 length
        // 4: 4 length
        // 8: 7 length
		
		// 5 length options:
			// 3: both of 1 chars
			// 5: one of 1 chars, three of 4 chars
			// 2: one of 1 chars, two of 4 chars
		
		// 6 length options:
			// 6: one of 1 chars
			// 0: both of 1 chars, three of 4 chars
			// 9: both of 1 chars, all of 4 chars

        var total = 0;
        for (var i = 0; i < input.length; i++) {
            var curr = input[i];
            var output = curr[1];

            var one_chars = curr[0].filter(x => x.length === 2)[0].split("");
            var four_chars = curr[0].filter(x => x.length === 4)[0].split("");
            
            var out_value = 0;

            for (var j = 0; j < output.length; j++) {
                out_value *= 10;
                
                var curr_out = output[j];

                var num_one_chars = one_chars.filter(x => curr_out.indexOf(x) > -1).length;
                var num_four_chars = four_chars.filter(x => curr_out.indexOf(x) > -1).length;
                
                switch (curr_out.length) {
                    case 2:
                        out_value += 1;
                        break;
                    case 3:
                        out_value += 7;
                        break;
                    case 4:
                        out_value += 4;
                        break;
                    case 5:
                        out_value += num_one_chars === 2
                            ? 3
                            : num_four_chars === 3
                                ? 5
                                : 2;
                        break;
                    case 6:
                        out_value += num_one_chars === 2
                            ? num_four_chars === 3
                                ? 0
                                : 9
                            : 6;
                        break;
                    case 7:
                        out_value += 8;
                        break;
                }
            }

            total += out_value;
        }

	
		return total;
    });