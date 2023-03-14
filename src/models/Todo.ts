import { v4 as uuid } from 'uuid';
export class Todo {
    public isSubtask: string;
    public isCompleted: string;
    public description: string;
    public parentIndex: number;
    public subtodoIndexes: number[];
    public completedCount: number;

    constructor(options: any) {
        this.isSubtask = options.isSubtask;
        this.description = options.todoDescription;
        this.parentIndex = options.parentIndex;
        this.subtodoIndexes = [];
        this.isCompleted = '';
        this.completedCount = 0;
    }
}
