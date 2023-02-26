import { v4 as uuid } from 'uuid';
export class Todo {
    public isSubtask: string;
    public isCompleted: string;
    public description: string;
    public id: string;

    constructor(options: any) {
        this.isSubtask = options.isSubtask;
        this.description = options.todoDescription;
        this.isCompleted = '';
        this.id = uuid();
    }
}
