var token, userId;
var options = [];

// so we don't have to write this out everytime #efficency
const twitch = window.Twitch.ext;
const url = "https://en-passant.replit.app/ext/"


// callback called when context of an extension is fired 
twitch.onContext((context) => {
  console.log(context);
});


// onAuthorized callback called each time JWT is fired
twitch.onAuthorized((auth) => {
  // save our credentials
  token = auth.token; //JWT passed to backend for authentication 
  userId = auth.userId; //opaque userID 

});


const emojis = p => ({ off: '🔴', on: '🟢' }[p]); // emojis used to show if an option is used or not

let queue;  //declaring these variables but they are only used within the queueCheck() function
let challenge;  //could be placed within the function with no loss of functionality
let subonly;
let list;

//queueCheck is a function that calls on the backend to fetch the queue of viewer to play with Zach
//this queue is available at https://en-passant.replit.app/queue/
//because this queue is not always live or available, perhaps it would be better to adjust the rate at which this extension calls for the list?
//=== also /need/ to handle the list variable -- when there is no queue, list comes back undefined, so the html replacement that is called
//will populate an error.

async function queueCheck() {
  response = await fetch(url, { //fetching from the en-passant-twitch backend, expecting a json object of the queue
    method: "GET",
    mode: "cors",
    url: url,
    contentType: 'application/json',
    headers: {
      "Authorization": "Bearer" + token,
      "Content-Type": "application/json",
    }
  })
    .then(response => response.json())
    .then(data => {
      queue = data.queue;
      challenge = data.challenge;
      subonly = data.sub_only;
      list = data.list ? data.list : null; //not sure if this works,

      document.getElementById('status').innerHTML = `
	<b>Queue</b> ${emojis(queue)}
	<b class="pl-5">Sub-only</b> ${emojis(subonly)}
	<b class="pl-5">Challenge</b> ${emojis(challenge)}`;

      if (list != null) {
        document.getElementById('list').innerHTML = list.map(
          (m, i) => `<tr class="bg-black even:bg-opacity-20 odd:bg-opacity-30">
	<td class="px-6 py-4 text-center whitespace-nowrap font-mono">${i + 1}</td>
	<td class="px-6 py-4 text-center whitespace-nowrap font-mono"><a href="https://www.twitch.tv/${m.user}" target="_blank"><code class="text-purple">@${m.user}</code></a></td>
	<td class="px-6 py-4 text-center whitespace-nowrap font-mono"><a href="https://www.chess.com/member/${m.profile}" target="_blank"><code class="text-green">${m.profile}</code></a></td>
</tr>`).join('\n');
      }

    });
  return
}

setInterval(queueCheck(), 60 * 5 * 1000);





