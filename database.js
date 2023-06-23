
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

module.exports = {
    check_user_avaliable,
    add_new_account,
    get_password,
    new_post,
    update_bio,
    update_pfp,
    clear
}