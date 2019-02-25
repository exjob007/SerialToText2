const Json_data = require('./Serial.config.json')
const SerialPort = require('serialport')
var cmd = require('node-cmd')

var fs = require('fs')
var JFile = require('jfile')

var checkTimeOut = 1

Json_data.map((data) => {
    datareturn(data)
    
})

function datareturn(COM){
    COM.Serial = new SerialPort(COM.COM, {
        baudRate: COM.baudRate,
        parser: new SerialPort.parsers.Readline("\n")
    })
    COM.Serial.on('open', ()=>{
        console.log('PORT OPEN : ')
    })
    if(checkTimeOut == 1)
    {
        COM.Serial.on('data', (data)=>{
            //console.log(data.toString() + " >> "+ COM.COM)
            console.log(COM.COM + " <<  " + COM.Filename)
            fs.appendFile('./'+COM.Filename, data.toString(), (err) =>{
                if(err){console.log(err)}

            })
            checkTimeOut = 0
            setTimeout(()=>{
                exitloop()
            },20000)

        })
    }
}

var exitloop = () =>{
    if(checkTimeOut == 0){
        
        let file = require('./Serial.config.json')
        let data = file.map((item)=>{
            cmd.get('find '+ item.Filename, (err,data,stdeer)=>{
                redate(data.trim())
            })
        })
    }
}  // 3 2 1
var redate = (name) =>{

    try {
        let txtFile = new JFile('./' + name)
        let result = txtFile.grep('Printed at ')
        let tagName = txtFile.grep('Tag No.:')
        let Current = txtFile.grep('Current Billing Report')
        let Month = txtFile.grep('Monthly Billing Report')
        //console.log(name + " ")
        const Report = (result[0] == null || tagName[0] == null) ? None(name) : Generate(result,tagName,Current[0],Month[0],name)
    } catch (error) {
    }
    //console.log(name)
}

var Generate = (result,tagName,Current,Month, _name) =>{ 
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
        if(Month == null){
            console.log('no monthly')
            None(_name)
        }
        else{
            console.log('has')
            None(_name)
        }
        
        /*
		if(Month == null)
		{
            const Report = (Current != null) ? CurrentReport(redate,name,TimeCurrent[1],_name) : savePath(redate,name,_name)
            //console.log("funcion savepath = redate : " + redate + " name : " + _name )
		}
		else{

            const Report = (Current != null) ? CurrentMonthly(redate,name,TimeCurrent[1],_name) : MonthlyReport(redate,name,_name)
            //const Report = (Current != null) ? CurrentMonthly(redate,name,TimeCurrent[1],_name) : MonthlyReport(redate,name,_name)
            //console.log("funcion savepath = redate : " + redate + " name : " + name )
        }*/
        
        
    }
    else{
        None(_name)
    }
}


var MonthlyReport = () =>{
    console.log('MonthlyReport')
}

var CurrentMonthly = () => {
    console.log('CurrentMonthly')
}

var savePath = (date,name, _name) =>{
    let path = '/home/FileSystem/' + date
	cmd.get('mkdir -p /home/FileSystem/' + date + name + '/' + ' && cp ./'+_name + ' '+path+name + '/' + 'DailyReport.txt',(err,data,stdeer) =>{
		//console.log(data)
	})
	showText(name,path,_name)
	
}

var CurrentReport = (date,name,time, _name) =>{	
    let path = '/home/FileSystem/' + date
	let rename = 'Current_' + time + '.txt'
	rename = rename.replace(/(\r\n|\n|\r)/gm, "")
	console.log(rename)
    cmd.get('mkdir -p /home/FileSystem/' + date + name + '/' + ' && cp ./'+_name +' '+ path + name + '/' + rename + ';' , (err,data,stdeer) => {
        console.log(data)
    })
    showText(rename,path,_name)
	checkTimeOut = 1
}

var showText = (name,path,_name) =>{
	console.log('Successfully::)')
	console.log('filename: ' + name)
	console.log('PATH: ' + path)
	setTimeout(()=>{
		cmd.get('rm ./'+ _name + ';tree /home/FileSystem/', (err,data,stdeer)=>{
			if(err) {console.log(err)}
			else{
				console.log(data)
			}
		})
		console.log('Delete File '+ _name)
		Timewait()
		
	},3000)
	checkTimeout = 1
	
}

var None = (_name) =>{
	console.log('Error[+]')
	showText('None','None',_name)
	checkTimeOut = 1
}


var Timewait = () =>{
	console.log('wait..')
	setTimeout(()=>{
		console.log('Ready !!')
	},5000)
	
}