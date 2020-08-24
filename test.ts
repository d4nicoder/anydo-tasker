/* eslint-disable max-len */
import dotenv from 'dotenv';
import fs from 'fs';
import Anydo from './src/Anydo';
import Task from './src/Task';

dotenv.config();

const username: string = process.env.USERNAME || '';
const password: string = process.env.PASSWORD || '';
const categoryId: string = process.env.CATEGORY_ID || '';


const testAPI = async () => {
  const api = new Anydo(username, password);
  const task = new Task();
  task.setTitle('Testing API');
  task.setCategoryId(categoryId);

  api.addTask(task);

  let syncedData;
  try {
    syncedData = await api.commit();
  } catch (e) {
    throw e;
  }

  console.log(syncedData.models.task.items);
  try {
    fs.writeFileSync('after.json', JSON.stringify(syncedData, null, '\t'));
  } catch (e) {
    console.error(e);
  }
  console.log('End');
};

testAPI()
    .then(() => {
      console.log('Succes');
    })
    .catch((error) => {
      console.error(error);
    });

