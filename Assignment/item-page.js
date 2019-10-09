var table;
var pages;
var loading;
var comment_form;
var comments;

function setupPage(){
    table = document.getElementById("items");
    pages = document.getElementById("pages");
    loading = document.getElementById("loading");
    comments = document.getElementById("comments");
    comment_form = document.getElementById("comment-form");
    comment_form.addEventListener("submit", postComment);
}

document.addEventListener("DOMContentLoaded", setupPage);

// From: https://emailregex.com/
var email_validate = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

function postComment(e){
    // Prevent form from refreshing page
    e.preventDefault();
    e.returnValue = false;

    var comment_name = document.getElementById("comment-name");
    var comment_text = document.getElementById("comment-text");
    var comment_email = document.getElementById("comment-email");
    var comment_website = document.getElementById("comment-website");

    var validation_error = document.getElementById("validation-error");

    // Clear any previous validation errors from the screen
    validation_error.textContent = "";

    // Validate name and email address
    if(comment_text.value.trim() == ""){
        validation_error.textContent = "Please enter some text to post as your comment.";
        comment_text.focus();
        return false;
    }
    if(comment_name.value.trim() == ""){
        validation_error.textContent = "Please enter your name.";
        comment_name.focus();
        return false;
    }
    if(!email_validate.test(comment_email.value)){
        validation_error.textContent = "Please enter a valid email address.";
        comment_email.focus();
        return false;
    }

    // Hide placeholder comment since we are adding a comment
    var placeholder = document.getElementById("placeholder-comment");
    placeholder.style.display = "none";

    // Add the new comment to the comments section
    addNewComment(comment_name.value, comment_text.value);

    // Clear the form
    comment_name.value = "";
    comment_text.value = "";
    comment_email.value = "";
    comment_website.value = "";

    return false;
}

function getCurrentDateStr(){
    var now = new Date();
    var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var date = months[now.getMonth()]+" "+now.getDate()+", "+now.getFullYear();
    var hours = now.getHours();
    var ampm = hours >= 12 ? "pm" : "am"; // Choose AM/PM
    hours = hours % 12; // Round hours by 12
    hours = hours ? hours : 12; // Make 0 -> 12
    var minutes = now.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes; // Add 0 before minutes when between 0-9 mins
    var time = hours+":"+minutes+" "+ampm;
    return date + " at " + time;
}

function addNewComment(name, commentText){
    var comment = document.createElement("div");
    comment.setAttribute("class", "comment");

    var name_el = document.createElement("h3");
    name_el.textContent = name;
    comment.appendChild(name_el);
    
    var date = document.createElement("div");
    date.setAttribute("class", "date");
    date.textContent = getCurrentDateStr();
    comment.appendChild(date);

    var content = document.createElement("div");
    content.setAttribute("class", "comment-text");
    content.textContent = commentText;
    comment.appendChild(content);

    comments.appendChild(comment);
}

function loadJson(jsonFile)
{
    fetch('./'+jsonFile)
    .then(res => {
        return res.json();
    })
    .then(data => {
        loadItems(data);
    });
}

function loadItems(items)
{
    for (var i=0; i<items.length; i++)
    {
        addTableItem(items[i]);
        addPage(items[i]);        
    }
    table.style.display="table";
    pages.style.display="block";
    loading.style.display="none";
}

function getAnchorName(name)
{
    return name.split(" ").join("-");
}

function createRatingElement(score){
    var rating = document.createElement("span");
    rating.setAttribute("class", "rating-bar");
    var active_rating = document.createElement("span");
    active_rating.setAttribute("class", "rating-active");
    var rating_percent = Math.round((score/5)*100);
    active_rating.style.width = rating_percent+"%";
    rating.appendChild(active_rating);
    rating.addEventListener("click", changeRating);
    rating.addEventListener("mouseover", savePreviousRating);
    rating.addEventListener("mousemove", previewRating);
    rating.addEventListener("mouseout", resetPreviousRating);
    return rating;
}

var savedRatingWidth = "0%";
var ratingChanged = false;

function savePreviousRating(e){
    ratingChanged = false;
    var active = e.currentTarget.getElementsByTagName("span")[0];
    savedRatingWidth = active.style.width;
}
function previewRating(e){
    if(!ratingChanged){
        var active = e.currentTarget.getElementsByTagName("span")[0];
        var rect = e.currentTarget.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var w = e.currentTarget.clientWidth;
        var percent = x/w*100;
        active.style.width = percent+"%";
    }
}
function resetPreviousRating(e){
    if(!ratingChanged){
        var active = e.currentTarget.getElementsByTagName("span")[0];
        active.style.width = savedRatingWidth;
    }
}

function changeRating(e){
    var rect = e.currentTarget.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var w = e.currentTarget.clientWidth;
    var percent = x/w*100;
    var active = e.currentTarget.getElementsByTagName("span")[0];
    active.style.width = percent+"%";
    ratingChanged = true;
}
function addTableItem (item)
{
    var row = document.createElement("tr");
    var imageCol = document.createElement("td");
    var nameCol = document.createElement("td");
    var summaryCol = document.createElement("td");
    var priceCol = document.createElement("td");
    row.appendChild(imageCol);
    row.appendChild(nameCol);
    row.appendChild(summaryCol);
    row.appendChild(priceCol);

    var image = document.createElement("img");
    image.setAttribute("class", "thumbnail");
    image.setAttribute("src", item.image);
    imageCol.appendChild(image);

    var name =document.createElement("a");
    name.textContent = item.name;
    name.setAttribute("href", "#"+getAnchorName(item.name));
    nameCol.appendChild(name);

    var rating = document.createElement("div");
    rating.setAttribute("class", "rating");
    var rating_text = document.createElement("span");
    rating_text.setAttribute("class", "rating-text");
    rating_text.textContent = "Total of "+item.overall_rating+"/5";
    
    var rating_bar = createRatingElement(item.overall_rating);

    rating.appendChild(rating_text);
    rating.appendChild(rating_bar);
    nameCol.appendChild(rating);

    summaryCol.textContent = item.summary;

    var amazon =document.createElement("a");
    amazon.setAttribute("href", item.amazon_link);
    amazon.setAttribute("class", "price-check");
    amazon.textContent = "Amazon";
    priceCol.appendChild(amazon);

    table.appendChild(row);
}

function makeRatingBlockRow(name, rating){
    var row = document.createElement("tr");
    var nameCol = document.createElement("td");
    nameCol.textContent = name;
    row.appendChild(nameCol);
    var ratingCol = document.createElement("td");
    ratingCol.setAttribute("class", "rating-col");
    var rating_bar = createRatingElement(rating);
    ratingCol.appendChild(rating_bar);
    row.appendChild(ratingCol);
    return row;
}

function addPage (item)
{
    var anchor = document.createElement("a");
    anchor.setAttribute("name", getAnchorName(item.name));
    pages.appendChild(anchor);

    var page = document.createElement("div");
    page.setAttribute("class", "page");    
    
    var title = document.createElement("h2");
    title.textContent = item.name;
    page.appendChild(title);
    
    var image_col = document.createElement("div");
    image_col.setAttribute("class", "page-col");
    page.appendChild(image_col);

    var image = document.createElement("img");
    image.setAttribute("class", "preview");
    image.setAttribute("src", item.image);
    image_col.appendChild(image);

    var rating_col = document.createElement("div");
    rating_col.setAttribute("class", "page-col");

    var rating_block = document.createElement("table");
    rating_block.setAttribute("class", "rating-block");
    var body_rating = makeRatingBlockRow("Body And Neck: ", item.body_rating);
    rating_block.appendChild(body_rating);
    var hardware_rating = makeRatingBlockRow("Hardware: ", item.hardware_rating);
    rating_block.appendChild(hardware_rating);
    var sound_rating = makeRatingBlockRow("Sound: ", item.sound_rating);
    rating_block.appendChild(sound_rating);
    var value_rating = makeRatingBlockRow("Value: ", item.value_rating);
    rating_block.appendChild(value_rating);

    var price_row = document.createElement("tr");
    rating_block.appendChild(price_row);

    var price_col = document.createElement("td");
    price_col.setAttribute("colspan", 2);
    price_row.appendChild(price_col);

    var price_link = document.createElement("a");
    price_link.setAttribute("href", item.amazon_link);
    price_link.setAttribute("class", "price-check");
    price_link.textContent = "Check Price";
    price_col.appendChild(price_link);
    
    rating_col.appendChild(rating_block);
    page.appendChild(rating_col);

    var description = document.createElement("div");
    description.setAttribute("class", "description");
    description.innerHTML = item.description;

    page.appendChild(description);

    pages.appendChild(page);
}