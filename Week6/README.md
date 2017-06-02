This App
===
makes call requests to 'https://api.github.com' to get all the neaded informations about a user on GitHub. Then renders these informations in understandable way.

It makes requests to:
===
* https://api.github.com/users/(user-name)
* https://api.github.com/users/(user-name)/repos
* https://api.github.com/repos/(user-name)/(repo-name)/events
* https://api.github.com/users/(user-name)/followers
* https://api.github.com/users/(follower-name)/orgs

More details:
===
1. First, it sends the first call to get the general informations (name, profile picture, number of repositories and number of followers).
2. Then, It sends another call to get the names of public repositories.
3. The third step is to send calls for each repository to get the types and messages of all of the events.
4. Next, It sends a call to get the names of public followers.
5. Finally, it sends calls for each follower to get their organizations.

And all the information collected at the top are stored in an array using "map" to be used every time the page is rendered.

In case of error while sending requests, a message appears on the "console" explaining the type of error using "Promises":

```
makeRequest (requestedURL).then(function(json) {
  //code here
}.catch(function(err) {
  console.log(err);
}
```

The App checks every 60 sec for new updates on the requested user's page on GitHub. And if an updates are found, it asks the user to include these updates.

```
var intervalId = setInterval(checkForUpdate, 60000);
function checkForUpdate() {
  makeRequest(requestedURL).then(function(json) {
    if (json.updated_at != userInfo[0].updatedAt) {
      clearInterval(intervalId);
      if (confirm("The data on user's page was updated on GitHub. It's probably better to include these updates. do you want that?")) {
        //code here
      }
    }
  });
}
```

Instructions:
===
* The user first writes in the text field the requested name to search for on GitHub. And then clicks "search" button.
* Then all the neaded informations about a requested name appear in the left panel (name, profile picture, number of repositories and number of followers).
* If the user clicks on the profile picture, it opens the page of that person on GitHub in a new tap.
* If he clicks on "Repositories", a list of all public repositories of that person appears in the center panel.
* If he hovers over a repository from the repositories list the center panel, a list of all events of that repository appears in the right panel.
* If he clicks on "Followers", a list of all followers of that person plus their organizations appears in the center panel.
