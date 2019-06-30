// solve.js
console.log(solve(13, 5, [[1], [1], [5], [], [1, 1], [], [1, 1, 1], [1, 1, 1], [5], [], [3, 1], [1, 1, 1], [1, 3]], [[3, 3, 3], [1, 1, 1, 1], [1, 3, 3], [1, 1, 1, 1], [1, 3, 3]]))

function solve(width, height, columnHints, rowHints) {
	let grid = Array(height).fill().map(() => Array(width).fill(-1))
	preProcess(grid, width, height, rowHints)
	grid = transpose(preProcess(transpose(grid), height, width, columnHints))
	while (isNotFinished(grid)) {
		for (let i = 0; i < height; i++) {
			let rowSum, lineSum
			for (let j = 0; j < rowHints.length; j++) rowSum += rowHints[i][j]
			for (j = 0; j < width; j++) lineSum = grid[i][j]
			if (lineSum == rowSum) continue
			const numOfBlanks = width - rowHints[i].reduce((p, c) => p + c) - rowHints[i].length + 1
			processOneLine(grid[i], numOfBlanks, rowHints[i])
			process.exit(0)
			//	let mostModified = findMostModified(grid)
			// console.log(mostModified)
			// console.log(grid)
			// process.exit(0)

			j
		}
	}
	const answer = [] // 여기에 작성
	return answer
}

function processOneLine(line, numOfBlanks, hintsArray) {
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
	let candidates = baseline.slice()
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

	console.log(line)
	const realCandidates = pruneLists(possibleLists, line)
	markConjunction(realCandidates, line)
	console.log(line)
	process.exit(0)
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
	const transposedList = transpose(realCandidates)
	let lineNo = 0
	for (const list of transposedList) {
		const lineSum = list.reduce((p, c) => p + c)
		if (lineSum == 0) line[lineNo] = 0
		if (lineSum == list.length) line[lineNo] = 1
		lineNo++
	}
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

function findMostModified(grid) {
	let rowMax = [0];
	for (let i = 0; i < grid.length; i++) {
		let count = 0
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] !== -1)
				count += 1
		}
		if (rowMax[0] < count) {
			rowMax[0] = count
			rowMax[1] = i
		}
	}

	let columnMax = [0]
	grid = transpose(grid)
	for (let i = 0; i < grid.length; i++) {
		let count = 0
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] !== -1)
				count += 1
		}
		if (columnMax[0] < count) {
			columnMax[0] = count
			columnMax[1] = i
		}
	}

	let max = rowMax[0] >= columnMax[0] ? rowMax : columnMax
	if (max[0] == rowMax[0])
		grid = transpose(grid)

	return max[1]
}

exports.default = solve