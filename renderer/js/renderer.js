const btn_extract = document.getElementById("btn_extract");
if (btn_extract) {
  btn_extract.onclick = async function () {
    const file = document.getElementById("file_extract").files[0];

    const file_types = ['image/png', 'image/bmp', 'image/jpeg'];
    if ( !file || !file_types.includes(file['type']) ) {
      alertMessage("error", "Please upload an image with (png, bmp, jpeg) format!");
      return;
    }

    btn_extract.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    btn_extract.disabled = true;

    const response = await window.axios.tesseract(file.path);
    document.querySelector("textarea[name='topic']").innerHTML = response.text;
    
    btn_extract.innerHTML = 'Extract Text';
    btn_extract.disabled = false;
  };
}

const form = document.getElementById("form_idea");
if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formdata = new FormData(form);
    // let extraction_type = document.getElementById("pills-text-tab").classList.contains('active');
    let topic = formdata.get("topic");
    // let sentence = extraction_type ? formData.get("sentence-text") : formData.get("sentence-img");


    if (topic.length <=  8 ){
      
      alertMessage("error", "Please input at least 8 characters!");
      return;
    }

    // console.log(formdata.get("topic"));
    const response = await window.axios.openAI(topic);
    let result = response.choices[0].text;
    document.getElementById("generated_topics").innerHTML = response.choices[0].text.trim();
    
    const response1 = await window.axios.backendLaravelAPI('post', {
      topic: formdata.get("topic"),
      ai_response: result,
    }); 
    // console.log(response1);
  }
}


function alertMessage(status, topic){
    window.Toastify.showToast({
      text: topic,
      duration: 5000,
      stopOnFocus: true,
      style: {
        textAlign: "center",
        background: status=="error" ? "red": "green",
        color: "white",
        padding: "5px",
        marginTop: "2px",
      }
    });


}