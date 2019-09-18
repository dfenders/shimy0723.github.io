var table;
var pages;
var loading;

function loadJson(jsonFile)
{
    table = document.getElementById("items");
    pages = document.getElementById("pages");
    loading = document.getElementById("loading");

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
    table.style.display="block";
    pages.style.display="block";
    loading.style.display="none";
}

function getAnchorName(name)
{
    return name.split(" ").join("-");
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
    image.src=item.image;
    imageCol.appendChild(image);
    var name =document.createElement("a");
    name.textContent=item.name;
    name.href="#"+getAnchorName(item.name);
    nameCol.appendChild(name);
    summaryCol.textContent=item.summary;
    var amazon =document.createElement("a");
    amazon.href=item.amazon_link;
    amazon.textContent="Amazon";
    priceCol.appendChild(amazon);
    table.appendChild(row);
}
function addPage (item)
{
    
}