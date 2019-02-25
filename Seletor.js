const Json_data = require('./Serial.config.json')
const SerialPort = require('serialport')
var fs = require('fs')
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
    COM.Serial.on('data', (data)=>{
        //console.log(data)
        Json_data.map((items) =>{
            fs.appendFile('./'+items.TagNo+'.txt', data.toString(), (err)=>{
                if(err){console.log(err)}

            })

            
            checkTimeOut = 0
            setTimeout(()=>{
                exitloop()
            },20000)
        })

    }) 


}

function exitloop(){
    if(checkTimeOut == 0)
    {
        console.log("exit")
        redate()
        checkTimeOut = 1
        
    }

}

function redate(){
    Json_data.map((item)=>{
        let txtFile = new JFile('/' + item.Serial + '.txt')
        if(txtFile){
            let result = txtFile.grep('Printed at ')
            let tagName = txtFile.grep('Tag No.:')
            let Current = txtFile.grep('Current Billing Report')
            let Month = txtFile.grep('Monthly Billing Report')
            console.log('has data')
        }else{
            console.log('none data')
        }

    })
}

