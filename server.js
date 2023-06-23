const express = require('express');
const path = require('path')
const port = 3000;
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./database.js')
const auth = require('./auth.js')
const multer = require('multer')

const app = express();

app.use(express.static('public'))
app.use(express.json())
app.use(express.static(path.join(__dirname, './public/scripts/login')))
app.use(express.static(path.join(__dirname, './public/scripts/image_upload')))
app.use(express.static(path.join(__dirname, './public/scripts/options')))
const upload = multer({dest : 'uploads/'})

app.use(session({
    secret: "3Hb5&k#A8q!vWzR1N7XeLyUoTf@JjIp6dZ*s%SOxYQ-gD0aVGt9nFhMl$cK2B4uEv+CwP=Ii?r~",
    resave: false,
    saveUninitialized: false
  }));

app.use(auth.authenticateUser)

const is_valid_pass_or_user = (arg) =>{
    const regex = /[^a-zA-Z0-9]/;

    return !regex.test(arg)
}

const encryptPassword = async(password) => {
    console.log("password to encrpt: ", password)
    return new Promise(async(resolve, reject) =>{
        try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
    
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("encrypted before return: ", hashedPassword)
        resolve(hashedPassword)
        } catch (error) {
        reject(error)
        }
  })
}

//recieves user = {username, password}, adds it to db if it doesnt exist
app.post('/new_account_attempt', (req, res) => {
    const user = req.body

    console.log("RECIEVED REQUEST FOR NEW ACCOUNT", user)
    if(!is_valid_pass_or_user(user.username)){
        res.send('invalidUsername')
        return
    }
    if(!is_valid_pass_or_user(user.password)){
        res.send('invalidPass')
        return
    }

    const usernameAvaliablePromise = db.check_user_avaliable(user.username)
    usernameAvaliablePromise.then(isAvalibale => {
        console.log(`is ${user.username} avaliable? `, isAvalibale)
        if(isAvalibale){
            const encryptPasswordPromise = encryptPassword(user.password)
            encryptPasswordPromise.then(hashedPassword => {
                const newUser = {username: user.username, password: hashedPassword}
                console.log('NEW USER TO BE INSERTED', newUser)
                db.add_new_account(newUser)
                res.send('DONE')
            })        
        }else{
            res.send('usernameNotAvaliable')
        }
    })
        

})

//recieves user = {username, password} and compares with username from db
//returns true if success, false if not success
app.post('/login_attempt', (req, res) =>{
    const user = req.body

    const passwordPromise = db.get_password(user.username)
    passwordPromise.then(pass => {
        if(pass === null || pass === undefined || user.password === null || user.password === undefined){
            res.send(false)
            return
        }
        bcrypt.compare(user.password, pass, (err, result) => {
            if(result && !err){
                req.session.user = user
                res.send(true)
              }else{
                 res.send(false)
              }		
        })
            
    })
    
})

app.get('/login', (req, res) => {
    const filePath = path.join(__dirname, './public/html/login.html')
    res.sendFile(filePath)
});

app.get('/register', (req,res) => {
    const filePath = path.join(__dirname, './public/html/register.html')
    res.sendFile(filePath)
})


//HOME PAGE
app.get('/home', (req, res) => {
    const filePath = path.join(__dirname, './public/html/home.html')
    res.sendFile(filePath)
});

app.post('/new_post', upload.single('image'), (req, res) => {
    try{
        const date = Date.now()
        const image_src = req.file.filename
        const description = req.body.description
        const likes = 0
        const username = req.session.user.username
        if(image_src === undefined || description === undefined || username === undefined)
            res.send()
        const post = {date: date, src: image_src, description: description, likes: likes, username: username}
        
        db.new_post(post)

    }catch(e){
        console.log('Something is undefind in request for new post')
    }

    res.send()
    
})

app.post('/load_image', (req, res) => {
    const imagePromise = db.get_image()
    imagePromise.then(img => {
        app.get('/' + img.src, (req, res) => {
            const imgPath = path.join(__dirname, './uploads/' + img.src)
            res.sendFile(imgPath)
        })
        res.send(img.src)
    })
})

app.post('/upload_image', upload.single('image'), (req, res) => {
    const img_src = req.file.filename
    db.upload_image({src : img_src})
    res.send("success")
})

app.post('/new_bio', (req, res) => { 
    try{
        const bio = req.body.bio
        const username = req.session.user.username
        
        db.update_bio(bio, username)
    }catch(e){
        console('Problem with inserting new bio. Maybe undefined?')
    }
    
    res.send()
})

app.post('/new_pfp', upload.single('image'), (req, res) => {
    try{
        const pfp_src = req.file.filename
        const username = req.session.user.username

        db.update_pfp(pfp_src, username)
    }catch(e){
        console.log("Soemthing is undefined when submitting new pfp")
    }   
    res.send()

})
//testing

app.get('/temp_pfp', (req,res) => {
    res.sendFile(path.join(__dirname, './uploads/pfp.jpg'))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
