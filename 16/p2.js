var url = "https://adventofcode.com/2021/day/16/input";
var testData = `C0015000016115A2E0802F182340`

function getInput(isTest) {
	return isTest
		? new Promise((resolve, reject) => resolve(testData))
		: fetch(url).then(res => res.text());
}

class Packet {
    constructor(binary) {
        this.type;
        this.version;
        this.literal;
        this.subPackets = [];
        this.remainingString;

        this.version = parseInt(binary.substring(0, 3), 2);
        this.type = parseInt(binary.substring(3, 6), 2);
        binary = binary.substring(6);


        if (this.type === 4) {
            // literal value
            let _literal = "";
            let finished = false;
            while (!finished) {
                _literal += binary.substring(1, 5);
                finished = binary[0] === "0";
                binary = binary.substring(5);
            };

            this.literal = parseInt(_literal, 2);
        }
        else {
            // operator
            let lengthType = binary[0];
            binary = binary.substring(1);

            if (lengthType === "0") {
                let subPacketLength = parseInt(binary.substring(0, 15), 2);
                binary = binary.substring(15);
                
                let goalLength = binary.length - subPacketLength;

                while (binary.length > goalLength) {
                    let subPacket = new Packet(binary);
                    this.subPackets.push(subPacket);
                    binary = subPacket.remainingString;
                }
            }
            else {
                let numSubPackets = parseInt(binary.substring(0, 11), 2);
                binary = binary.substring(11);

                for (let i = 0; i < numSubPackets; i++) {
                    let subPacket = new Packet(binary);
                    this.subPackets.push(subPacket);
                    binary = subPacket.remainingString;
                }
            }
        }

        this.remainingString = binary;
    }

    get totalVersion() {
        return this.subPackets.map(x => x.totalVersion).reduce((a, b) => a + b, this.version);
    }

    execute() {
        switch (this.type) {
            case 0:
                // sum
                return this.subPackets.map(x => x.execute()).reduce((a, b) => a + b);
            case 1:
                // product
                return this.subPackets.map(x => x.execute()).reduce((a, b) => a * b);
            case 2:
                // minimum
                return Math.min(...this.subPackets.map(x => x.execute()));
            case 3:
                // maximum
                return Math.max(...this.subPackets.map(x => x.execute()));
            case 4:
                // literal
                return this.literal;
            case 5:
                // greater than
                return this.subPackets[0].execute() > this.subPackets[1].execute() ? 1 : 0;
            case 6:
                // less than
                return this.subPackets[0].execute() < this.subPackets[1].execute() ? 1 : 0;
            case 7:
                // equal to
                return this.subPackets[0].execute() === this.subPackets[1].execute() ? 1 : 0;
            default:
                return 0;
        }
    }
}

await getInput(false)
	.then(input => {
        let map = {
            "0": "0000",
            "1": "0001",
            "2": "0010",
            "3": "0011",
            "4": "0100",
            "5": "0101",
            "6": "0110",
            "7": "0111",
            "8": "1000",
            "9": "1001",
            "A": "1010",
            "B": "1011",
            "C": "1100",
            "D": "1101",
            "E": "1110",
            "F": "1111"
        };
        
		input = input
			.split("\n")
			.filter(x => x)[0]
            .split("")
            .map(x => map[x])
            .reduce((a, b) => a + b);

        let binary = input;

        let rootPacket = new Packet(binary);
		
		return rootPacket.execute();
	});