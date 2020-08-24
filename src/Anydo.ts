/* eslint-disable max-len */
import https from 'https';
// eslint-disable-next-line no-unused-vars
import Task from './Task';
/**
 * Class for manage API requests
 */
class Anydo {
  private username: string
  private password: string
  private authToken: string = ''
  private API_HOST: string = 'sm-prod2.any.do'
  private syncedData: any = null
  private stage: any

  /**
   * Class constructor
   * @param {string} username  Username or e-mail
   * @param {string} password  Password
   */
  public constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.stage = this._getSyncData();
  }

  /**
   * Perform a post request
   * @param {string} path URI path
   * @param {object} data Data to send
   * @param {string} method HTTP method
   * @return {Promise<any>}
   */
  private _post(path: string, data: any, method?: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      method = method || 'POST';
      try {
        await this._doLogin();
      } catch (e) {
        reject(e);
      }

      let postData: string;
      try {
        postData = JSON.stringify(data);
      } catch (e) {
        return reject(e);
      }

      let responseData: string = '';

      const req = https.request({
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
          } else {
            resolve(responseData);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Perform login action
   * @return {Promise}
   */
  private _doLogin(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.authToken) {
        return resolve();
      }
      let postData: string;
      try {
        postData = JSON.stringify({
          email: this.username,
          password: this.password,
        });
      } catch (e) {
        return reject(e);
      }

      let response: string = '';

      const req = https.request({
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

  /**
   * Return base sync object
   * @param {boolean} includeDone Include done tasks
   * @param {boolean} includeDeleted include deleted tasks
   * @return {any}
   */
  private _getSyncData(includeDone?: boolean, includeDeleted?: boolean): any {
    includeDone = typeof includeDone === 'boolean' ? includeDone : false;
    // eslint-disable-next-line max-len
    includeDeleted = typeof includeDeleted === 'boolean' ? includeDeleted : false;

    return {
      category: {
        items: [],
      },
      task: {
        items: [],
        config: {includeDone, includeDeleted},
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

  /**
   * Sync data and get all items
   * @param {object} options Options to sync
   * @return {object[]}
   */
  public async sync(options?: any): Promise<any> {
    options = options || {};
    const defaultOptions = {
      includeDone: false,
      includeDeleted: false,
      updateSince: 0,
      models: this._getSyncData(),
    };

    if (options.models) {
      defaultOptions.models = {...defaultOptions.models, ...options.models};
    }

    options = defaultOptions;

    let syncData: any;
    try {
      syncData = await this._post(
          `/api/v2/me/sync?updatedSince=${options.updateSince}`,
          {models: options.models},
          'POST',
      );
    } catch (e) {
      console.error(e);
      throw e;
    }

    syncData = JSON.parse(syncData);
    return syncData;
  }

  /** Get user categories
   * @return {object[]}
   */
  public async getCategories(): Promise<any> {
    let data: any;
    try {
      data = await this.sync();
      return data.models.category.items;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Add task to the user tasks
   * @param {Task} task Task class
   * @return {Promise<any>}
   */
  public addTask(task: Task): Anydo {
    // First retrive user data

    const taskData = task.getTask();
    this.stage.task.items.push(taskData);

    return this;
  }

  /**
   * Adds tasks
   * @param {Task[]} tasks
   * @return {Promise<any>} syncedData
   */
  public addTasks(tasks: Task[]): Anydo {
    for (let i = 0; i < tasks.length; i++) {
      try {
        this.addTask(tasks[i]);
      } catch (e) {
        console.error(e);
        continue;
      }
    }

    return this;
  }

  /**
   * Commits anydo
   * @return {Promise<any>} commit
   */
  public async commit(): Promise<any> {
    return this.sync({models: this.stage, updateSince: Date.now()});
  }

  /**
   * Delete task
   *
   * @param {string} taskId task id
   * @return {Promise}
   */
  public async deleteTask(taskId: string): Promise<any> {
    if (!taskId) {
      throw new Error('Task id is undefined');
    }

    try {
      await this._post(`/me/tasks/${taskId}`, {}, 'DELETE');
    } catch (e) {
      throw e;
    }
  }

  public static Task = Task
}

module.exports = Anydo;
export default Anydo;
