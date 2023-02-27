import { v4 as uuid } from 'uuid';
export class Todo {
    public isSubtask: string;
    public isCompleted: string;
    public description: string;
    public id: string;
    public parentId: string;
    public subtaskIds: string[];

    constructor(options: any) {
        this.isSubtask = options.isSubtask;
        this.description = options.todoDescription;
        this.parentId = options.parent;
        this.subtaskIds = [];
        this.isCompleted = '';
        this.id = uuid();
    }
}
