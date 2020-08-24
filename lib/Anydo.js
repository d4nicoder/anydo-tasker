"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const Task_1 = __importDefault(require("./Task"));
class Anydo {
    constructor(username, password) {
        this.authToken = '';
        this.API_HOST = 'sm-prod2.any.do';
        this.syncedData = null;
        this.username = username;
        this.password = password;
        this.stage = this._getSyncData();
    }
    _post(path, data, method) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            method = method || 'POST';
            try {
                yield this._doLogin();
            }
            catch (e) {
                reject(e);
            }
            let postData;
            try {
                postData = JSON.stringify(data);
            }
            catch (e) {
                return reject(e);
            }
            let responseData = '';
            const req = https_1.default.request({
                host: this.API_HOST,
                port: 443,
                path,
                method,
                headers: {
                    'X-Anydo-Auth': this.authToken,
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length,
                },
            }, (res) => {
                res.on('data', (chunk) => {
                    responseData += chunk.toString();
                });
                res.on('end', () => {
                    if (res.statusCode !== 200) {
                        console.error(`Respuesta con código: ${res.statusCode}`);
                        console.error(responseData);
                        reject(new Error(responseData));
                    }
                    else {
                        resolve(responseData);
                    }
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.write(postData);
            req.end();
        }));
    }
    _doLogin() {
        return new Promise((resolve, reject) => {
            if (this.authToken) {
                return resolve();
            }
            let postData;
            try {
                postData = JSON.stringify({
                    email: this.username,
                    password: this.password,
                });
            }
            catch (e) {
                return reject(e);
            }
            let response = '';
            const req = https_1.default.request({
                host: this.API_HOST,
                port: 443,
                path: '/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length,
                },
            }, (res) => {
                res.on('data', (data) => {
                    response += data.toString();
                });
                res.on('end', () => {
                    const jsonResponse = JSON.parse(response);
                    this.authToken = jsonResponse.auth_token;
                    resolve();
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.write(postData);
            req.end();
        });
    }
    _getSyncData(includeDone, includeDeleted) {
        includeDone = typeof includeDone === 'boolean' ? includeDone : false;
        includeDeleted = typeof includeDeleted === 'boolean' ? includeDeleted : false;
        return {
            category: {
                items: [],
            },
            task: {
                items: [],
                config: { includeDone, includeDeleted },
            },
            attachment: {
                items: [],
            },
            sharedMember: {
                items: [],
            },
            userNotification: {
                items: [],
            },
            taskNotification: {
                items: [],
            },
        };
    }
    sync(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = options || {};
            const defaultOptions = {
                includeDone: false,
                includeDeleted: false,
                updateSince: 0,
                models: this._getSyncData(),
            };
            if (options.models) {
                defaultOptions.models = Object.assign(Object.assign({}, defaultOptions.models), options.models);
            }
            options = defaultOptions;
            let syncData;
            try {
                syncData = yield this._post(`/api/v2/me/sync?updatedSince=${options.updateSince}`, { models: options.models }, 'POST');
            }
            catch (e) {
                console.error(e);
                throw e;
            }
            syncData = JSON.parse(syncData);
            return syncData;
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            try {
                data = yield this.sync();
                return data.models.category.items;
            }
            catch (e) {
                throw e;
            }
        });
    }
    addTask(task) {
        const taskData = task.getTask();
        this.stage.task.items.push(taskData);
        return this;
    }
    addTasks(tasks) {
        for (let i = 0; i < tasks.length; i++) {
            try {
                this.addTask(tasks[i]);
            }
            catch (e) {
                console.error(e);
                continue;
            }
        }
        return this;
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sync({ models: this.stage, updateSince: Date.now() });
        });
    }
    deleteTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!taskId) {
                throw new Error('Task id is undefined');
            }
            try {
                yield this._post(`/me/tasks/${taskId}`, {}, 'DELETE');
            }
            catch (e) {
                throw e;
            }
        });
    }
}
Anydo.Task = Task_1.default;
module.exports = Anydo;
exports.default = Anydo;
//# sourceMappingURL=Anydo.js.map