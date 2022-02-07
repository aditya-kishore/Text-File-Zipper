// import {BinaryHeap} from './heap.js';

// export { HuffmanCoder }

class HuffmanCoder {
	stringify(node){
        if(typeof(node[1])==="string")
        	return '\'' + node[1];
        return '0' + this.stringify(node[1][0]) + '1' + this.stringify(node[1][1]);
	}

	display(node,modify,index=1) {
        if(modify){
        	node = ['',node];
        	if(node[1].length===1)
        		node[1]=node[1][0];
        }
        if(typeof(node[1])==="string")
        	return String(index) + "=" + node[1];
        let left = this.display(node[1][0],modify,index*2);
        let right = this.display(node[1][1],modify,index*2+1);
        let res = String(index*2) + " <= "+ index + " => " + String(index*2+1);
        return res + '\n' + left + '\n' + right;
	}

	destringify(data) {
        let node = [];
        if(data[this.ind]==='\''){
        	this.ind++;
        	node.push(data[this.ind]);
        	this.ind++;
        	return node;
        }
        this.ind++;
        let left = this.destringify(data);
        node.push(left);
        this.ind++;
        let right = this.destringify(data);
        node.push(right);
        return node;
	}

	getMappings(node,path) {
        if(typeof(node[1])==="string"){
        	this.mappings[node[1]]=path;
        	return;
        }
        this.getMappings(node[1][0],path+"0");
        this.getMappings(node[1][1],path+"1");
	}

	encode(data) {
        this.heap = new BinaryHeap();
        const mp = new Map();
        for(let i=0;i<data.length;i++){
        	if(data[i] in mp)
        		mp[data[i]] = mp[data[i]]+1;
        	else
        		mp[data[i]] =1;
        }

        for(const key in mp)
        	this.heap.insert([-mp[key],key]);

        while(this.heap.size() > 1){
        	const n1 = this.heap.max();
        	const n2 = this.heap.max();
        	const n = [n1[0]+n2[0],[n1,n2]];
        	this.heap.insert(n);
        }
        const huffmanEncoder = this.heap.max();
        this.mappings = {};
        this.getMappings(huffmanEncoder,"");

        let binaryString = "";
        for(let i=0;i<data.length;i++)
        	binaryString = binaryString + this.mappings[data[i]];

        let rem = (8-binaryString.length%8)%8;
        let padding = "";
        for(let i=0;i<rem;i++)
        	padding = padding + "0";
        binaryString = binaryString + padding;

        let res = "";
        for(let i=0;i<binaryString.length;i+=8){
        	let num = 0;
        	for(let j=0;j<8;j++)
        		num = num*2 + (binaryString[i+j]-"0");
        	res = res + String.fromCharCode(num);
        }
        
        const x = this.stringify(huffmanEncoder);

        let finalRes = x + '\n' + rem + '\n' + res;
        console.log(x);
        let info = "Compression Ratio: " + data.length/finalRes.length;
        info = "Compression complete and file sent for download" + '\n' + info;
        return [finalRes, this.display(huffmanEncoder,false),info];
	}

	decode(data) {
        data = data.split('\n');
        if(data.length>3){
        	data[0] = data[0] + '\n' + data[1];
        	data[1] = data[2];
        	data[2] = data[3];
        	data.pop();
        }
        console.log(data.length);
        this.ind = 0;
        const huffmanDecoder = this.destringify(data[0]);
        const text = data[2];

        let binaryString = "";
        for(let i=0;i<text.length;i++){
        	let num = text[i].charCodeAt(0);
        	let bin = "";
        	for(let j=0;j<8;j++){
        		bin = num%2 + bin;
        		num = Math.floor(num/2);
        	}
        	binaryString = binaryString + bin;
        }
        binaryString = binaryString.substring(0,binaryString.length-data[1]);

        console.log(binaryString.length);

        let res = "";
        let node = huffmanDecoder;
        for(let i=0;i<binaryString.length;i++){
        	if(binaryString[i]==='0')
        		node = node[0];
        	else
        		node = node[1];

        	if(typeof(node[0])==="string"){
        		res+= node[0];
        		node = huffmanDecoder;
        	}
        }
        let info = "Decompression complete and file sent for download";
        return [res,this.display(huffmanDecoder,true),info];
	}
} 