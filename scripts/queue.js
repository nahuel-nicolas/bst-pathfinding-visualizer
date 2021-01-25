export class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    setTail(currentNode) {
        if (this.tail !== null) {
            this.tail.next = currentNode;
        } else {
            this.head = currentNode;
        }
        this.tail = currentNode;
    }

    enqueue(value) {
        const currentNode = new Node(value);
        this.setTail(currentNode);
        this.length++;
    }

    dequeue() {
        const nodeToDequeue = this.head;
        const nextNodeInHead = this.head.next; 
        if (nextNodeInHead === null) {
            this.tail = null;
        }
        this.head = nextNodeInHead;
        this.length--;

        return nodeToDequeue.value;
    }
}

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
