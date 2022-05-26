const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("data/db.json");
// const Memory = require("lowdb/adapters/Memory");
// const adapter = new Memory();
const db =  low(adapter);

module.exports = db;
