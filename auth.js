
function authenticateUser(req, res, next){

    const excludedRoutes = ['/new_account_attempt', '/login_attempt', '/login', '/register']

    if(excludedRoutes.includes(req.path) && !(req.session.user === undefined)){
        res.redirect('/home')
        return
    }

    if(excludedRoutes.includes(req.path)){
      next()
    }else{
      if (req.session.user === undefined) {
      
          res.redirect('/login');
        } else {
          next()
        }
    }
}
  
module.exports = {
    authenticateUser
};
  
