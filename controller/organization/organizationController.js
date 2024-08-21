const db = require("../../model/index")
const { QueryTypes } = require("sequelize")
const sequelize = db.sequelize

const generateRandomOrganizationNumber = () => {
    return Math.floor(10000000 + Math.random() * 90000000);
  };
  

exports.createOrganization = async (req,res)=>{
    const userId = req.userId
    const {name,address,vatNo} = req.body
    let OrganizationNumber = generateRandomOrganizationNumber();
    if(!name || !address ||!vatNo){
        res.send("Please send name,address,vatNo")
    }

    //CREATE BLOG TABLE IF NOT EXISTS
   await sequelize.query(`CREATE TABLE IF NOT EXISTS organization_${OrganizationNumber}(
        id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        name VARCHAR(255),
        address VARCHAR(255),
        vatNo VARCHAR(255)
    )`,{
        type : QueryTypes.CREATE
    })

    await sequelize.query(`INSERT INTO userHistory_${userId}(organizationNumber) VALUES(?)`,{
        type : QueryTypes.INSERT,
        replacements : [OrganizationNumber]
    })

    await sequelize.query(`CREATE TABLE IF NOT EXISTS payment_${OrganizationNumber}(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        amount REAL ,
        partyName VARCHAR(255)
    )`,{
        type : QueryTypes.CREATE
    })


    const userData = await db.users.findAll({where:{id : userId}})
    userData[0].currentOrganization = OrganizationNumber
    await userData[0].save()


    await sequelize.query(`INSERT INTO organization_${OrganizationNumber}(name,address,vatNo,userId) VALUES(?,?,?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [name,address,vatNo,userId]
    })
    res.json({
        message : "organization created Successfully",
        organizationNumber : OrganizationNumber
    })
}
exports.createPayment = async(req,res)=>{
    const {amount,partyName} = req.body

    const OrganizationNumber = req.organizationNumber
    console.log("amount",amount)
    console.log("org",OrganizationNumber )

    await sequelize.query(`INSERT INTO payment_${OrganizationNumber} (amount,partyName) VALUES(?,?)`,{
        type: QueryTypes.INSERT,
        replacements : [amount,partyName]
    })
    res.json({
        message: "payment inserted successfully"
    })

}
exports.getCurrentOrgDetail = async(req,res)=>{
    const currentOrganization = req.organizationNumber
    const data = await sequelize.query(`SELECT * FROM organization_${currentOrganization}
         JOIN users ON organization_${currentOrganization}.userId = users.id`,{
            types: QueryTypes.SELECT
    })
    if(!data){
        return res.status(400).json({
            message:"no organization found"
        })
    }
    res.status(200).json({
        message : "organization details fetched successfully",
        data : data
    })
}


