/**
 * Task class
 */
class Task {
  private options: any = {}

  /**
   * Instantiate the task and assing a random id
   */
  public constructor() {
    this.options.id = this._genTaskId();
    this.options.dueDate = new Date().getTime();
  }

  /**
   * Gets random value
   * @return {number}
   */
  private _getRandomValue(): number {
    return Math.floor(Math.random() * 256);
  }
  /**
   * Generates an Any.do id task
   * @return {string}
   */
  private _genTaskId(): string {
    let id = '';
    for (let n = 0; n < 16; n++) {
      id += String.fromCharCode(this._getRandomValue());
    }

    return Buffer.from(id)
        .toString('base64')
        .replace(/\//g, '_')
        .replace(/\+/g, '-')
        .slice(-24);
  }
  /**
   * Add options
   * @param {object} options
   * @return {Task}
   */
  public setOptions(options: any): Task {
    this.options = {...this.options, options};
    return this;
  }

  /**
   * Set the task title
   * @param {string} title Task title
   * @return {Task}
   */
  public setTitle(title: string): Task {
    this.options.title = title;
    return this;
  }

  /**
   * Set dueDate of the task
   * @param {Date} dueDate Date
   * @return {Task}
   */
  public setDueDate(dueDate: Date): Task {
    this.options.dueDate = dueDate.getTime();
    return this;
  }

  /**
   * Set the category id
   * @param {string} categoryId
   * @return {Task}
   */
  public setCategoryId(categoryId: string): Task {
    this.options.categoryId = categoryId;
    return this;
  }

  /**
   * Gets task
   * @return {object} task
   */
  public getTask(): any {
    return this.options;
  }
}

module.exports = Task;
export default Task;
