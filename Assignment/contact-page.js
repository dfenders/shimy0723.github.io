var contact_form;

function setupPage(){
    contact_form = document.getElementById("contact-form");
    contact_form.addEventListener("submit", sendMessage);
}

document.addEventListener("DOMContentLoaded", setupPage);

function sendMessage(e){

    var name_el = document.getElementById("contact-name");
    var name = name_el.value;
    
    var text_el = document.getElementById("contact-text");
    var email_el = document.getElementById("contact-email");
    var website_el = document.getElementById("contact-website");

    alert("Thank you for your message, "+name+"!");
    
    
    name_el.value = "";
    text_el.value = "";
    email_el.value = "";
    website_el.value = "";

    // Prevent form from refreshing page
    e.preventDefault();
    e.returnValue = false;
    return false;
}