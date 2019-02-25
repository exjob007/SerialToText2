const express = require('express')
const app = express()
const SerialPort = require('serialport')
const fs = require('fs')

var serialPort = new SerialPort('/dev/ttyUSB0',{
	baudRate: 9600,
	parser: new SerialPort.parsers.Readline("\n")

})
var clearData = ""
var readData = ""

serialPort.on('open', function(){
	console.log('open')
	serialPort.on('data', function(data){
		//console.log(data)
		//readData += data.toString()
		console.log(data.toString())
		fs.appendFile('./output.txt',data.toString(), function (err) {
		 if(err) throw err
		console.log(data.toString())

               })
        })

})
