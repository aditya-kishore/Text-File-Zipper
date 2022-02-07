// export {BinaryHeap}

class BinaryHeap {
	constructor() {
		this.heap = [];
	}

	insert(val) {
		this.heap.push(val);
		this.doit();
	}

	size() {
		return this.heap.length;
	}

	empty() {
		return (this.heap.length===0);
	}

	doit() {
		let ind = this.heap.length -1 ;
		while(ind > 0){
			let x = this.heap[ind], parInd = Math.floor((ind-1)/2), par = this.heap[parInd];
			if(par[0] >= x[0])
				break;
			this.heap[ind] = par;
			this.heap[parInd] = x;
			ind = parInd;
		}
	}

	max() {
		const mx = this.heap[0];
		const tmp = this.heap.pop();
		if(!this.empty()){
			this.heap[0] = tmp;
			this.down(0);
		}
		return mx;
	}

	down(ind) {
		let left = 2*ind +1, right = 2*ind+2, mx = ind;
		const len = this.size();
		if(left < len && this.heap[left][0] > this.heap[mx][0])
			mx = left;
		if(right < len && this.heap[right][0] > this.heap[mx][0])
			mx = right;
		if(mx !== ind) {
			let tmp = this.heap[mx];
			this.heap[mx] = this.heap[ind];
			this.heap[ind] = tmp;
			this.down(mx);
		}
	}
}