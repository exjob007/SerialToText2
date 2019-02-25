var fs = require('fs')
var JFile = require('jfile')
let txtFile = new JFile('../000012.txt')
let Month = txtFile.grep('Monthly Billing Report')

if(Month === null){
    console.log('null' + Month)

}
else{
    console.log(Month)
    fs.readFile('./000012.txt', (err,data) =>{
        if(err) {
            return console.log(err)
        }
        let Read = data.toString()
        console.log(Read.split('END OF REPORT')[1])

    })
    
}
