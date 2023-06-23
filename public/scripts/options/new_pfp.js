

const preview_pfp = () => {
    const input_field = document.getElementById('pfpInput')
    const preview_field = document.getElementById('pfp_preview')
    const file = input_field.files[0]
    if(file === undefined){
        preview_field.style.display = 'none'
        preview_field.src = ''
        return
    }
    const reader = new FileReader()

    preview_field.style.display = 'inline-block'
    reader.onload = function(event){
        preview_field.src = event.target.result
    }

    reader.readAsDataURL(file)
}

const try_pfp_upload = () => {
    const input_field = document.getElementById('pfpInput')
    const pfp = input_field.files[0]

    const formData = new FormData();
    formData.append('image', pfp);

    const xhr = new XMLHttpRequest
    xhr.open('POST', '/new_pfp')

    xhr.onload = function(){
        if(xhr.status === 200)
            location.reload()
    }
    
    xhr.send(formData)
}


const promt_new_pfp = () => {
    const new_pfp_div= document.getElementById('change_pfp')
    if(new_pfp_div.style.display === 'none'){
        const preview_field = document.getElementById('pfp_preview')
        const pfp_input = document.getElementById('pfpInput')
        preview_field.src = ''
        preview_field.style.display = 'none'
        pfp_input.value = ''
        new_pfp_div.style.display = 'contents'
        return
    }
    new_pfp_div.style.display = 'none'

}