
const show_options = () => {
    const posts_div = document.getElementById('posts')
    const options_div = document.getElementById('options')
    if(posts_div.style.display === 'none'){
        posts_div.style.display = 'contents'    
        options_div.style.display = 'none'
    }else{
        posts_div.style.display = 'none'
        options_div.style.display = 'contents'
    }

    

}