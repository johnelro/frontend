const form = document.getElementById("form_idea");
if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formdata = new FormData(form);

    let topic = formdata.get("topic");

    if (topic.length <=  8 ){
      
      alertMessages("error", "Please input at least 8 characters!");
      return;
    }

    // console.log(formdata.get("topic"));
    const response = await window.axios.openAI(formdata.get("topic"));
    document.getElementById("generated_topics").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, "\n");
    
  };
}


function alertMessages(status, topic){
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