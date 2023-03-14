import { Todo } from './Todo';
export class TodoList {
    private todos: Todo[];
    private lastParentTodoIndex: number;

    constructor(appDataPath: string) {
        // initialize with todos or empty array
        // this.todosPath = appDataPath + '/todo-app' + '/todos.json';
        // try {
        //     const fileData = fs.readFileSync(appDataPath + '/todo-app' + '/todos.json', 'utf8');
        // } catch (error: any) {
        //     if (error.code !== 'ENOENT') {
        //         throw error;
        //     }
        // }
        this.todos = [];
        this.lastParentTodoIndex = -1;
    }

    public getTodos() {
        return this.todos;
    }

    public getLastParentIndex() {
        return this.lastParentTodoIndex;
    }

    public addTodo(todoOptions: any) {
        const newTodo = new Todo(todoOptions);
        if (!newTodo.isSubtask) {
            this.lastParentTodoIndex = this.todos.length;
        } else {
            if (this.lastParentTodoIndex >= 0) {
                this.todos[this.lastParentTodoIndex].subtodoIndexes.push(this.todos.length);
                newTodo.parentIndex = this.lastParentTodoIndex;
            }
        }
        this.todos.push(newTodo);
    }

    public removeTodo(indexToRemove: number) {
        const targetTodo = this.todos[indexToRemove];
        let removeChildren = false;
        if (targetTodo.isSubtask) {
            // remove me from my parent's children
            if (targetTodo.parentIndex >= 0) this.todos[targetTodo.parentIndex].subtodoIndexes.pop();
        } else {
            // it is a parent todo, find new parent
            let newParentIndex = indexToRemove - 1;
            while (newParentIndex >= 0 && this.todos[newParentIndex].isSubtask) newParentIndex--;
            if (!targetTodo.isCompleted) {
                // update children's parents (if any)
                for (const subtaskIndex of targetTodo.subtodoIndexes) {
                    this.todos[subtaskIndex].parentIndex = newParentIndex;
                    this.todos[subtaskIndex].isCompleted = '';
                }
                if (newParentIndex >= 0) {
                    // found a parent, migrate children
                    const newParent = this.todos[newParentIndex];
                    targetTodo.subtodoIndexes = targetTodo.subtodoIndexes.map((index) => index - 1);
                    newParent.subtodoIndexes = [...newParent.subtodoIndexes, ...targetTodo.subtodoIndexes];
                }
            } else {
                removeChildren = true;
            }

            if (indexToRemove === this.lastParentTodoIndex) {
                this.lastParentTodoIndex = newParentIndex;
            }
        }
        this.todos.splice(indexToRemove, 1);
        const decrementStartingIndex = indexToRemove + targetTodo.subtodoIndexes.length;
        this.decrementTodoIndexes(decrementStartingIndex);
        if (!targetTodo.isSubtask && indexToRemove > this.lastParentTodoIndex) {
            // since we are removing someone
            this.lastParentTodoIndex--;
        }
        if (removeChildren) {
            let subtodoCount = targetTodo.subtodoIndexes.length;
            const removeTimes = subtodoCount;
            for (let i = 0; i < removeTimes; i++) {
                this.todos.splice(indexToRemove, 1);
                const decrementStartingIndex = indexToRemove + subtodoCount - 1;
                this.decrementTodoIndexes(decrementStartingIndex);
                if (!targetTodo.isSubtask && indexToRemove > this.lastParentTodoIndex) {
                    // since we are removing someone
                    this.lastParentTodoIndex--;
                }
                subtodoCount--;
            }
        }
    }

    public decrementTodoIndexes(startingIndex: number) {
        if (startingIndex >= this.todos.length) {
            this.lastParentTodoIndex--;
            return;
        }
        this.todos[startingIndex].subtodoIndexes = this.todos[startingIndex].subtodoIndexes.map((index) => index - 1);
        if (this.todos[startingIndex].parentIndex !== -1) this.todos[startingIndex].parentIndex--;
        this.decrementTodoIndexes(startingIndex + 1);
    }

    public toggleSubtask(indexToToggle: number) {
        const targetTodo = this.todos[indexToToggle];

        if (targetTodo.isSubtask) {
            // it is a sub todo going to a parent todo
            targetTodo.isSubtask = '';
            // if i have a parent: adopt my parent's children who are after me
            if (targetTodo.parentIndex !== -1) {
                targetTodo.subtodoIndexes = this.todos[targetTodo.parentIndex].subtodoIndexes.filter(
                    (index) => index > indexToToggle,
                );
                // remove adopted children from old parent
                this.todos[targetTodo.parentIndex].subtodoIndexes = this.todos[
                    targetTodo.parentIndex
                ].subtodoIndexes.filter((index) => index < indexToToggle);
            } else {
                // go look for children to adopt
                let subtodoIndex = indexToToggle + 1;
                while (subtodoIndex < this.todos.length && this.todos[subtodoIndex].isSubtask) {
                    targetTodo.subtodoIndexes.push(subtodoIndex);
                    this.todos[subtodoIndex].parentIndex = indexToToggle;
                    subtodoIndex++;
                }
            }
            for (const subtaskIndex of targetTodo.subtodoIndexes) {
                this.todos[subtaskIndex].parentIndex = indexToToggle;
            }

            if (indexToToggle > this.lastParentTodoIndex) {
                this.lastParentTodoIndex = indexToToggle;
            }
            targetTodo.parentIndex = -1;
        } else if (!targetTodo.isCompleted) {
            // it is a parent todo going to a sub todo
            targetTodo.isSubtask = 'subtask';
            let newParentIndex = indexToToggle - 1;
            while (newParentIndex >= 0 && this.todos[newParentIndex].isSubtask) newParentIndex--;
            let newParent;
            if (newParentIndex >= 0) {
                newParent = this.todos[newParentIndex];
                newParent.subtodoIndexes.push(indexToToggle);
            }
            for (const subtaskIndex of targetTodo.subtodoIndexes) {
                if (newParent) newParent.subtodoIndexes.push(subtaskIndex);
                this.todos[subtaskIndex].parentIndex = newParentIndex;
                this.todos[subtaskIndex].isCompleted = '';
            }
            targetTodo.subtodoIndexes = [];
            targetTodo.parentIndex = newParentIndex;
            if (indexToToggle === this.lastParentTodoIndex) {
                this.lastParentTodoIndex = newParentIndex;
            }
        }
    }

    public toggleCompletion(indexToToggle: number) {
        const targetTodo = this.todos[indexToToggle];
        if (targetTodo.isCompleted) {
            targetTodo.isCompleted = '';
            if (targetTodo.isSubtask) {
                if (targetTodo.parentIndex >= 0) {
                    this.todos[targetTodo.parentIndex].completedCount--;
                    if (
                        this.todos[targetTodo.parentIndex].completedCount !==
                        this.todos[targetTodo.parentIndex].subtodoIndexes.length
                    ) {
                        this.todos[targetTodo.parentIndex].isCompleted = '';
                    }
                }
            } else {
                targetTodo.completedCount = 0;
                for (const subtodoIndex of targetTodo.subtodoIndexes) {
                    this.todos[subtodoIndex].isCompleted = '';
                }
            }
        } else {
            // TODO: if parent vs child
            targetTodo.isCompleted = 'checked';
            if (targetTodo.isSubtask) {
                if (targetTodo.parentIndex >= 0) {
                    this.todos[targetTodo.parentIndex].completedCount++;
                    if (
                        this.todos[targetTodo.parentIndex].completedCount ===
                        this.todos[targetTodo.parentIndex].subtodoIndexes.length
                    ) {
                        this.todos[targetTodo.parentIndex].isCompleted = 'checked';
                    }
                }
            } else {
                targetTodo.completedCount = targetTodo.subtodoIndexes.length;
                for (const subtodoIndex of targetTodo.subtodoIndexes) {
                    this.todos[subtodoIndex].isCompleted = 'checked';
                }
            }
        }
    }
}
