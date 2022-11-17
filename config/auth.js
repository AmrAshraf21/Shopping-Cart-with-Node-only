exports.isUser = (req,res,next)=>{

    if(req.isAuthenticated()){
        return next();
    }
    req.flash('danger',"Please login");
    return res.redirect('/users/login');

}
exports.isAdmin = (req,res,next)=>{

    if(req.isAuthenticated() && res.locals.user.admin ==1){
        return next();
    }
    req.flash('danger',"Please login as admin");
    return res.redirect('/users/login');

}