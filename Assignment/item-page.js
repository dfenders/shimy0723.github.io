var table;
var pages;
var loading;
var comment_form;
var comments;

function setupPage(){
    // Load the elements into their datafields
    table = document.getElementById("items");
    pages = document.getElementById("pages");
    loading = document.getElementById("loading");
    comments = document.getElementById("comments");
    comment_form = document.getElementById("comment-form");

    // Add on submit event listener to the comments form
    comment_form.addEventListener("submit", postComment);
}

// Run setup once the page has loaded
document.addEventListener("DOMContentLoaded", setupPage);

// Used to check if an email is valid or not
// From: https://emailregex.com/
var email_validate = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// Event listener for when comments form is submitted
function postComment(e){
    // Prevent form from refreshing page
    e.preventDefault();
    e.returnValue = false;

    // Get the elements of the form ready
    var comment_name = document.getElementById("comment-name");
    var comment_text = document.getElementById("comment-text");
    var comment_email = document.getElementById("comment-email");
    var comment_website = document.getElementById("comment-website");
    var validation_error = document.getElementById("validation-error");

    // Clear any previous validation errors from the screen
    validation_error.textContent = "";

    // Validate comment text, name and email address values
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

// Used to create the date and time for display in each comment
function getCurrentDateStr(){
    // Get the current date
    var now = new Date();
    // Make array with full month names to convert month number to name
    var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // Construct the date part of the string
    var date = months[now.getMonth()]+" "+now.getDate()+", "+now.getFullYear();
    
    // Time to construct time part
    var hours = now.getHours();
    var ampm = hours >= 12 ? "pm" : "am"; // Choose AM/PM
    hours = hours % 12; // Round hours by 12
    hours = hours ? hours : 12; // Make 0 -> 12
    var minutes = now.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes; // Add 0 before minutes when between 0-9 mins
    // Construct time part of the string
    var time = hours+":"+minutes+" "+ampm;
    // Add both parts together and return the result
    return date + " at " + time;
}

// Adds a new comment to the div that contains all of the comments
function addNewComment(name, commentText){
    // Create the div to hold the comment and give it a class
    var comment = document.createElement("div");
    comment.setAttribute("class", "comment");

    // Make the name element
    var name_el = document.createElement("h3");
    name_el.textContent = name;
    comment.appendChild(name_el); // Add it to the div
    
    // Make the date element
    var date = document.createElement("div");
    date.setAttribute("class", "date"); // Give it a class
    date.textContent = getCurrentDateStr(); // Set it's text to be the current time with the correct format
    comment.appendChild(date); // Add it to the div

    // Make the element for the comment text to go in
    var content = document.createElement("div");
    content.setAttribute("class", "comment-text"); // Give it a class
    content.textContent = commentText;
    comment.appendChild(content); // Add it to the div

    // Add comment div to the container element
    comments.appendChild(comment);
}

// Loads the guitars data from a json file and sends to next function to generate the page
function loadJson(jsonFile)
{
    fetch('./'+jsonFile)
    .then(res => {
        // Convert text to JS object
        return res.json();
    })
    .then(data => {
        // Generate page from data loaded
        loadItems(data);
    });
}

// Take data from json and generates a table item and item page for each item loaded
function loadItems(items)
{
    // Loop through all of the items from the json
    for (var i=0; i<items.length; i++)
    {
        addTableItem(items[i]); // Add item entry to the table at top of the page
        addPage(items[i]); // Add the 'page' to the bottom of this page with more details of the item
    }
    // Currently the table and pages element are hidden, but
    // Once the page content has be generated 
    // Show the table and pages element
    table.style.display="table";
    pages.style.display="block";
    // Also hide the loading message
    loading.style.display="none";
}

// Generates a name for the anchor that is used to navigate to a page by clicking on a guitars name in the table
function getAnchorName(name)
{
    return name.split(" ").join("-");
}

// Generates a 5-star rating interface item that can be set to display a certain score/rating
// Also handles the javascript that makes it possible for the user to click on the rating to change it
function createRatingElement(score){
    // Make a new rating element
    // This has 5 greyed out stars in the background
    var rating = document.createElement("span");
    rating.setAttribute("class", "rating-bar"); // Give it a class

    // Make the active area, which shows some/all of 5 red stars over the greyed out stars
    var active_rating = document.createElement("span");
    active_rating.setAttribute("class", "rating-active"); // Give it a class
    // Convert rating out of 5 to percentage
    var rating_percent = Math.round((score/5)*100);
    // Set the width of the active area to be the correct percentage
    active_rating.style.width = rating_percent+"%";
    // Add active area to the rating element
    rating.appendChild(active_rating);

    // Add mouse events to the rating element to handle the user rating change functionality
    rating.addEventListener("click", changeRating);
    rating.addEventListener("mouseover", savePreviousRating);
    rating.addEventListener("mousemove", previewRating);
    rating.addEventListener("mouseout", resetPreviousRating);

    // Return the new rating element
    return rating;
}

// These two variables are used by the rating-changing functions below
var savedRatingWidth = "0%"; // Used to save previous width, so that it can be reset if we need to
var ratingChanged = false; // Gets turned true if the rating is clicked/changed

// Event when the mouse goes over to the rating element
// Saves the current width of the active area so that it can be reset after the mouse moves off the rating element
function savePreviousRating(e){
    ratingChanged = false;
    var active = e.currentTarget.getElementsByTagName("span")[0];
    savedRatingWidth = active.style.width;
}
// Event when the mouse moves while it is over the rating element
// Actively changes the width of the active area to match the position of the mouse
// Only does this before the mouse clicks the element, stops changes afterwards
function previewRating(e){
    if(!ratingChanged){ // Only if mouse wasn't clicked yet
        var active = e.currentTarget.getElementsByTagName("span")[0];
        // Get mouse position and calculate percentage of width for the active area
        var rect = e.currentTarget.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var w = e.currentTarget.clientWidth;
        var percent = x/w*100;
        // Update the active area's width
        active.style.width = percent+"%";
    }
}
// Event when the mouse moves off the rating element
// Resets the active area's width to what it was before the mouse moved over the element
// Only does this if the element wasn't clicked
function resetPreviousRating(e){
    if(!ratingChanged){ // Only if mouse wasn't clicked yet
        var active = e.currentTarget.getElementsByTagName("span")[0];
        active.style.width = savedRatingWidth; // Reset width
    }
}

// Event when the mouse clicks a rating element
// Changes the width of the active area and tells the other events not to change it any further / reset it
function changeRating(e){
    // Get mouse position and percentage for the new width
    var rect = e.currentTarget.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var w = e.currentTarget.clientWidth;
    var percent = x/w*100;
    // Get the active area element
    var active = e.currentTarget.getElementsByTagName("span")[0];
    // Change the width
    active.style.width = percent+"%";
    // Tell the other events that the rating has changed
    ratingChanged = true;
}

// Used to add a new guitar to the table at the top of the page
function addTableItem (item)
{
    // Create the row element and cell elements for each column
    var row = document.createElement("tr");
    var imageCol = document.createElement("td");
    var nameCol = document.createElement("td");
    var summaryCol = document.createElement("td");
    var priceCol = document.createElement("td");
    // Add cells to row
    row.appendChild(imageCol);
    row.appendChild(nameCol);
    row.appendChild(summaryCol);
    row.appendChild(priceCol);

    // Create an image, give it a class and set the file for the image
    var image = document.createElement("img");
    image.setAttribute("class", "thumbnail");
    image.setAttribute("src", item.image);
    imageCol.appendChild(image);

    // Create a link element for the name of the guitar
    // Make it link to the anchor that we make for it later in the page
    var name =document.createElement("a");
    name.textContent = item.name;
    name.setAttribute("href", "#"+getAnchorName(item.name));
    nameCol.appendChild(name);

    // Create a div to store the rating details
    var rating = document.createElement("div");
    rating.setAttribute("class", "rating");
    // Make the text version of the rating
    var rating_text = document.createElement("span");
    rating_text.setAttribute("class", "rating-text");
    // Set the text
    rating_text.textContent = "Total of "+item.overall_rating+"/5";
    // Make the rating element, passing the function the rating to use
    var rating_bar = createRatingElement(item.overall_rating);

    // Add the elements to the rating div and the rating div to the cell
    rating.appendChild(rating_text);
    rating.appendChild(rating_bar);
    nameCol.appendChild(rating);

    // Set the text of the summary column to the summary from the json item
    summaryCol.textContent = item.summary;

    // Create a link element for the amazon link and add it to the price column
    var amazon =document.createElement("a");
    amazon.setAttribute("href", item.amazon_link);
    amazon.setAttribute("class", "price-check");
    amazon.textContent = "Amazon";
    priceCol.appendChild(amazon);

    // Add the new row to the table
    table.appendChild(row);
}

// Used by the addPage function to add a new row to the ratings table that is displayed on each guitar page
function makeRatingBlockRow(name, rating){
    // Make the row element
    var row = document.createElement("tr");
    // Make the name cell and set it's text to the name that the function was given
    var nameCol = document.createElement("td");
    nameCol.textContent = name;
    row.appendChild(nameCol);
    // Make the rating column
    var ratingCol = document.createElement("td");
    ratingCol.setAttribute("class", "rating-col");
    // Make a new rating element and pass it the rating that this function was given to be displayed
    var rating_bar = createRatingElement(rating);
    ratingCol.appendChild(rating_bar);
    row.appendChild(ratingCol);

    // Return the row element
    return row;
}

// Used to take an item from json and build a page element to add to the bottom of the page
function addPage (item)
{
    // First create the anchor element that is used to link to this page by the link in the table
    var anchor = document.createElement("a");
    anchor.setAttribute("name", getAnchorName(item.name)); // Get the right name to use from this function
    pages.appendChild(anchor);

    // Create the page div element
    var page = document.createElement("div");
    page.setAttribute("class", "page");    
    
    // Create the title element and set it's text to the guitar name
    var title = document.createElement("h2");
    title.textContent = item.name;
    page.appendChild(title);
    
    // The image and rating table are in two columns so make the column element for the image
    var image_col = document.createElement("div");
    image_col.setAttribute("class", "page-col");
    page.appendChild(image_col);

    // Make the image element and add it to the column
    var image = document.createElement("img");
    image.setAttribute("class", "preview");
    image.setAttribute("src", item.image);
    image_col.appendChild(image);

    // Make the rating table column element
    var rating_col = document.createElement("div");
    rating_col.setAttribute("class", "page-col");

    // Make the rating table and for each type of rating that the guitar is given:
    // Read the rating from the json item and make a row for each type
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

    // Make a row and cell for the check price button and make the cell span two columns
    var price_row = document.createElement("tr");
    rating_block.appendChild(price_row);
    var price_col = document.createElement("td");
    price_col.setAttribute("colspan", 2);
    price_row.appendChild(price_col);

    // Make the link element for the price check button, using the link to amazon page
    var price_link = document.createElement("a");
    price_link.setAttribute("href", item.amazon_link);
    price_link.setAttribute("class", "price-check");
    price_link.textContent = "Check Price";
    price_col.appendChild(price_link);
    
    // Add the rating table to the second column on the page
    rating_col.appendChild(rating_block);
    page.appendChild(rating_col);

    // Make an element for displaying the full description of the guitar using the data from the json item
    var description = document.createElement("div");
    description.setAttribute("class", "description");
    description.innerHTML = item.description;
    page.appendChild(description);

    // Add the page element to the container where the pages are displayed
    pages.appendChild(page);
}