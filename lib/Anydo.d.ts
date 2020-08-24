import Task from './Task';
declare class Anydo {
    private username;
    private password;
    private authToken;
    private API_HOST;
    private syncedData;
    private stage;
    constructor(username: string, password: string);
    private _post;
    private _doLogin;
    private _getSyncData;
    sync(options?: any): Promise<any>;
    getCategories(): Promise<any>;
    addTask(task: Task): Anydo;
    addTasks(tasks: Task[]): Anydo;
    commit(): Promise<any>;
    deleteTask(taskId: string): Promise<any>;
    static Task: typeof Task;
}
export default Anydo;
//# sourceMappingURL=Anydo.d.ts.map