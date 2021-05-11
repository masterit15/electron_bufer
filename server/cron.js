const scheduler = require('node-schedule');
const File = require('./model/file')
const fs = require('fs')

let rule = new scheduler.RecurrenceRule();
rule.hour = 01;
rule.minute = 00;
rule.second = 00;
rule.dayOfWeek = new scheduler.Range(0,6);

const dailyJob = scheduler.scheduleJob(rule, async()=>{
  const files = await File.findAll({raw:true})
  for(const file of files){
    fs.unlinkSync(file.path);
  }
  File.destroy({where: {},truncate: true})
  console.log('Запланированная очистка в 01:00 прошла успешно');
});