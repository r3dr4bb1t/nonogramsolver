// solve.js
console.log(solve(16, 16, [[1, 7, 5],
[2, 2, 1, 3, 3],
[2, 2, 1, 3, 2],
[2, 7, 1, 1],
[2, 3, 2, 3],
[1, 2, 1, 3, 1],
[1, 1, 2, 4],
[1, 5, 1, 2],
[10, 2],
[3, 2, 6, 1],
[1, 4, 1, 2],
[6, 2, 2, 1],
[3, 4, 4, 1],
[6, 7],
[3, 1, 1, 6],
[2, 4, 1, 5]],
	[[3, 1, 3],
	[6, 7],
	[1, 2, 1, 4],
	[1, 1, 1, 1, 4, 1],
	[4, 1, 1, 2, 3],
	[2, 2, 7, 1],
	[1, 10, 1],
	[5, 2, 1, 1],
	[1, 1, 5, 2],
	[10, 1, 1, 1],
	[5, 2, 4],
	[3, 1, 3, 4],
	[1, 2, 1, 8],
	[2, 1, 2, 7],
	[3, 1, 3, 3],
	[4, 2, 2, 2, 2]]))

var uniqThreshold

function solve(width, height, columnHints, rowHints) {
	// start(): timer start
	uniqThreshold = {}
	let grid = Array(height).fill().map(() => Array(width).fill(-1))
	preProcess(grid, width, height, rowHints)
	grid = transpose(preProcess(transpose(grid), height, width, columnHints))

	while (isNotFinished(grid)) {
		processWholeGrid(grid, width, height, rowHints)
		grid = processWholeGrid(transpose(grid), height, width, columnHints)
		//console.log(grid)
	}
	//console.log(grid)
	process.exit(0)
	const answer = [].concat(...grid)
	// end(): timer end, print elapsed time
	return answer
}

function processWholeGrid(grid, width, height, rowHints) {
	for (let i = 0; i < height; i++) {
		if (rowHints[i].length == 0) continue;
		var rowSum = 0
		let lineSum = 0
		for (let j = 0; j < rowHints[i].length; j++) {
			rowSum += rowHints[i][j]
		}
		for (j = 0; j < width; j++) {
			if (grid[i][j] == 1) lineSum++
		}
		//console.log(rowHints[i], lineSum, rowSum)
		if (lineSum == rowSum) {
			for (j = 0; j < width; j++) {
				if (grid[i][j] == -1) {
					grid[i][j] = 0
				}
			}
			continue
		}

		const numOfBlanks = width - rowHints[i].reduce((p, c) => p + c) - rowHints[i].length + 1
		processOneLine(grid, width, height, rowHints, grid[i], numOfBlanks, rowHints[i])
	}
	return transpose(grid)
}

function processOneLine(grid, width, height, rowHints, line, numOfBlanks, hintsArray) {
	var hints = hintsArray.slice()
	hints = hints.map((hint) => hint + 1)
	var possibleIdxs = []
	var subSum = 0;
	for (var i = 0; i < hints.length; i++) {
		subSum += hints[i]
		possibleIdxs.push(subSum)
	}
	possibleIdxs.unshift(0)
	const combinations = getCombinationsOf(possibleIdxs, numOfBlanks)
	let baseline = getBaseLine(hintsArray)
	let possibleLists = []
	const insert = (arr, index, ...newItems) => [
		...arr.slice(0, index),
		...newItems,
		...arr.slice(index)
	]
	for (const comb of combinations) {
		let candidates = baseline.slice()
		let changeOfIdx = 0
		for (const idx of comb)
			candidates = insert(candidates, idx + changeOfIdx++, 0)
		possibleLists.push(candidates)
	}

	const realCandidates = pruneLists(possibleLists, line)
	markConjunction(realCandidates, line)
	//console.log(uniqThreshold[line])
	if (uniqThreshold[line] > 3) {
		// console.log(uniqThreshold)
		console.log(line)
		for (let j = 0; j < line.length; j++) {
			//	console.log(line)
			if (line[j] == -1) {
				line[j] = 1
				//console.log(line)
				let lineSum = 0
				for (let j = 0; j < line.length; j++) {
					if (line[j] == 1) lineSum += line[j]
				}
				//console.log(hintsArray.reduce((p, c) => p + c))
				if (lineSum == hintsArray.reduce((p, c) => p + c)) {
					//console.log(lineSum)
					for (let j = 0; j < line.length; j++) {
						if (line[j] == -1) line[j] = 0
					}
				}
			}
			processWholeGrid(grid, width, height, rowHints)
			//	console.log(line, "#@@#@#@#@#@#")

			uniqThreshold[line] = 0
			break;
		}
		// console.log(uniqThreshold)
		// console.log(line)
	}
}

function pruneLists(possibleLists, line) {
	for (const list of possibleLists) {
		for (let j = 0; j < list.length; j++) {
			const zeroButOne = (line[j] === 0 && list[j] === 1)
			const oneButZero = (line[j] === 1 && list[j] === 0)
			if (zeroButOne || oneButZero) {
				possibleLists = possibleLists.filter(v => v !== list)
			}
		}
	}
	return possibleLists
}

function markConjunction(realCandidates, line) {
	//console.log(line.toString())
	if (line.toString() == `-1,-1,1,-1,-1,0,0,0,0,1,0,0,0,1,1,1`) {
		//console.log(realCandidates)
	}
	const transposedList = transpose(realCandidates)
	let lineNo = 0
	let count = 0
	for (const list of transposedList) {
		const lineSum = list.reduce((p, c) => p + c)
		if (lineSum == 0) line[lineNo] = 0
		if (lineSum == list.length) line[lineNo] = 1
		if (lineSum != 0 && lineSum != list.length) {
			count++;
		}
		lineNo++
	}
	if (count == realCandidates.length) {
		if (!uniqThreshold[line]) uniqThreshold[line] = 0
		uniqThreshold[line]++
	}
	//console.log(uniqThreshold[line])
}

function preProcess(grid, width, height, hints) {
	for (var i = 0; i < height; i++) {
		if (hints[i].length == 0) continue;
		const numOfMustFills = hints[i].reduce((p, c) => p + c) + hints[i].length - 1
		const completelWithFullFills = hints[i] === width
		const completeWithPartialBlanks = numOfMustFills === width
		const partialFills = numOfMustFills < width

		if (completelWithFullFills) grid[i].fill(1)
		if (completeWithPartialBlanks) grid[i] = getBaseLine(hints[i])
		if (partialFills) grid[i] = simpleBoxes(width, hints[i], grid[i])
	}
	return grid
}

function simpleBoxes(width, hints, grid) {
	var bRange = []
	var bStart = []
	var bSize = hints.slice()
	var bMust = []
	var bMustStart = []

	for (let i = 0; i < bSize.length; i++) {
		if (i == 0) { bStart.push(1); continue }
		bStart.push(bStart[i - 1] + bSize[i - 1] + 1)
	}

	for (let i = 0; i < bSize.length; i++) {
		let restBSize = 0
		for (let j = 0; j < bSize.length; j++)
			if (j !== i) restBSize += bSize[j]
		bRange.push(width - bSize.length + 1 - restBSize)
		bMust.push(2 * bSize[i] - bRange[i])
		if (bMust[i] <= 0) { bMustStart.push(0); continue }
		bMustStart.push(bStart[i] + bRange[i] - bSize[i])
	}

	for (let i = 0; i < bMust.length; i++) {
		var count = 0
		for (let j = bMustStart[i] - 1; count < bMust[i]; j++) {
			grid[j] = 1
			count++
		}
	}
	return grid
}

function getCombinationsOf(arr, l) {
	if (l === void 0) l = arr.length;
	var data = Array(l),
		results = [];
	(function f(pos, start) {
		if (pos === l) {
			results.push(data.slice());
			return;
		}
		for (var i = start; i < arr.length; ++i) {
			data[pos] = arr[i];
			f(pos + 1, i);
		}
	})(0, 0);
	return results;
}

function getBaseLine(hintsArray) {
	var hints = hintsArray.slice()
	var leftCombination = []
	for (let i = 0; i < hints.length; i++) {
		let count = hints[i]
		while (count--) leftCombination.push(1)
		if (i != (hints.length - 1)) leftCombination.push(0)
	}
	return leftCombination
}

function transpose(arr) {
	return Object.keys(arr[0]).map(function (c) {
		return arr.map(function (r) { return r[c]; });
	});
}

function isNotFinished(grid) {
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] == -1) return true
		}
	}
	return false
}

function start() {
	startTime = new Date()
}

function end() {
	endTime = new Date()
	var timeDiff = endTime - startTime;
	timeDiff /= 1000
	var seconds = timeDiff
	console.log(seconds + " seconds")
}



exports.default = solve