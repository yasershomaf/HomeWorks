window.onload = function() {
    document.getElementById("leftLoader").style.height = document.getElementById("leftLoader").offsetWidth + "px";
    document.getElementById("rightLoader").style.height = document.getElementById("rightLoader").offsetWidth + "px";
    document.getElementById("centerLoader").style.height = document.getElementById("centerLoader").offsetWidth + "px";
    var reposList, repoItems, followers, publicRepos, intervalId;
    var userInfo = [];
    var oldRequest = "";
    document.getElementById("inputField").value = "yasershomaf";
    document.getElementById("searchBTN").addEventListener("click", getInputField);
    getInputField();//This line runs the click listener of the search button to get my profile from GitHub.
    
    //This function makes sure that the text field is not empty before reseting the page, and then makes all the neaded requests to GitHub API.
    function getInputField() {
        if (document.getElementById("inputField").value != "" && document.getElementById("inputField").value != oldRequest) {
            clearInterval(intervalId);
            document.getElementById("searchBTN").classList.add("invisible");//To hide the search button until all requests have been completed. 
            oldRequest = document.getElementById("inputField").value;
            document.getElementById("leftArticle").innerHTML = "";
            document.getElementById("centerArticle").innerHTML = "";
            document.getElementById("rightArticle").innerHTML = "";
            document.getElementById("leftLoader").classList.remove("invisible");//To show the loader icon while making requests.
            document.getElementById("centerLoader").classList.remove("invisible");//To show the loader icon while making requests.
            document.getElementById("rightLoader").classList.remove("invisible");//To show the loader icon while making requests.
            var userURL = "https://api.github.com/users/" + oldRequest;
            makeRequest(userURL).then(function(resultJson) {
                userInfo = [{name : "", profileImageURL : "", publicRepos : 0, followers : 0}];
                userInfo[0].name = resultJson.login;
                userInfo[0].profileImageURL = resultJson.avatar_url;
                userInfo[0].publicRepos = resultJson.public_repos;
                userInfo[0].followers = resultJson.followers;
                userInfo[0].updatedAt = resultJson.updated_at;
                document.getElementById("leftLoader").classList.add("invisible");//To hide the first loader icon.
                var userName = document.createElement("h2");
                userName.innerHTML = userInfo[0].name;
                document.getElementById("leftArticle").appendChild(userName);
                var profileLink = document.createElement("a");
                profileLink.setAttribute("href", "https://github.com/" + userInfo[0].name);
                profileLink.setAttribute("target", "_blank");
                document.getElementById("leftArticle").appendChild(profileLink);
                var avatarImage = document.createElement("img");
                avatarImage.setAttribute("alt", "The avatar image of " + userInfo[0].name);
                avatarImage.setAttribute("src", userInfo[0].profileImageURL);
                avatarImage.setAttribute("title", "Visit the page of " + userInfo[0].name + " on GitHub");
                profileLink.appendChild(avatarImage);
                publicRepos = document.createElement("h3");
                publicRepos.innerHTML = "Public repos : " + userInfo[0].publicRepos;
                document.getElementById("leftArticle").appendChild(publicRepos);
                followers = document.createElement("h3");
                followers.innerHTML = "Followers : " + userInfo[0].followers;
                document.getElementById("leftArticle").appendChild(followers);
                if (userInfo[0].publicRepos > 0) {
                    //The next code is to send request to get the public Repositories.
                    makeRequest("https://api.github.com/users/" + oldRequest + "/repos").then(function(resultJson) {
                        userInfo[1] = [];
                        userInfo[1] = resultJson.map(function(repo) {
                            var repoItem = [repo.name, []];
                            //The next code is to send request to get the events for each public Repository.
                            makeRequest("https://api.github.com/repos/" + oldRequest + "/" + repo.name + "/events").then(function(eventsJson) {
                                repoItem[1] = eventsJson.map(function(event) {
                                    if(event.type == "PushEvent") {
                                        return {type : event.type, message : event.payload.commits[0].message};
                                    }
                                    else {
                                        return {type : event.type, message : false};
                                    }
                                });
                                document.getElementById("rightLoader").classList.add("invisible");//To hide the third loader icon.
                            }).catch(function(err) {
                                console.log(err);
                            });
                            return repoItem;
                        });
                        document.getElementById("centerLoader").classList.add("invisible");//To hide the second loader icon.
                        showReposList();//This line triggers the onClick function of the "h3" element which holds the number of public repositories.
                        publicRepos.setAttribute("title", "Show all the public repositories of " + userInfo[0].name);
                        publicRepos.classList.add("fingerPointer");
                        publicRepos.addEventListener("click",showReposList);//This line sets the onClick listener of the "h3" element which holds the number of public repositories.
                    }).catch(function(err) {
                        console.log(err);
                    });
                }
                if (userInfo[0].followers > 0) {
                    //The next code is to send request to get the followers.
                    makeRequest("https://api.github.com/users/" + oldRequest + "/followers").then(function(resultJson) {
                        userInfo[2] = [];
                        userInfo[2] = resultJson.map(function(follower) {
                            var followerItem = [follower.login, ["No Organization"]];
                            //The next code is to send requests to get all of the organizations for each followers.
                    console.log("https://api.github.com/users/" + follower.login + "/orgs");
                            makeRequest("https://api.github.com/users/" + follower.login + "/orgs").then(function(orgsJson) {
                                followerItem[1] = orgsJson.map(function(organization) {
                                    return organization.login;
                                });
                            });
                        });
                        followers.setAttribute("title", "Show all the Followers of " + userInfo[0].name);
                        followers.classList.add("fingerPointer");
                        followers.addEventListener("click",showFollowersList);//This line sets the onClick listener of the "h3" element which holds the number of the followers.
                    }).catch(function(err) {
                        console.log(err);
                    });
                }
                console.log(userInfo);
            }).catch(function(err) {
                console.log(err);
            });
            document.getElementById("searchBTN").classList.remove("invisible");//To show the search button again after all requests have been completed.
            intervalId = setInterval(checkForUpdate, 60000);
        }
    }
    
    //This function is a general function for making requests to GitHub API, and then returns the result of the request.
    function makeRequest(requestURL) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest;
            xhr.open("Get", requestURL, true);
            xhr.onreadystatechange = processRequest;
            function processRequest() {
                if (xhr.readyState == 4) {
                    var resultJson = JSON.parse(xhr.response);
                    if (resultJson.hasOwnProperty("message")) {
                        reject(resultJson.message);
                    }
                    else {
                        resolve(resultJson);
                    }
                }
            }
            xhr.send();
        });
    }
    
    //This function renders the repositories list to the DOM.
    function showReposList() {
        followers.style.color = "#000000";
        publicRepos.style.color = "#ffffff";
        document.getElementById("centerArticle").innerHTML = "";
        reposList = document.createElement("ul");
        document.getElementById("centerArticle").appendChild(reposList);
        repoItems = [];
        for (var i=0; i<userInfo[1].length; i++) {
            repoItems[i] = document.createElement("li");
            reposList.appendChild(repoItems[i]);
            repoItems[i].innerHTML = userInfo[1][i][0];
            repoItems[i].addEventListener("mouseover", showRepoInfo);//set listener for each repository.
            repoItems[i].classList.add("fingerPointer");
        }
        //Next code triggers the onClick listener of the first public repository to give the events that are related to it.
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("mouseover", false, true);
            repoItems[0].dispatchEvent(evt);
        }
        else {
            repoItems[0].fireEvent("onmouseover");
        }
    }
    
    //This function renders the repository events list to the DOM when hovering over the repository.
    function showRepoInfo(event) {
        for (var i=0; i<repoItems.length; i++) {
            repoItems[i].style.color = "#000000";
        }
        event.target.style.color = "#ffffff";
        document.getElementById("rightArticle").innerHTML = "";
        var eventsOListItem, eventsUList, eventsUListItem;
        var eventsOList = document.createElement("ol");
        document.getElementById("rightArticle").appendChild(eventsOList);
        for (var i=0; i<userInfo[1][repoItems.indexOf(event.target)][1].length; i++) {
            eventsOListItem = document.createElement("li");
            eventsOList.appendChild(eventsOListItem);
            eventsUList = document.createElement("ul");
            eventsOListItem.appendChild(eventsUList);
            eventsUListItem = document.createElement("li");
            eventsUList.appendChild(eventsUListItem);
            eventsUListItem.innerHTML = "Event type: " + userInfo[1][repoItems.indexOf(event.target)][1][i].type;
            if (userInfo[1][repoItems.indexOf(event.target)][1][i].type == "PushEvent") {
                eventsUListItem = document.createElement("li");
                eventsUList.appendChild(eventsUListItem);
                eventsUListItem.innerHTML = "Commit message: " + userInfo[1][repoItems.indexOf(event.target)][1][i].message;
            }
        }
    }

    //This function renders the followers list to the DOM.
    function showFollowersList() {
        followers.style.color = "#ffffff";
        publicRepos.style.color = "#000000";
        document.getElementById("centerArticle").innerHTML = "";
        document.getElementById("rightArticle").innerHTML = "";
        var followerUList, followerUListItem, followerOList, followerOListItem;
        followerOList = document.createElement("ol");
        document.getElementById("centerArticle").appendChild(followerOList);
        for (var i=0; i<userInfo[2].length; i++) {
            followerOListItem = document.createElement("li");
            followerOList.appendChild(followerOListItem);
            followerOListItem.innerHTML = userInfo[2][i][0];
            followerUList = document.createElement("ul");
            followerOListItem.appendChild(followerUList);
            for (var j=0; j<userInfo[2][i][1].length; j++) {
                followerUListItem = document.createElement("li");
                followerUList.appendChild(followerUListItem);
                followerUListItem.innerHTML = userInfo[2][i][1][j];
            }
        }
    }
    
    //This is a function that informs the user if the requested page is updated.
    function checkForUpdate() {
        makeRequest("https://api.github.com/users/" + oldRequest).then(function(polJson) {
            if (polJson.updated_at != userInfo[0].updatedAt) {
                clearInterval(intervalId);
                if (confirm("The data on " + userInfo[0].name + "'s page was updated on GitHub. It's probably better to include these updates. do you want that?")) {
                    getInputField();
                }
            }
        }).catch(function(err) {
            console.log(err);
        });
    }
}