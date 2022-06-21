//import jsonwebtoken

const jwt=require('jsonwebtoken')
db={
    1000:{"acno": 1000, "username":"aswin", "password":1000, "balance":5000, transaction:[]},
    1001:{"acno": 1001, "username":"bijin", "password":1001, "balance":5000,transaction:[]},
    1002:{"acno": 1002, "username":"ajeesh", "password":1002, "balance":5000,transaction:[]},
    1003:{"acno": 1003, "username":"sreekand", "password":1003, "balance":5000,transaction:[]},

  }

  //register

  var register=(acno,username,password)=>{
    if(acno in db){
      return{
        status:false,
        message:"Already registered ..please login",
        statusCode:401
      }
    }
    else{
      //insert in db
      db[acno]={
        acno, 
        username,
        password,
       "balance":0,
       transaction:[]}
    }
    return{
        status: true,
        message:"Registered successfully",
        statusCode:200
    }
  }

  //login

  const login=(acno,pswd)=>{
    
    if(acno in db){
      if(pswd==db[acno]["password"]){
        currentUser=db[acno]["username"]
        currentAcno=acno
        //token generation
        token=jwt.sign({
          //store account number inside token
          currentAcno:acno
        },'supersecretkey12345')
        return{
            status: true,
            message:"Login successfully",
            statusCode:200,
            currentUser,
            currentAcno,
            token

        }
      }else{
        return{
            status:false,
            message:"Invalid password",
            statusCode:401
          }
        
      }
    }else{
      return{
        status:false,
        message:"user does not exist",
        statusCode:401
      }
    }
  }

  //deposit

  const deposit=(acno,password,amt)=>{
    var amount=parseInt(amt)

    if(acno in db){
      if(password ==db[acno]["password"]){
        db[acno].transaction.push({
          type:"CREDIT",
          amount:amount
        })
        db[acno]["balance"]+=amount
        return{
          status: true,
          message:amt+"deposited successfully your current balance is"+db[acno]["balance"],
          statusCode:200
      }
      }
      else{
        return{
          status:false,
          message:"Invalid password",
          statusCode:401
        }
      }

    }
    else{
      return{
        status:false,
        message:"user does not exist",
        statusCode:401
      }
    }

  }


  //withdraw

  var withdraw=(acno,password,amt)=>{
    var amount=parseInt(amt)

    if(acno in db){
      if(password ==db[acno]["password"]){

        if(db[acno]["balance"]>amount){
          db[acno].transaction.push({
            type:"DEBIT",
            amount:amount
          })
          db[acno]["balance"]-=amount

          return{
            status: true,
            message:amt+"debited successfully.. your current balance is"+db[acno]["balance"],
            statusCode:200
        }

        }
        else{
          
          return{
            status:false,
            message:"insufficent balance",
            statusCode:422
          }
        }
        
      }
      else{
        return{
          status:false,
          message:"Invalid password",
          statusCode:401
        }
      }

    }
    else{
      return{
        status:false,
        message:"user does not exist",
        statusCode:401  
      }

  }
}

//transaction

const getTransaction=(acno)=>{
  if(acno in db){
    return{
      status:true,
      statusCode:200,
      transaction:db[acno].transaction
    }
  }else{
    return{
      status:false,
      message:"user does not exist",
      statusCode:401,
    }
  }

}
  //export
  module.exports={
    register,login,deposit,withdraw,getTransaction
  }
