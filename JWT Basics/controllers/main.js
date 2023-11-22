
const jwt = require('jsonwebtoken')
const {BadRequest} = require('../errors')
const CustomAPIError = require('../errors/custom-error')
const login = async (req, res) => {
    const {username,password} = req.body
    //Mongoose Validation
    //JOI
    //Check in teh Controller


    if(!username || !password){
      throw new BadRequest('Please provide email and password')
    }


    //Just for Demo, normally provided by DB
    const id= new Date().getDate()
    

    //try to keep payload small, for better experience to user
    //In production give jwtsecret a long string so it can't be gussed
    const token = jwt.sign({id,username},process.env.JWT_SECRET,{expiresIn:'30d'})

    res.status(200).json({msg:'user created',token});
  
} 

const dashboard = async (req, res) => {
 // console.log(req.user)
  const luckyNumber = Math.floor(Math.random() * 100)

  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  })
}

  
  
  module.exports = { login, dashboard}