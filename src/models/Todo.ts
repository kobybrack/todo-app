import { v4 as uuid } from 'uuid';
export class Todo {
    public isSubtask: boolean;
    public description: string;
    public id: string;

    constructor(description: string) {
        this.isSubtask = false;
        this.description = description;
        this.id = uuid();
    }
}
