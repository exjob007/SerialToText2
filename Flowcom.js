
const express = require('express')
const app = express()
const SerialPort = require('serialport')
var cmd = require('node-cmd')
var fs = require('fs')
var JFile = require('jfile')
var pathsave = '/home/FileSystem/'

var serialPort = new SerialPort('/dev/ttyUSB0', {
	baudRate: 9600,
	parser: new SerialPort.parsers.Readline("\n")

})

var checkTimeOut = 1

serialPort.on('open', ()=>{
	console.log('port open')

})

serialPort.on('data', (data)=>{

	console.log(data.toString())
	fs.appendFile('./output.txt', data.toString(), (err)=>{
	   if(err) throw err
	   //console.log(data.toString())

	})
	checkTimeOut = 0
	setTimeout(()=>{ exitloop() },10000)
})

function exitloop(){
	if(checkTimeOut == 0)
	{
		checkReport()
		console.log("exit")
		checkTimeOut = 1
	}
}


var checkReport = () =>{
	if(checkTimeOut == 0)
	{
	checkTimeOut = 1
        var txtFile = new JFile('./output.txt')
        var result = txtFile.grep('Printed at ')
        var tagName = txtFile.grep('Tag No.:')
        
        /*if(result == '' && tagName == '')
        {
            console.log('AlarmReport')
        }
        else{
            console.log('DailyReport')
        }*/
        const returnStatus = (result == '' && tagName == '') ? console.log('Alarmreport') : DailyReport(tagName,result)
	}

}

var DailyReport = (Name,date) => {
    var name = Name[0].split("Tag No.: ")
	name = name[1].trim()
	name = name + '.txt'
	var redate = date[0].split('Printed at : ')[1].split(" ")[0]
	redate = date.split("/")
	redate = redate[2] + "/" + redate[1] + "/" + redate[0] + "/"
	console.log(redate + " name : " + name)
	
}

