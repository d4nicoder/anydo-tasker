"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    constructor() {
        this.options = {};
        this.ABC = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        this.options.id = this._genTaskId();
        this.options.dueDate = new Date().getTime();
    }
    _getRandomValue() {
        return Math.floor(Math.random() * this.ABC.length);
    }
    _genTaskId() {
        let id = '';
        for (let n = 0; n < 16; n++) {
            id += this.ABC.charAt(this._getRandomValue());
        }
        return Buffer.from(id)
            .toString('base64')
            .replace(/\//g, '_')
            .replace(/\+/g, '-');
    }
    setOptions(options) {
        this.options = Object.assign(Object.assign({}, this.options), { options });
        return this;
    }
    setTitle(title) {
        this.options.title = title;
        return this;
    }
    setDueDate(dueDate) {
        this.options.dueDate = dueDate.getTime();
        return this;
    }
    setCategoryId(categoryId) {
        this.options.categoryId = categoryId;
        return this;
    }
    getTask() {
        return this.options;
    }
}
module.exports = Task;
exports.default = Task;
//# sourceMappingURL=Task.js.map