const form = document.getElementById("form_idea");
if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formdata = new FormData(form);

    console.log(formdata.get("topic"));
    const response = await window.axios.openAI(formdata.get("topic"));
    document.getElementById("generated_topics").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, "\n");
    
  };
}
