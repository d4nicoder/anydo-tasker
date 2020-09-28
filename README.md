[![CodeFactor](https://www.codefactor.io/repository/github/danitetus/anydo-tasker/badge)](https://www.codefactor.io/repository/github/danitetus/anydo-tasker)

# Anydo tasker

## Unofficial api library for Any.do

## Disclaimer

```
Please note that this library is not official. Any.do does not provide information to developers to make use of its services from third-party applications.
This can cause this code to stop working at any time or cause it to behave erroneously causing synchronization failures, loss of tasks, or any other problem.
Use this code at your own risk. I am not responsible for the damages that this may cause.
```

## Install

```bash
npm install anydo-tasker
```

## Methods

* Api
  * .addTask(task) => <code>Api</code>
  * .addTasks([tasks]) => <code>Api</code>
  * .deleteTask(id) => <code>Promise</code>
  * .sync(options?) => <code>Promise</code>
  * .commit() => <code>Promise</code>

* Task
  * .setTitle(title) => <code>Task</code>
  * .setDueDate(Date) => <code>Task</code>
  * .setCategotyId(id) => <code>Task</code>
  * .setOptions(options) => <code>Task</code>
  * .getTask() => <code>JSON</code>

### api.addTask(task) => <code>Api</code>

Append task to the stage object
| Param | Type |
| --- | --- |
| task | <code>Task object</code> |

### api.addTasks(tasks) => <code>Api</code>

Append multiple tasks to the stage object
| Param | Type |
| --- | --- |
| tasks | <code>Array of Task objects</code> |

### api.deleteTask(id) => <code>Promise</code>

Delete a task
| Param | Type |
| --- | --- |
| id | <code>string</code> |

### api.sync(options) => <code>Promise</code>

Get user data
| Param | Type |
| --- | --- |
| options | <code>object (optional)</code> |

### api.commit() => <code>Promise</code>

Commit changes

### task.setTitle(title) => <code>Task</code>

Set the task title
| Param | Type |
| --- | --- |
| title | <code>string</code> |

### task.setCategoryId(categoryId) => <code>Task</code>

Place the task in some category
| Param | Type |
| --- | --- |
| categoryId | <code>string</code> |

### task.setDueDate(date) => <code>Task</code>

Set the task due date
| Param | Type |
| --- | --- |
| date | <code>Date</code> |

### task.getTask() => <code>JSON</code>

Returns the task object in JSON format
| Param | Type |
| --- | --- |
|  |  |

## Examples

### 1 - Create a task to default category

```typescript
import Anydo from 'anydo-tasker'

// Creating the task
const myTask = new Anydo.Task()
myTask.setTitle('My awesome task')

// Creating the connection with the API
const anydo = new Anydo('email', 'password')
anydo.addTask(myTask)

// Commit changes
anydo.commit()
  .then((data) => {
    // Returns all user data in a JSON
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

### 2 - Create a task in some category

```typescript
import Anydo from 'anydo-tasker'

// Creating the task
const myTask = new Anydo.Task()
myTask.setTitle('My awesome task')
myTask.setCategoryId('categoryId')

// Creating the connection with the API
const anydo = new Anydo('email', 'password')
anydo.addTask(myTask)

// Commit changes
anydo.commit()
  .then((data) => {
    // Returns all user data in a JSON
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

### 3 - Create a task specifying due date

```typescript
import Anydo from 'anydo-tasker'

// Creating the task
const myTask = new Anydo.Task()
myTask.setTitle('My awesome task')
myTask.setCategoryId('categoryId')
myTask.setDueDate(new Date())

// Creating the connection with the API
const anydo = new Anydo('email', 'password')
anydo.addTask(myTask)

// Commit changes
anydo.commit()
  .then((data) => {
    // Returns all user data in a JSON
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

### 4 - Create a task specifying other options

```typescript
import Anydo from 'anydo-tasker'

// Creating the task
const myTask = new Anydo.Task()
myTask.setTitle('My awesome task')
myTask.setCategoryId('categoryId')
myTask.setDueDate(new Date())
myTask.setOptions(myOptionsObject)

// Creating the connection with the API
const anydo = new Anydo('email', 'password')
anydo.addTask(myTask)

// Commit changes
anydo.commit()
  .then((data) => {
    // Returns all user data in a JSON
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

## Known issues

* For some unknown reason, when in the title of a task we use special characters such as: á, é, í, ó, ú, ñ ... The server responds with a 500 error. To solve this, we must clean the string to eliminate the troublesome characters.
