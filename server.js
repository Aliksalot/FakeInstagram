
const express = require('express');
const path = require('path')
const port = 3000;
const ip = `192.168.1.9`
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
app.use(express.static(path.join(__dirname, './public/scripts/posts')))
app.use(express.static(path.join(__dirname, './public/scripts/home_page')))
app.use(express.static(path.join(__dirname, './public/css')))

const upload = multer({dest : 'uploads/'})

app.use(session({
    secret: [...Array(32)].map(() => Math.random().toString(36)[2]).join(''),
    resave: false,
    saveUninitialized: false
}));



app.use(auth.authenticateUser)

const is_valid_pass_or_user = (arg) =>{
    return is_sanitized(arg) && arg.length < 20 && arg.length > 4
}

const is_sanitized = (arg) => {

    const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

    return !regex.test(arg) && arg != undefined && arg != '' 
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

app.post('/logout', (req, res) => {
    req.session.user = undefined
    res.send()
})

app.get('/login', (req, res) => {
    const filePath = path.join(__dirname, './public/html/login.html')
    res.sendFile(filePath)
});

app.get('/register', (req,res) => {
    const filePath = path.join(__dirname, './public/html/register.html')
    res.sendFile(filePath)
})


//MY PROFILE PAGE
app.get('/header.css', (req, res) => {
    const filePath = path.join(__dirname, './public/css/header.css');
    res.sendFile(filePath)
})


app.get('/my_profile', (req, res) => {
    const filePath = path.join(__dirname, './public/html/my_profile.html')
    res.sendFile(filePath)
});

app.post('/new_post', upload.single('image'), (req, res) => {
    try{
        const date = Date.now()
        const image = req.file
        const description = req.body.description
        const likes = []
        const username = req.session.user.username
        if(!(is_sanitized(image.filename) && is_sanitized(description) && is_sanitized(username))){
            res.send()
            return
        }
        const post = {date: date, src: image.filename, description: description, likes: likes, username: username}
        console.log(`Uploading new post for user ${username}`)
        db.new_post(post)

    }catch(e){
        console.log('Something is undefind in request for new post')
        res.send()
    }

    res.send()
    
})

app.post('/new_bio', (req, res) => { 
    try{
        const bio = req.body.bio
        const username = req.session.user.username
        if(!is_sanitized(bio) || !is_sanitized(username)){
            res.send()
            return
        }
            
        db.update_bio(bio, username)
    }catch(e){
        console('Problem with inserting new bio. Maybe undefined?')
    }
    
    res.send()
})

app.get('/no_picture', (req, res) => {
    const filePath = path.join(__dirname, './public/no_pic.jpg')
    res.sendFile(filePath)
})

app.get('/close_button', (req, res) => {
    const filePath = path.join(__dirname, './public/close_button.png')
    res.sendFile(filePath)
})

app.post('/new_pfp', upload.single('image'), (req, res) => {
    try{
        const pfp = req.file
        const username = req.session.user.username

        db.update_pfp(pfp.filename, username)
    }catch(e){
        console.log("Soemthing is undefined when submitting new pfp")
    }   
    res.send()

})

app.get('/request_owner_data', (req, res) =>{
    const data_promise = db.get_account_data(req.session.user.username)
    data_promise.then(user_data => {

        console.log('Recieved from db: ')
        console.log(`user: ${user_data.username}`)
        console.log(`bio: ${user_data.bio}`)
        console.log(`pfp: ${user_data.pfp}`)
        console.log(`posts: ${user_data.posts}`)

        app.get('/' + user_data.pfp, (req,res) => {
            const filePath = path.join(__dirname, `./uploads/${user_data.pfp}`)
            console.log(`uploading pfp at ${user_data.pfp}`)
            res.sendFile(filePath)
        })

        user_data.posts.forEach(post => {

            post.is_liked = post.likes.includes(user_data.username)

            app.get('/' + post.src, (req,res) => {
                const filePath = path.join(__dirname, `./uploads/${post.src}`)
                console.log(`uploading post at ${post.src}`)
                res.sendFile(filePath)
            })
        })  
    
        res.send(JSON.stringify(user_data))
    })
    
})
//account_page


app.get('/request/show_followers', (req, res) => {
    const filePath = path.join(__dirname, './public/scripts/options/show_followers.js')
    res.sendFile(filePath)
})

app.get('/request/show_following', (req, res) => {
    const filePath = path.join(__dirname, './public/scripts/options/show_following.js')
    res.sendFile(filePath)
})

app.get('/request/show_liked', (req, res) => {
    const filePath = path.join(__dirname, './public/scripts/posts/show_liked.js')
    res.sendFile(filePath)
})

app.get('/request/like', (req, res) => {
    const filePath = path.join(__dirname, './public/scripts/posts/like.js')
    res.sendFile(filePath)
})

app.get('/request/post_as_element', (req, res) => {
    const filePath = path.join(__dirname, './public/scripts/posts/post_as_element.js')
    res.sendFile(filePath)
})

app.get('/request/innit', (req,res) => {
    const filePath = path.join(__dirname, './public/scripts/other_profile/innit.js')
    res.sendFile(filePath)
})

app.get('/request/follow_script', (req, res) => {
    const filePath = path.join(__dirname, './public/scripts/other_profile/follow.js')
    res.sendFile(filePath)
})

app.get('/account/:account_name', (req, res) => {
    const account_name = req.params.account_name

    if(!is_sanitized(account_name)){
        res.send()
        return
    }

    db.check_user_avaliable(account_name).then(isAvalibale => {
        if(isAvalibale){
            console.log(`Account ${account_name} doesn't exist`)
            res.send(`Account doesn't exist! `)
        }else{
            if(account_name === req.session.user.username){
                res.redirect('/my_profile')
                return
            }

            const filePath = path.join(__dirname, './public/html/account.html')
            console.log(`Loaded page of ${account_name}`)
            res.sendFile(filePath)        
        }
    })
})

app.post('/request/data/:account_name', (req, res) => {
    const username = req.params.account_name

    if(!is_sanitized(username)){
        res.send()
        return
    }
    
    console.log(`request for user data from ${username}`)
    
    db.check_user_avaliable(username).then(isAvalibale => {
        if(isAvalibale){
            console.log(`Account ${username} doesn't exist`)
            res.send(false)
        }else{

            try{
                console.log(`Starting to upload to client for user ${username}`)
                const account_data_promise = db.get_account_data(username)
                account_data_promise.then(user => {
                    console.log(`Attempt to get ${username} data: ${user}`)
                    console.log(`Profile pic path ${'/' + user.pfp}`)
                    app.get('/data/' + user.pfp, (req, res) => {
                        const pfpPath = path.join(__dirname, `./uploads/${user.pfp}`)
                        res.sendFile(pfpPath)
                    })
                    const posts = user.posts
                    posts.forEach(post => {

                        post.is_liked = post.likes.includes(req.session.user.username)

                        const post_route = `/data/${post.src}`
                        const post_src = post.src
                        post.src = post_route
                        console.log(`ROUTE FOR POST ${post_route}`)

                        app.get(post_route, (req,res) => {
                            const filePath = path.join(__dirname, `./uploads/${post_src}`)
                            res.sendFile(filePath)
                        })
                        
                    })
                    
                    db.is_following(req.session.user.username, username).then(isFollowing => {
                        user.is_followed = isFollowing
                        res.send(JSON.stringify(user))    
                    })

                    
                })
            }catch(e){
                console.log(`Account with name ${username} is undefined`)
                res.send(false)
            }

        }
    })

    
})


app.post('/request/unfollow', (req, res) => {

    try{
        const to_unfollow = req.body.to_unfollow
        const follower = req.session.user.username
    
        if(!is_sanitized(to_unfollow)){
            res.send()
            return
        }
    
        db.unfollow(follower, to_unfollow)
        res.send()
    }catch(e){
        console.log('Problem with unfollowing', follower, to_unfollow, e)
    }
    
})

app.post('/request/follow', (req, res) => {
    

    try{
        const to_follow = req.body.to_follow
        const follower = req.session.user.username

        if(!is_sanitized(to_follow)){
            res.send()
            return
        }

        db.new_follow(to_follow, follower)
        
        res.send('Success')
    }catch(e){
        console.log('Problem with following', to_follow, follower, e)
    }  
})


//HOME PAGE
app.get('/home', (req, res) => {
    const filePath = path.join(__dirname, './public/html/home.html')
    res.sendFile(filePath)
});

app.post('/request/like_post', (req,res) => {
    console.log(`Recieved request for liking post`)
    try{
        const post = req.body
        db.like_post(post.src, req.session.user.username).then(status => res.send({status: status}))
        
    }catch(e){
        console.log(`error with liking post ${post.src}`, e)
    }
})

app.post('/redirect_to_user', (req, res) => {
    const username = req.body.username
    try{
        if(!is_sanitized(username)){
            res.send()
            return
        }
    }catch(e){
        console.log('problem with redirecting')
        res.send()
        return
    }
    
    const user_exist_promise = db.check_user_avaliable(username)
    user_exist_promise.then(isAvalibale => {
        const exists = !isAvalibale
        console.log(`Response from server when seaching for ${username}: ${exists}`)
        if(exists){
            res.send(true)
        }else{
            res.send(false)
        }
    })
})

app.post('/request/all_following_posts', (req,res) => {
    const username = req.session.user.username
    
    console.log(`client request: all posts on following for user ${username}`)

    db.get_posts_following(username).then(posts => {

        posts.reverse()

        posts.forEach(post => {

            post.is_liked = post.likes.includes(username)

            app.get('/' + post.src, (req, res) => {
                const filePath = path.join(__dirname, `./uploads/${post.src}`)
                res.sendFile(filePath)
            })

        })

        res.send(posts)
    })
    
})

app.post('/request/followers', async (req, res) => {
    try{
        const username = req.body.username

        if(!is_sanitized(username)){
            res.send(undefined)
            return
        }
        console.log('request for all followers')
        db.get_followers(username).then(followers => {

            followers.forEach(user => {
                app.get(`/data/${user.pfp}`, (req, res) => {
                    const pfpFile = path.join(__dirname, `./uploads/${user.pfp}`)   

                    
                    res.sendFile(pfpFile)
                })

            })

            res.send(followers)
        })
        
    }catch(e){
        console.log(`Issue when requesting followers ${e}`)
    }
    
})

app.post('/request/following', (req, res) => {
    try{
        const username = req.body.username

        if(!is_sanitized(username)){
            res.send(undefined)
            return
        }
        
        db.get_following(username).then(following => {
            following.forEach(user => {
                app.get(`/data/${user.pfp}`, (req, res) => {
                    const pfpFile = path.join(__dirname, `./uploads/${user.pfp}`)   
                    
                    res.sendFile(pfpFile)
                })

            })

            res.send(following)
        })

    }catch(e){
        console.log(`Issue when requesting followers ${e}`)
    }
    
})

app.post('/request/all_likers', (req, res) => {
    try{
        const post_src = req.body.src.includes('/data/') ? req.body.src.split('/').pop(): req.body.src
        
        db.get_all_likers(post_src).then(likers => {

            likers.forEach(user => {
                app.get(`/data/${user.pfp}`, (req, res) => {
                    const pfpFile = path.join(__dirname, `./uploads/${user.pfp}`)   
                    
                    res.sendFile(pfpFile)
                })

            })

            res.send(likers)
        })

    }catch(e){
        console.log(`error with request for all likers ${req.body.src}, ${e}`)
    }
})


//testing
app.get('/temp_pfp', (req,res) => {
    res.sendFile(path.join(__dirname, './uploads/pfp.jpg'))
})

app.listen(port , ip, () => {
  console.log(`Server listening on port ${port}`);
});
