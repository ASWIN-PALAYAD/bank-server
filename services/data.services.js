//import jsonwebtoken

const jwt = require('jsonwebtoken')

//import db.js
const db = require('./db')

// db={
//     1000:{"acno": 1000, "username":"aswin", "password":1000, "balance":5000, transaction:[]},
//     1001:{"acno": 1001, "username":"bijin", "password":1001, "balance":5000,transaction:[]},
//     1002:{"acno": 1002, "username":"ajeesh", "password":1002, "balance":5000,transaction:[]},
//     1003:{"acno": 1003, "username":"sreekand", "password":1003, "balance":5000,transaction:[]},

//   }

//register

const register = (acno, username, password) => {
  //asynchronus
  return db.User.findOne({
    acno
  }).then(user => {
    console.log(user);
    if (user) {
      return {
        status: false,
        message: "Already registered ..please login",
        statusCode: 401
      }
    }
    else {
      //insert in db
      const newUser = new db.User({
        acno,
        username,
        password,
        "balance": 0,
        transaction: []

      })
      newUser.save()
      return {
        status: true,
        message: "Registered successfully",
        statusCode: 200
      }
    }
  })

}

//login -async

const login = (acno, pswd) => {
  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      console.log(user);
      currentUser = user.username
      currentAcno = acno
      //token generation
      token = jwt.sign({
        //store account number inside token
        currentAcno: acno
      }, 'supersecretkey12345')
      return {
        status: true,
        message: "Login successfully",
        statusCode: 200,
        currentUser,
        currentAcno,
        token
      }
    }
    else {
      return {
        status: false,
        message: "Invalid credential",
        statusCode: 401 
      }
    }
  })

}


//deposit aync

const deposit = (acno, password, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno,password
  }).then(user=>{
    if(user){
      user.balance+= amount
      user.transaction.push({
        type: "CREDIT",
        amount: amount
      })
      user.save()
      return {
        status: true,
        message: amt + "deposited successfully your current balance is" + user.balance,
        statusCode: 200
      }
    }else{
      return {
        status: false,
        message: "Invalid credential",
        statusCode: 401
      }
    }
  })
}


//withdraw

const withdraw = (acno, password, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({
    acno,password
  }).then(user=>{
    if(user){
      if (user.balance > amount) {
        user.transaction.push({
          type: "DEBIT",
          amount: amount
        })
        user.balance -= amount
        user.save()

        return {
          status: true,
          message: amt + "debited successfully.. your current balance is" + user.balance,
          statusCode: 200
        }

      }else {

        return {
          status: false,
          message: "insufficent balance",
          statusCode: 422
        }
      }

    }else{
      return {
        status: false,
        message: "Invalid credential",
        statusCode: 401
      }
  }
})
}



const getTransaction = (acno) => {
  return db.User.findOne({
    acno
  }).then(user=>{
    if(user){
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction
      }
    }else{
      return {
        status: false,
        message: "user does not exist",
        statusCode: 401,
      }
    }
  })
  

}
//export
module.exports = {
  register, login, deposit, withdraw, getTransaction
}
