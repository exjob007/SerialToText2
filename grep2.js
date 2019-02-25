
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
if(checkTimeOut == 1)
{
	console.log('Ready :)')
	serialPort.on('data', (data)=>{

		//console.log(data.toString())
		console.log('[+]--> RS232Recive [-----]')
		fs.appendFile('./output.txt', data.toString(), (err)=>{
		if(err) throw err
		//console.log(data.toString())
		})
		checkTimeOut = 0
		setTimeout(()=>{ exitloop() },20000)
	})
}

function exitloop(){
	if(checkTimeOut == 0)
	{
		console.log("exit")
		redate()
		//console.log("exit")
		
	}
}


var redate = () =>{
	if(checkTimeOut == 0)
	{
	//checkTimeOut = 1
	var txtFile = new JFile('./output.txt')
	var result = txtFile.grep('Printed at ')
    var tagName = txtFile.grep('Tag No.:')
	var Current = txtFile.grep('Current')
	var name = tagName[0].split("Tag No.: ")
	var TimeCurrent = result[0].split('Printed at : ')
	TimeCurrent = TimeCurrent[1].split(' ')
	name = name[1].trim()
	var date = result[0].split('Printed at : ')[1].split(" ")[0]
	var redate = date.split("/")
	redate = redate[2] + "/" + redate[1] + "/" + redate[0] + "/"
	const Report = (Current != '') ? CurrentReport(redate,name,TimeCurrent[1]) : savePath(redate,name)
	
	}

}


var savePath = (date,name) =>{
	
	var path = '/home/FileSystem/' + date
	cmd.get('mkdir -p /home/FileSystem/' + date + name + '/' + ' && cp ./output.txt '+path+name + '/' + 'DailyReport.txt' +'; rm ./output.txt; tree /home/FileSystem/',(err,data,stdeer) =>{
		console.log(data)
	})

	console.log('Successfully::)')
	console.log('filename: ' + name)
	console.log('PATH: ' + path)
	checkTimeOut = 1

}

var CurrentReport = (date,name,time) =>{
	//someText = someText.replace(/(\r\n|\n|\r)/gm, "");
    var path = '/home/FileSystem/' + date
	var rename = 'Current_' + time + '.txt'
	rename = rename.replace(/(\r\n|\n|\r)/gm, "")
	console.log(rename)
    //cmd.get('mkdir -p /home/FileSystem/' + date + ' && cp ./output.txt ' + path + )
    cmd.get('mkdir -p /home/FileSystem/' + date + name + '/' + ' && cp ./output.txt '+ path + name + '/' + rename + '; rm ./output.txt; tree /home/FileSystem/' , (err,data,stdeer) => {
        console.log(data)
    })
    console.log('Successfully::)')
	console.log('filename: ' + rename)
	console.log('PATH: ' + path)
	checkTimeOut = 1



}

var None = () =>{
	console.log('Error[+]')
	checkTimeOut = 1

}


//redate()






