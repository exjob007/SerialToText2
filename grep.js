
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

	//console.log(data.toString())
	console.log('[+]--> RS232Recive [-----]')
	fs.appendFile('./output.txt', data.toString(), (err)=>{
	   if(err) throw err
	   //console.log(data.toString())
	})
	checkTimeOut = 0
	setTimeout(()=>{ exitloop() },20000)
})

function exitloop(){
	if(checkTimeOut == 0)
	{
		redate()
		console.log("exit")
		checkTimeOut = 1
	}
}


var redate = () =>{
	if(checkTimeOut == 0)
	{
	checkTimeOut = 1
	var Current;
	var txtFile = new JFile('./output.txt')
	var result = txtFile.grep('Printed at ')
	var tagName = txtFile.grep('Tag No.:')
	var name = tagName[0].split("Tag No.: ")
	name = name[1].trim()
	name = name + '.txt'
	var date = result[0].split('Printed at : ')[1].split(" ")[0]
	var redate = date.split("/")
	redate = redate[2] + "/" + redate[1] + "/" + redate[0] + "/"
	//console.log(redate + " name : " + name)
	//var Report = (Current != '') ? CurrentReport(redate,name,time) : savePath(redate,name)
	}

}



var savePath = (date,name) =>{
	
	
	/*cmd.get('cp ./output.txt /home/FileSystem/test.txt; rm ./output.txt',(err,data,stdeer) =>{
		console.log(data)
	})*/
	var path = '/home/FileSystem/' + date
	cmd.get('mkdir -p /home/FileSystem/' + date + ' && cp ./output.txt '+path+name + '; rm ./output.txt',(err,data,stdeer) =>{
		console.log(err)
	})
	console.log('Successfully::)')
	console.log('filename: ' + name)
	console.log('PATH: ' + path)

}


//redate()






