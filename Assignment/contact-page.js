var contact_form;

function setupPage(){
    // Add the on submit event to the contact form
    contact_form = document.getElementById("contact-form");
    contact_form.addEventListener("submit", sendMessage);
}

// When the page loads, run setup function
document.addEventListener("DOMContentLoaded", setupPage);

// Used to check if an email address is valid or not
// From: https://emailregex.com/
var email_validate = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;


function sendMessage(e){
    // Prevent form from refreshing page
    e.preventDefault();
    e.returnValue = false;
    
    // Get the form elements
    var name_el = document.getElementById("contact-name");    
    var text_el = document.getElementById("contact-text");
    var email_el = document.getElementById("contact-email");
    var website_el = document.getElementById("contact-website");
    var validation_error = document.getElementById("validation-error");

    var name = name_el.value;

    // Clear any previous validation errors from the screen
    validation_error.textContent = "";

    // Validate message, name and email address
    if(text_el.value.trim() == ""){
        validation_error.textContent = "Please enter a message.";
        text_el.focus();
        return false;
    }
    if(name.trim() == ""){
        validation_error.textContent = "Please enter your name.";
        name_el.focus();
        return false;
    }
    if(!email_validate.test(email_el.value)){
        validation_error.textContent = "Please enter a valid email address.";
        email_el.focus();
        return false;
    }

    // Show a feedback message if the message validation is ok
    alert("Thank you for your message, "+name+"!");
    
    // Clear the form
    name_el.value = "";
    text_el.value = "";
    email_el.value = "";
    website_el.value = "";

    return false;
}