var followers, accOrg, requestFollowersArray, requestOrgsArray;
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
                callBackFunction(true, resultJson);
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
        followers = document.createElement("h3");
        followers.innerHTML = "Followers :" + requestJ.followers;
        document.getElementById("leftSection").appendChild(followers);
        //This function trys to send followers request.
        if (requestJ.followers > 0) {
            followers.setAttribute("title", "Show all the followers of " + requestJ.login);
            followers.setAttribute("class", "fingerPointer");
            followers.addEventListener("click", showFollowersList);
            followers.style.display = "none";
            searchBTN.style.display = "none";
            makeRequest("https://api.github.com/users/" + requestJ.login + "/followers", getFollowersList);
        }
        searchForRepos();//This line triggers the onClick function of the recently created "h3" element which holds the number of public repositories.
    }
    else
        document.getElementById("leftSection").innerHTML = "The username you entered was not found";
    //This function shows all of the informations about the user when clicking on the user's name.
    function showOtherInfo() {
        userName.style.color = "#ffffff";
        publicRepos.style.color = "#000000";
        followers.style.color = "#000000";
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
            followers.style.color = "#000000";
            publicRepos.style.color = "#ffffff";
            document.getElementById("centerSection").innerHTML = "";
            document.getElementById("aside").innerHTML = "";
            makeRequest("https://api.github.com/users/" + requestJ.login + "/repos", showReposList);
        }
    }
    function showFollowersList() {
        userName.style.color = "#000000";
        publicRepos.style.color = "#000000";
        followers.style.color = "#ffffff";
        document.getElementById("centerSection").innerHTML = "";
        document.getElementById("aside").innerHTML = "";
        var followerLi, followersUList;
        var followersOList = document.createElement("ol");
        document.getElementById("centerSection").appendChild(followersOList);
        for (var i=0; i<requestFollowersArray.length; i++) {
            followerLi = document.createElement("li");
            followersOList.appendChild(followerLi);
            followerLi.innerHTML = requestFollowersArray[i].followerName;
            followersUList = document.createElement("ul");
            followerLi.appendChild(followersUList);
            for (var j=0; j<requestFollowersArray[i].followerOrgs.length; j++) {
                followerLi = document.createElement("li");
                followersUList.appendChild(followerLi);
                followerLi.innerHTML = requestFollowersArray[i].followerOrgs[j];
            }
        }
        followersOList = document.createElement("ol");
        document.getElementById("aside").appendChild(followersOList);
        for (var i=0; i<requestOrgsArray.length; i++) {
            followerLi = document.createElement("li");
            followersOList.appendChild(followerLi);
            followerLi.innerHTML = requestOrgsArray[i].followerOrgs;
            followersUList = document.createElement("ul");
            followerLi.appendChild(followersUList);
            for (var j=0; j<requestOrgsArray[i].followerName.length; j++) {
                followerLi = document.createElement("li");
                followersUList.appendChild(followerLi);
                followerLi.innerHTML = requestOrgsArray[i].followerName[j];
            }
        }
    }
}

//This is the callBack function that responses to the result of the public repositories request and renders it.
function showReposList(requestOK, requestReposJ) {
    if (requestOK) {
        var reposList = document.createElement("ul");
        document.getElementById("centerSection").appendChild(reposList);
        var repoItems = requestReposJ.map(function(repo) {
            var repoItem = document.createElement("li");
            reposList.appendChild(repoItem);
            repoItem.innerHTML = repo.name;
            repoItem.addEventListener("mouseover", showRepoInfo);
            return repoItem;
        });
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

//This is the callBack function that responses to the results of the followers request and then sends organizations request for each follower.
function getFollowersList(requestOK, requestFollowersJ) {
    if (requestOK) {
        requestFollowersArray = requestFollowersJ.map(function(follower) {
            return {"followerName" : follower.login, "followerOrgs" : []};
        });
        accOrg = 0;
        requestOrgsArray = [];
        makeRequest("https://api.github.com/users/" + requestFollowersArray[accOrg].followerName + "/orgs", getFollowersOrgs);
    }
    else
        document.getElementById("centerSection").innerHTML = "Couldn't find the requested followers!";
}

//This is the callBack function that responses to the results of the organizations request and then sort the results according to 2 categories (organization names and follower names).
function getFollowersOrgs(requestOK, requestOrgsJ) {
    if (requestOK) {
        if (requestOrgsJ.length == 0) {
            requestFollowersArray[accOrg].followerOrgs[0] = "No Organization";
        }
        else {
            requestFollowersArray[accOrg].followerOrgs = requestOrgsJ.map(function(organization) {
                return organization.login;
            });
        }
        accOrg++;
        if (accOrg == requestFollowersArray.length) {
            for (var i=0; i<requestFollowersArray.length; i++) {
                for (var j=0; j<requestFollowersArray[i].followerOrgs.length; j++) {
                    var index = requestOrgsArray.length;
                    if (requestOrgsArray.length > 0) {
                        for (var k=0; k<requestOrgsArray.length; k++) {
                            if (requestOrgsArray[k] == requestFollowersArray[i].followerOrgs[j]) {
                                index = k;
                                break;
                            }
                        }
                    }
                    if (index == requestOrgsArray.length) {
                        requestOrgsArray[index] = {"followerOrgs" : "", "followerName" : []};
                    }
                    requestOrgsArray[index].followerOrgs = requestFollowersArray[i].followerOrgs[j];
                    requestOrgsArray[index].followerName.push(requestFollowersArray[i].followerName);
                }
            }
            searchBTN.style.display = "inline";
            followers.style.display = "block";
        }
        else {
            makeRequest("https://api.github.com/users/" + requestFollowersArray[accOrg].followerName + "/orgs", getFollowersOrgs);
        }
    }
    else
        document.getElementById("centerSection").innerHTML = "Couldn't find the requested organizations!";
}