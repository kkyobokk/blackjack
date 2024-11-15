class QNode {
    constructor(data){
        this.data = data;
        this.next = null;
    }
}

class Queue {
    constructor(){
        this.front = null;
        this.rear = null;
        this.length = 0;
    }

    enqueue(data){
        const node = new QNode(data);
        if(!this.front){
            this.front = node;
        }
        else {
            this.rear.next = node;
        }
        this.rear = node;
        this.length++;
    }

    dequeue(){
        if(!this.front){
            return null;
        }
        const ret = this.front.data;
        this.front = this.front.next;
        this.length--;
        return ret;
    }

    getFront(){return this.head && this.head.data;}

    getQueue(){
        let node = this.head;
        const array = [];
        while (node) {
          array.push(node.data);
          node = node.next;
        }
        return array;
    }
}

exports.Queue = Queue;