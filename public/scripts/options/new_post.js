
const on_image_upload = () => {
    console.log('image uploaded')
    const img_field = document.getElementById('imageInput')
    const previewWindow = document.getElementById('imagePreview')
    const file = img_field.files[0]
    if(file === undefined){
        previewWindow.style.display = 'none'
        previewWindow.src = ''
        return
    }

    const reader = new FileReader();

    previewWindow.style.display = 'inline-block'

    reader.onload = function(event) {
        previewWindow.src = event.target.result;
    };
    reader.readAsDataURL(file);
    
}

const try_upload = () => {
    const img_field = document.getElementById('imageInput')
    const description_input = document.getElementById('description_input')
    
    const img = img_field.files[0]

    const formData = new FormData();
    formData.append('image', img);

    const description = description_input.value
    formData.append('description', description)
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/new_post')

    xhr.onload = function(){
        if(xhr.status === 200){
            console.log('POST SUCCESFULL')
            location.reload()
        }
    }


    xhr.send(formData)
}

const promt_new_post = () => {
    const new_post_div = document.getElementById('new_post')
    if(new_post_div.style.display === 'none'){
        const previewWindow = document.getElementById('imagePreview')
        const img_field = document.getElementById('imageInput')
        const description_input = document.getElementById('description_input')
        previewWindow.src = ''
        previewWindow.style.display = 'none'
        img_field.value = ''
        description_input.value = ''
        new_post_div.style.display = 'contents' 
        return
    }else{
        
        new_post_div.style.display = 'none'  
    }
    
}