export class Todo {
    private isSubtask: boolean;
    private completed: boolean;
    private description: string;

    constructor(description: string) {
        this.isSubtask = false;
        this.completed = false;
        this.description = description;
    }
}