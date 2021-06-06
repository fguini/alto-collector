const { v4: uuid } = require('uuid');
const nodeMachineId = require('node-machine-id');

exports.seed = function seed(db) {
  return db('device')
    .first()
    .then(deviceInfo => {
      if (!deviceInfo) {
        const id = uuid();
        const machineId = nodeMachineId.machineIdSync();
        return db.insert({ id, machineId }).into('device');
      }
    })
    .catch(error => console.error(`Error seeding data: ${error}`, error));
};
