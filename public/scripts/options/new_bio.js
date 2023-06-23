

const try_new_bio = () => {
    const bio_input = document.getElementById('input_new_bio')
    const new_bio = bio_input.value
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/new_bio')
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function(){
        if(xhr.status === 200)
            location.reload()
    }

    const bio_obj = {bio: new_bio}

    xhr.send(JSON.stringify(bio_obj))
}

const promt_new_bio = () => {
    const change_bio_field = document.getElementById('change_bio')
    if(change_bio_field.style.display === 'none'){
        const bio_input = document.getElementById('input_new_bio')
        bio_input.value = ''
        change_bio_field.style.display = 'contents' 
        return
    }
    change_bio_field.style.display = 'none'

}