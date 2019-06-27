// solve.js

// User defined class node 
class Node {
	// constructor 
	constructor(element) {
		this.element = element;
		this.next = null
	}
}

class LinkedList {
	constructor() {
		this.head = null;
		this.size = 0;
	}

	add(element) {
		// creates a new node 
		var node = new Node(element);

		// to store current node 
		var current;

		// if list is Empty add the 
		// element and make it head 
		if (this.head == null)
			this.head = node;
		else {
			current = this.head;

			// iterate to the end of the 
			// list 
			while (current.next) {
				current = current.next;
			}

			// add node 
			current.next = node;
		}
		this.size++;
	}
	// removes an element from the 
	// specified location 
	removeFrom(index) {
		if (index > 0 && index > this.size)
			return -1;
		else {
			var curr, prev, it = 0;
			curr = this.head;
			prev = curr;

			// deleting first element 
			if (index === 0) {
				this.head = curr.next;
			} else {
				// iterate over the list to the 
				// position to removce an element 
				while (it < index) {
					it++;
					prev = curr;
					curr = curr.next;
				}

				// remove the element 
				prev.next = curr.next;
			}
			this.size--;

			// return the remove element 
			return curr.element;
		}
	}
	isEmpty() {
		return this.size == 0;
	}
	size_of_list() {
		console.log(this.size);
	}
}


function solve(width, height, columnHints, rowHints) {
	const answer = []
	var rows;
	var cols
	var grid

	var rowPerms
	var spaces = height - rows[r].length - 1
	for (var r = 0; r < R; r++) {
		var res = new LinkedList()
		var spaces = height - rows[r].length - 1
		for (var i = 0; i < row[r].length; i++) spaces -= rows[r][i]
		calcPerms(r, 0, spaces, 0, 0, res)
		rowPerms[r] = new Long[res.size()]
		while (!res.isEmpty()) {
			rowPerms[r][res.size() - 1] = res.removeFrom(res.size_of_list() - 1)
		}
	}
	return answer
}

function calcPerms(r, cur, spaces, perm, shift, res) {
	if (cur == rows[r].length) {
		if ((grid[r] & perm == grid[r])) res.add(perm)
		return
	}
	while (spaces >= 0) {
		calcPerms(r, cur + 1, spaces, perm | (bits(rows[r][cur]) << shift), shift + rows[r][cur] + 1, res)
		shift++
		spaces--
	}
}

function bits(b) {
	return 1 << b - 1
}

function updateCols(row) {
	var ixc = 1
	for (var c = 0; c < c; c++ , ixc <<= 1) {
		colVal[row][c] = row == 0 ? 0 : colVal[row - 1][c]
		colIx[row][c] = row == 0 ? 0 : colIx[row - 1][c]
		if ((grid[row] & ixc) == 0) {
			if (row > 0 && colVal[row - 1][c] > 0) {
				colVal[row][c] = 0
				colIx[row][c]++
			}
		} else {
			colVal[row][c]++
		}
	}
}

var mask;
var val;


exports.default = solve98706