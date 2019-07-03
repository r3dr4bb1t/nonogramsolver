// solve.js

function solve(width, height, columnHints, rowHints) {
	let grid = Array(height).fill().map(() => Array(width).fill(-1))
	preProcess(grid, width, height, rowHints)
	grid = transpose(preProcess(transpose(grid), height, width, columnHints))

	let gridSum = 0
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			gridSum += grid[i][j]
		}
	}
	const isNonHeuristic = gridSum === width * height * -1
	if (isNonHeuristic) {
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				grid[i][j] = 0
			}
		}
		backTrack(0, grid, width, height, rowHints, columnHints)
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (grid[i][j] == -1)
					grid[i][j] = 0
			}
		}
		return [].concat(...grid)
	}
	let count = 0;
	while (isNotFinished(grid)) {
		processWholeGrid(grid, width, height, rowHints)
		grid = transpose(processWholeGrid(transpose(grid), height, width, columnHints))
		count++
		if (count > 50)
			break;
	}
	if (count > 50) {
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				grid[i][j] = 0
			}
		}
		backTrack(0, grid, width, height, rowHints, columnHints)
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (grid[i][j] == -1)
					grid[i][j] = 0
			}
		}
		return [].concat(...grid)
	}
	const answer = [].concat(...grid)
	return answer
}

function processWholeGrid(grid, width, height, rowHints) {
	for (let i = 0; i < height; i++) {
		if (isLineFinished(grid[i], rowHints[i])) continue
		const numOfBlanks = width - rowHints[i].reduce((p, c) => p + c) - rowHints[i].length + 1
		processOneLine(grid[i], numOfBlanks, rowHints[i])
	}
	return grid
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
		if (lineSum != 0 && lineSum != list.length) {
		}
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

function backTrack(ri, grid, width, height, rowHints, columnHints) {
	for (let ci = 0; ci < height; ci++) {
		if (check_col(ci, grid, columnHints) == false) return false;
	}
	if (ri == width || ri > width)
		return true;
	let hintSum = 0
	for (let j = 0; j < rowHints[ri].length; j++) {
		hintSum += rowHints[ri][j]
	}
	let gap = []
	for (let j = 0; j < rowHints[ri].length; j++)
		gap.push(1)
	gap[0] = 0
	do {
		let pos = gap[0]
		for (let ci = 0; ci < gap[0]; ci++)
			grid[ri][ci] = -1
		for (let rhi = 0; rhi < rowHints[ri].length; rhi++) {
			for (let ci = 0; ci < rowHints[ri][rhi]; ci++) {
				grid[ri][pos + ci] = 1
			}
			pos += rowHints[ri][rhi]
			if (rhi == rowHints[ri].length - 1) continue

			for (let ci = 0; ci < gap[rhi + 1]; ci++) {
				grid[ri][pos + ci] = -1
			}
			pos += gap[rhi + 1]
		}
		for (let ci = pos; ci < height; ci++) grid[ri][ci] = -1

		if (backTrack(ri + 1, grid, width, height, rowHints, columnHints) == true)
			return true

		for (let ci = 0; ci < height; ci++) grid[ri][ci] = 0;
		let gi = gap.length - 1
		gap[gi]++
		while (hintSum + gap.reduce((p, c) => p + c) > height && gi > 0) {
			gap[gi - 1]++;
			gap[gi] = 1;
			gi--
		}
	} while (hintSum + gap.reduce((p, c) => p + c) <= height)

	return false
}

function check_col(ci, grid, columnHints) {
	let run = 0
	let chi = 0;
	for (let ri = 0; ri < grid[1].length; ri++) {
		if (grid[ri][ci] == 1) {
			run++;
			if (chi >= columnHints[ci].length || run > columnHints[ci][chi])
				return false;
		}
		else if (grid[ri][ci] == 0) return true;
		else if (grid[ri][ci] == -1 && run > 0) {
			if (run != columnHints[ci][chi])
				return false;
			run = 0;
			chi++;
		}
	}
	if (run > 0) {
		if (run != columnHints[ci][chi])
			return false;
		chi++;
	}
	if (chi != columnHints[ci].length)
		return false;

	return true;
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

function isLineFinished(line, hints) {
	if (hints.length == 0) return true;
	let hintSum = 0
	let lineSum = 0
	for (let j = 0; j < hints.length; j++) {
		hintSum += hints[j]
	}
	for (j = 0; j < line.length; j++) {
		if (line[j] == 1) lineSum++
	}
	if (lineSum == hintSum) {
		for (j = 0; j < line.length; j++) {
			if (line[j] == -1) {
				line[j] = 0
			}
		}
		return true
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