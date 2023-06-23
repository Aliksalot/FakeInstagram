
const send_image = () =>{
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('image', file);

    console.log(formData)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/upload_image')
    xhr.onload = () => {
        if(xhr.status === 200){
            console.log(xhr.response)
        }
    }
    xhr.send(formData)
}
