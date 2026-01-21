const Message = require("../models/message");
exports.getAllMessages = async(req, res) => {
    try{
        const{name, email, message} = req.body;
    const product = await message.create({
        name, 
        email,
        message
    });
    res.json({message:"Message sent successfully!", Message});
}
catch(error){
    req.status(500).json({error:error.message});

}
};