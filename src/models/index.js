import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import configFile from '../config/config.js';
import { setupAssociations } from './Associations.js'; // Import setupAssociations

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = configFile.development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
  }
);

const db = {};
//importing the models all files except the index.js and associations 
//After loading all the file apply the assocations on that 
//Store all the models in the db ,so for getting the models through the keyword db exporting from the models folder.
const initModels = async () => {
  const files = fs.readdirSync(__dirname)
    .filter(file =>
      file !== 'index.js' &&
      file.toLowerCase() !== 'associations.js' &&
      file.endsWith('.js')
    );

  for (const file of files) {
    const modulePath = path.join(__dirname, file);
    const { default: modelFunc } = await import(`file://${modulePath}`);

    //for testing the models that all models are loaded in the db or not.
    // console.log('Loading model:', file, '=>', typeof modelFunc);

    const model = modelFunc(sequelize, DataTypes);
    db[model.name] = model;
  }
// Apply all associations on the model while loading models in db object.
  setupAssociations(db); 
  
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
};

await initModels();

export default db;
