
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

const clear = async() => {
    await client.connect()
    const db = client.db(db_name)
    const collection = db.collection(uploads)

    await collection.deleteMany()
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

const new_follow = async(to_follow, follower) => {
    await client.connect()
    try{
        const db = client.db(db_name)

        const users = db.collection(users)

        const to_be_followed = await users.findOne({username: to_follow})
        const to_be_following = await users.findOne({username: follower})

        let new_followers_list = to_be_followed.followers
        new_followers_list.push(follower)

        let new_following_list = to_be_following.following
        new_following_list.push(to_follow)

        users.updateOne({username: follower}, {$set: {following: new_following_list}})
        users.updateOne({username: following}, {$set: {followers: new_followers_list}})

    }catch(e){
        console.log(`Issue with inserting new follower ${e}`)
    }
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
    clear
}