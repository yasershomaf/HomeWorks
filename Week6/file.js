var searchBTN = document.getElementById("searchBTN");
searchBTN.addEventListener("click", getInputField);
makeRequest("https://api.github.com/users/yasershomaf", showUserInfo);//This line loads my profile

//This function makes sure that the text field is not empty before reseting the page, and then makes the request.
function getInputField() {
    var requestURL = document.getElementById("inputField").value;
    if (requestURL != "") {
        document.getElementById("leftSection").innerHTML = "";
        document.getElementById("centerSection").innerHTML = "";
        document.getElementById("aside").innerHTML = "";
        requestURL = "https://api.github.com/users/" + requestURL;
        makeRequest(requestURL, showUserInfo);
    }
}

//This function is a general function for making requests to GitHub API, and then after checking of the result of the request it runs the sutable callBack function whose name is passed to this function.
function makeRequest(requestURL, callBackFunction) {
    var xhr = new XMLHttpRequest;
    xhr.open("Get", requestURL, true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    function processRequest() {
        if (xhr.readyState == 4) {
            var resultJson = JSON.parse(xhr.response);
            if (resultJson.hasOwnProperty("message"))
                callBackFunction(false);
            else
                callBackFunction(true, resultJson)
        }
    }
}

//This is the callBack function that responses to the result of the user profile request and renders it.
function showUserInfo(requestOK, requestJ) {
    if (requestOK) {
        var userName = document.createElement("h2");
        userName.innerHTML = requestJ.login
        userName.setAttribute("title", "Show more details about " + requestJ.login);
        userName.setAttribute("class", "fingerPointer");
        var profileLink = document.createElement("a");
        profileLink.setAttribute("href", requestJ.html_url);
        profileLink.setAttribute("target", "_blank");
        var avatarImage = document.createElement("img");
        avatarImage.setAttribute("alt", "The avatar image of " + requestJ.login);
        avatarImage.setAttribute("src", requestJ.avatar_url);
        avatarImage.setAttribute("title", "Visit the page of " + requestJ.login + " on GitHub");
        profileLink.appendChild(avatarImage);
        var publicRepos = document.createElement("h3");
        publicRepos.innerHTML = "Public repos :" + requestJ.public_repos;
        publicRepos.setAttribute("title", "Show all the public repositories of " + requestJ.login);
        publicRepos.setAttribute("class", "fingerPointer");
        document.getElementById("leftSection").appendChild(userName);
        document.getElementById("leftSection").appendChild(profileLink);
        document.getElementById("leftSection").appendChild(publicRepos);
        userName.addEventListener("click", showOtherInfo);
        publicRepos.addEventListener("click",searchForRepos);
        searchForRepos();//This line triggers the onClick function of the recently created "h3" element which holds the number of public repositories.
    }
    else
        document.getElementById("leftSection").innerHTML = "The username you entered was not found";
    //This function shows all of the informations about the user when clicking on the user's name.
    function showOtherInfo() {
        userName.style.color = "#ffffff";
        publicRepos.style.color = "#000000";
        document.getElementById("centerSection").innerHTML = "";
        var tempString = "";
        document.getElementById("aside").innerHTML = "";
        var tempString = "";
        for (var i in requestJ) {
            tempString += i + ": " + requestJ[i] + "<br>";
        }
        var OtherInfosPar = document.createElement("p");
        document.getElementById("centerSection").appendChild(OtherInfosPar);
        OtherInfosPar.innerHTML = tempString;
    }
    //this function checks if ther are public repositories before sending the repositories request.
    function searchForRepos() {
        if (requestJ.public_repos > 0) {
            userName.style.color = "#000000";
            publicRepos.style.color = "#ffffff";
            document.getElementById("centerSection").innerHTML = "";
            document.getElementById("aside").innerHTML = "";
            makeRequest("https://api.github.com/users/" + requestJ.login + "/repos", showReposList);
        }
    }
}

//This is the callBack function that responses to the result of the public repositories request and renders it.
function showReposList(requestOK, requestReposJ) {
    if (requestOK) {
        var reposList = document.createElement("ul");
        document.getElementById("centerSection").appendChild(reposList);
        var repoItems = [];
        for (var i=0; i<requestReposJ.length; i++) {
            repoItems[i] = document.createElement("li");
            reposList.appendChild(repoItems[i]);
            repoItems[i].innerHTML = requestReposJ[i].name;
            repoItems[i].addEventListener("mouseover", showRepoInfo);
        }
        //This code triggers the onClick function of the first public repository to give the events that are related to it.
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("mouseover", false, true);
            repoItems[0].dispatchEvent(evt);
        }
        else
            repoItems[0].fireEvent("onmouseover");
    }
    else
        document.getElementById("centerSection").innerHTML = "Couldn't find the requested repositories!";

    //I commented this function out so I can override it using the next function (Point 5)
    /*function showRepoInfo(event) {
        for (var i=0; i<repoItems.length; i++)
            repoItems[i].style.color = "#000000";
        event.target.style.color = "#ffffff";
        document.getElementById("aside").innerHTML = "";
        var repoInfoPar = document.createElement("p");
        repoInfoPar.innerHTML = "Created at: " + requestReposJ[repoItems.indexOf(event.target)].created_at + "<br>Open issues: " + requestReposJ[repoItems.indexOf(event.target)].open_issues;
        document.getElementById("aside").appendChild(repoInfoPar);
    }*/

    //This function shows all of the repository events when hovering over it.
    function showRepoInfo(event) {
        for (var i=0; i<repoItems.length; i++)
            repoItems[i].style.color = "#000000";
        event.target.style.color = "#ffffff";
        document.getElementById("aside").innerHTML = "";
        makeRequest("https://api.github.com/repos/" + requestReposJ[repoItems.indexOf(event.target)].owner.login + "/" + requestReposJ[repoItems.indexOf(event.target)].name + "/events", showEventsList);
    }
}

//This is the callBack function that responses to the result of the events request and renders it.
function showEventsList(requestOK, requestEventsJ) {
    if (requestOK) {
        var eventsUList, eventsOListItem, eventsUListItem;
        var eventsOList = document.createElement("ol");
        document.getElementById("aside").appendChild(eventsOList);
        for (var i=0; i<requestEventsJ.length; i++) {
            eventsOListItem = document.createElement("li");
            eventsOList.appendChild(eventsOListItem);
            eventsUList = document.createElement("ul");
            eventsOListItem.appendChild(eventsUList);
            eventsUListItem = document.createElement("li");
            eventsUList.appendChild(eventsUListItem);
            eventsUListItem.innerHTML = "Event type: " + requestEventsJ[i].type;
            if (requestEventsJ[i].type == "PushEvent") {
                eventsUListItem = document.createElement("li");
                eventsUList.appendChild(eventsUListItem);
                eventsUListItem.innerHTML = "Commit message: " + requestEventsJ[i].payload.commits[0].message;
            }
        }
    }
    else
        document.getElementById("aside").innerHTML = "There are no events for the selected repository!";
}