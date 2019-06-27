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

	var rows = new long[height][];
	var spaces = height - rows[r].length - 1
	for (var r = 0; r < R; r++) {
		var res = new LinkedList()
	}
	ddd
	return answer
}
exports.default = solve