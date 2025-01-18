
const User = require("../model/user");

module.exports.RenderSignUp = (req,res)=>{
    res.render(`listings/signUp.ejs`);
};


module.exports.signUp = async(req,res)=>{
try{
    let { username , email, password} = req.body;
const newUser = new User({email,username});

const registerUser =await User.register(newUser,password);
  console.log(registerUser);
  req.login(registerUser,(err)=>{
    if(err){
        return next(er)
    }
    req.flash("success" ,"welcome to the Wonderlust");
    res.redirect("/listings");
  });
}catch(err){
    req.flash("error", err.message);
    res.redirect("/signUp"); 
}
};


module.exports.renderloginForm = (req,res)=>{
    res.render(`listings/login.ejs`)
};

module.exports.login = async(req,res)=>{
    req.flash("success","welcome to the wonderlust you are login");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect( redirectUrl );
    };


 
module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");

    });
};