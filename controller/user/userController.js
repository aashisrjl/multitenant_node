const { users, sequelize } = require("../../model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../../model/index")
const { QueryTypes } = require("sequelize")


exports.registerUser = async(req,res)=>{

    const {email,username,password} = req.body


    // INSERT INTO Table(users)
   await users.create({
     email,
     password : bcrypt.hashSync(password,8) ,
     username
    })
    res.send("User created successfully")


}


// LOGIN Starts from here
exports.loginUser = async (req,res)=>{
   
    const {email,password}= req.body
    // SERVER SIDE VALIDATION 
    if(!email || !password){
        return res.send("Email and password are required")
    }

   const associatedDataWithEmail =  await users.findAll({
       where : {
        email
       }
    })
    if(associatedDataWithEmail.length == 0){
         res.send("User with that email doesn't exists")
    }else{
          // check if password also matches
    const associatedEmailPassword = associatedDataWithEmail[0].password
       const isMatched =  bcrypt.compareSync(password,associatedEmailPassword) // true or false return
       if(isMatched){
        // GENERATE TOKEN HERE 

        const token = jwt.sign({id:associatedDataWithEmail[0].id},"haha",{
            expiresIn : '30d'
        })
        res.cookie('token',token) // browser ma application tab vitra cookie vanney ma save hunchha

   await sequelize.query(`CREATE TABLE IF NOT EXISTS userHistory_${associatedDataWithEmail[0].id}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        organizationNumber INT NULL
    )`,{
        type: QueryTypes.CREATE
    })

      res.status(200).json({
        message: "Logged in"
    })
       }else{
      res.send("Invalid password or email")
       }

    }
    // exist xaina vaney - > [],xa vaney [{name:"",password:"",email:"",id:""}]

}
exports.deleteUser = async (req,res)=>{
    const userId = req.userId;
    await sequelize.query(`DELETE FROM users WHERE id=?`,{
        type: QueryTypes.DELETE,
        replacements:[userId]
    })
    const org = await sequelize.query(`SELECT organizationNumber FROM userhistory_${userId}`,{
        type: QueryTypes.SELECT
    })
    // const num = await sequelize.query(`SELECT organizationNumber from `)
   
    for(var i=0;i<org.length;i++){
    await sequelize.query(`DROP TABLE organization_${org[i].organizationNumber}`,{
        types: QueryTypes.DROP
    })
    await sequelize.query(`DROP TABLE userhistory_${userId}`,{
        types: QueryTypes.DROP
    })
    await sequelize.query(`DROP TABLE payment_${org[i].organizationNumber}`,{
        types: QueryTypes.DROP
    })

    }
    res.status(200).json({
        message: "deleted successfully"
    })
}

