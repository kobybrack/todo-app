import { v4 as uuid } from 'uuid';
export class Todo {
    public subtodo: string;
    public isCompleted: string;
    public description: string;
    public parentIndex: number;
    public subtodoIndexes: number[];
    public completedCount: number;
    public isSubtodo() {
        return this.subtodo === 'subtask';
    }

    constructor(options: any) {
        this.subtodo = options.isSubtask;
        this.description = options.todoDescription;
        this.parentIndex = options.parentIndex;
        this.subtodoIndexes = [];
        this.isCompleted = '';
        this.completedCount = 0;
    }
}
