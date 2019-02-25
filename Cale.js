var x = 43
//10 = 3 >> 3
//10 = 2 >> 13

chg(x , 0, 0)

function chg(num,ten,i){ 
    var ten = parseInt((num / 10)) - i
    if(ten == 0){
        console.log(ten)
        return 1
    }
    console.log(ten * 10)
    i=i+1
    chg(num,ten,i++)
    

}
