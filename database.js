
const { response } = require('express');
const { MongoClient, ConnectionClosedEvent } = require('mongodb');

const url = 'mongodb+srv://alexkolev05:1234@eentai.ou01tyv.mongodb.net/?retryWrites=true&w=majority'; // Replace with the MongoDB connection URI
const client = new MongoClient(url);
const db_name = 'demo' 

//collections for different purposes
const users = 'users'
const posts = 'posts'

const add_new_account = async(user) => {
    
    await client.connect()
    try{
        const db = client.db(db_name)
        const collection = db.collection(users)
        
        user.followers = []
        user.following = []

        collection.insertOne(user)        
    }catch(e){
        console.log(e)
    }
    
}



const check_user_avaliable = async(username) => {

    await client.connect()

    return new Promise(async(resolve, reject) => {
        try{
            const db = client.db(db_name)
            const collection = db.collection(users)
            
            const query = {username: username}

            const response = await collection.findOne(query)

            console.log(`RESPONSE FROM DB WHEN LOOKING FOR ${username}: ${response}`)

            resolve(response === null)
        }catch(e){
            reject(e)
        }
    })
        
}

const get_password = async(username) => {
    await client.connect()

    return new Promise(async(resolve, reject) => {
        try{
            db = client.db(db_name)
            const collection = db.collection(users)

            const query = {username: username}

            const response = await collection.findOne(query)

            if(response === null)
                resolve(null)
            resolve(response.password)
        }catch(e){
            reject(e)
        }
    })
}

const new_post = async(post_obj) => {
    await client.connect()
    
    try{
        const db = client.db(db_name)
        const collection = db.collection(posts)
        
        await collection.insertOne(post_obj)
        console.log(`Inserted new post ${post_obj} into db succesfully.`)
    }catch(e){
        console.log(e)
    }
}

const update_bio = async(bio, username) => {
    await client.connect()

    try{
        const db = client.db(db_name)
        const collection = db.collection(users)

        const find = {username: username}
        const replace = { $set: {'bio': bio}}

        await collection.updateOne(find, replace)
    }catch(e){
        console.log("Problem with updating bio. undefined maybe?")
    }
}

const update_pfp = async(pfp_src, username) => {
    try{
        const db = client.db(db_name)
        const collection = db.collection(users)
        const find = {username: username}
        const replace = { $set: {'pfp': pfp_src}}

        console.log(`Replacing user ${username} pfp with ${pfp_src}`)
        await collection.updateOne(find, replace)
    }catch(e) {
        console.log()
    }
}

const get_account_data = async(username) => {

    await client.connect()

    try{
        const db = client.db(db_name)
        const find = {username: username}    
        
        const user_data = db.collection(users)
        const user_info = await user_data.findOne(find)

        const posts_data = db.collection(posts)
        const user_posts = await posts_data.find(find).toArray()

        let to_return = user_info
        to_return.posts = user_posts
        to_return.password = ''

        return new Promise((resolve, reject) => {
            resolve(to_return)
        })
    
        
    }catch(e){
        
    }
}

const unfollow = async(follower, to_unfollow) => {
    await client.connect()
    try{
        const db = client.db(db_name)

        const users_data = db.collection(users)

        const to_be_unfollowed = await users_data.findOne({username: to_unfollow})
        const remove_following = await users_data.findOne({username: follower})

        const new_followers_list = to_be_unfollowed.followers.filter((user) => user !== follower)
        
        const new_following_list = remove_following.following.filter((user) => user !== to_unfollow)

        users_data.updateOne({username: follower}, {$set: {following: new_following_list}})
        users_data.updateOne({username: to_unfollow}, {$set: {followers: new_followers_list}})

        console.log('Succesfully unfollowed')

    }catch(e){
        console.log(`Issue with unfollowing ${e}`)
    }    
}

const is_following = async(user, following) => {
    await client.connect()
    try{
        const db = client.db(db_name)
        
        const collection = db.collection(users)

        const user_account = await collection.findOne({username: user})
        
        console.log(`Got from db when checking for following: ${user_account}`)

        const isFollowing = user_account.following.includes(following)

        return new Promise((resolve, reject) => resolve(isFollowing))
            
    }catch(e){
        console.log(`error when checking does user ${user} follow user ${following}: ${e}`)
    }
}

const new_follow = async(to_follow, follower) => {
    await client.connect()
    try{
        const db = client.db(db_name)

        const users_data = db.collection(users)

        const to_be_followed = await users_data.findOne({username: to_follow})
        const to_be_following = await users_data.findOne({username: follower})

        let new_followers_list = to_be_followed.followers
        if(!new_followers_list.includes(follower))
            new_followers_list.push(follower)

        let new_following_list = to_be_following.following
        if(!new_following_list.includes(to_follow))
            new_following_list.push(to_follow)

        users_data.updateOne({username: follower}, {$set: {following: new_following_list}})
        users_data.updateOne({username: to_follow}, {$set: {followers: new_followers_list}})

        console.log('New follower succesfully inserted! ')

    }catch(e){
        console.log(`Issue with inserting new follower ${e}`)
    }
}
//debug
const clear = async() => {
    await client.connect()
    const db = client.db(db_name)
    const collection = db.collection(posts)

    await collection.deleteMany()
}

const add_arrays = async() => {
    await client.connect()
    const db = client.db(db_name)

    const collection = db.collection(posts)
    
    const _posts = await collection.find().toArray()

    console.log(`number of posts: ${_posts.length}`)

    _posts.forEach(async(post) => {
        const post_src = post.src
    
        await collection.updateOne({src: post_src}, {$set: {likes: []}})
        
        
    });

}

//get all the posts in the last 10 days of all the people user is following
const get_posts_following = async(user) => {

    await client.connect()
    
    return new Promise(async(resolve, reject) => {
        const db = client.db(db_name)

        const users_data = db.collection(users)

        const posts_data = db.collection(posts)
        try{
            const user_following = await users_data.findOne({username: user})
        
            console.log(`Followeing for ${user}: ${user_following.following}`)
        
            const number_of_days = 10
            const days_to_milli = 24 * 3600 * 1000

            const days_ago = new Date().getTime() - number_of_days * days_to_milli

            const all_posts = await posts_data.find({username: {$in: user_following.following}}).toArray()
            
            all_posts.forEach( post => {
                console.log(post)
            })

            console.log(`Number of posts to return: ${all_posts.length}`)
            resolve(all_posts)
            
        }catch(e){
            console.log(`Error when retrieving all posts of following users: ${e}`)
            reject(e)
        }
        
    })

}

const like_post = async(post_src, liker) => {

    await client.connect()
    
        const db = client.db(db_name)

        const _posts = db.collection(posts)
        console.log(`ON DB: when liking post.src: ${post_src}, liker ${liker}`)

        post_src = post_src.split('/').pop()
        
        return new Promise(async(resolve, reject) => {
            try{

                const response = await _posts.findOne({src: post_src})
                console.log(`From db when liking: ${response.likes}`)
                    if(!response.likes.includes(liker)){
                        response.likes.push(liker)
                        await _posts.updateOne({src: post_src}, {$set: {likes: response.likes}})
                        resolve('liked')
                    }else{
                        response.likes = response.likes.filter((user) => user !== liker)
                        await _posts.updateOne({src: post_src}, {$set: {likes: response.likes}})
                        resolve('unliked')
                    }
       
            }catch(e) {
                console.log(`Problem when liking post on db ${e}`)
            }
    })
}

module.exports = {
    check_user_avaliable,
    add_new_account,
    get_password,
    new_post,
    update_bio,
    update_pfp,
    get_account_data,
    new_follow,
    unfollow,
    is_following,
    get_posts_following,
    add_arrays,
    like_post,
    clear
}