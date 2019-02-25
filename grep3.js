const express = require('express')
const app = express()
const SerialPort = require('serialport')
var cmd = require('node-cmd')
var fs = require('fs')
var JFile = require('jfile')
const data =  require('./Serial.config.json')
//console.log(data.Quantity)

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
	let txtFile = new JFile('./output.txt')
	let result = txtFile.grep('Printed at ')
    let tagName = txtFile.grep('Tag No.:')
	let Current = txtFile.grep('Current Billing Report')
	let Month = txtFile.grep('Monthly Billing Report')
	
	//console.log(tagName[0] + ' ' + result[0])
	//Generate(result,tagName,Current[0])
	const Report = (result[0] == null || tagName[0] == null) ? None() : Generate(result,tagName,Current[0],Month[0])

	}
}

var Generate = (result,tagName,Current,Month) =>{ 
    var text = false
    if(result == null && tagName == null)
    {
        console.log('null')
        text = true
	}
	
    else{ text = false }

    if(text == false)
    {
        var name = tagName[0].split("Tag No.: ")
        var TimeCurrent = result[0].split('Printed at : ')
        TimeCurrent = TimeCurrent[1].split(' ')
        name = name[1].trim()
        var date = result[0].split('Printed at : ')[1].split(" ")[0]
        var redate = date.split("/")
		redate = redate[2] + "/" + redate[1] + "/" + redate[0] + "/"
		if(Month == null)
		{
			const Report = (Current != null) ? CurrentReport(redate,name,TimeCurrent[1]) : savePath(redate,name)
		}
		else{
			const Report = (Current != null) ? CurrentMonthly(redate,name,TimeCurrent[1]) : MonthlyReport(redate,name)
		}
        
    }
    else{
        None()
    }
}

var MonthlyReport = (date,name) => {
	let path = '/home/FileSystem/' + date + name + '/'
	fs.readFile('/home/pi/SCRIPT/Serial/output.txt', (err,data)=>{
		if (err) throw err
		var data = data.toString()
		var Monthly = data.split('END OF REPORT')[1]
		var Normal = data.split('END OF REPORT')[0]

		cmd.get('mkdir -p ' + path, (err,data,stdeer)=>{
			if (err) {console.log(err)}

		})
		//console.log(Monthly)	
		var createFile = fs.createWriteStream(path+ 'MonthlyReport.txt')
		createFile.write(Monthly)
		createFile.end()
		var createFile = fs.createWriteStream(path+ 'DailyReport.txt')
		createFile.write(Normal)
		createFile.end()
		showText('MonthlyReport.txt && DailyReport.txt',path)

		
		
	})
	/*
	cmd.get('mkdir -p /home/FileSystem/' + date + name + '/',(err,data,stdeer) =>{
		if(err) {console.log(err)}
		
	})*/
	checkTimeOut = 1
}


var CurrentMonthly = (date,name,time) =>{
	let path = '/home/FileSystem/' + date + name + '/'
	let renameM = 'Current_Monthly' + time + '.txt'
	let renameD = 'Current_Daily' + time + '.txt'
	fs.readFile('/home/pi/SCRIPT/Serial/output.txt', (err,data)=>{
		if (err) throw err
		var data = data.toString()
		var Monthly = data.split('END OF REPORT')[1]
		var Normal = data.split('END OF REPORT')[0]

		cmd.get('mkdir -p ' + path, (err,data,stdeer)=>{
			if (err) {console.log(err)}

		})
		//console.log(Monthly)	
		var createFile = fs.createWriteStream(path + renameM)
		createFile.write(Monthly)
		createFile.end()
		var createFile = fs.createWriteStream(path + renameD)
		createFile.write(Normal)
		createFile.end()
		showText(renameM + '&&' + renameD, path)

	})
	/*
	cmd.get('mkdir -p /home/FileSystem/' + date + name + '/',(err,data,stdeer) =>{
		if(err) {console.log(err)}
		
	})*/
	checkTimeOut = 1

}

var savePath = (date,name) =>{
	let path = '/home/FileSystem/' + date
	cmd.get('mkdir -p /home/FileSystem/' + date + name + '/' + ' && cp ./output.txt '+path+name + '/' + 'DailyReport.txt' +'; rm ./output.txt; tree /home/FileSystem/',(err,data,stdeer) =>{
		console.log(data)
	})
	showText(name,path)
	checkTimeOut = 1
}

var CurrentReport = (date,name,time) =>{	
    let path = '/home/FileSystem/' + date
	let rename = 'Current_' + time + '.txt'
	rename = rename.replace(/(\r\n|\n|\r)/gm, "")
	console.log(rename)
    cmd.get('mkdir -p /home/FileSystem/' + date + name + '/' + ' && cp ./output.txt '+ path + name + '/' + rename + ';' , (err,data,stdeer) => {
        console.log(data)
    })
    showText(rename,path)
	checkTimeOut = 1
}

var None = () =>{
	console.log('Error[+]')
	cmd.get('rm ./output.txt', (err,data,stdeer) => {
		console.log(err)
	})
	showText('None','None')
	checkTimeOut = 1
}


var showText = (name,path) =>{
	console.log('Successfully::)')
	console.log('filename: ' + name)
	console.log('PATH: ' + path)
	setTimeout(()=>{
		cmd.get('rm ./output.txt; tree /home/FileSystem/', (err,data,stdeer)=>{
			if(err) {console.log(err)}
			else{
				console.log(data)
			}
		})
		console.log('Delete File output.txt')
		Timewait()
		
	},3000)
	checkTimeout = 1
	
}

var Timewait = () =>{
	console.log('wait..')
	setTimeout(()=>{
		console.log('Ready!!!!')
	},5000)
	
}

//redate()






