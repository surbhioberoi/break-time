
var validIdleTime = 60*10; // Amount of no activity to be eligible to be called a break
var timeToBreak = 60; // in minutes


// We ask chrome to check that if the computer has been idle for 10 minutes,
// If chrome is lets say used after 8 minutes of break, we will not be notified.
chrome.idle.setDetectionInterval(validIdleTime);

// We ask chrome to notify us when the idle state changes, for example when
// the user locks his computer, or goes away for the time specified in the
// earlier function call i.e. 10 minutes.
chrome.idle.onStateChanged.addListener(checkState);

var activityTime = 0; // Time for which user is active since last break

var notifications = [
	{
			type: 'image',
			title: 'Time to take a break',
			iconUrl: 'icon.png',
			message: 'Time for a coffee break?',
			imageUrl: 'coffee.jpg'
	},
	{
			type: 'image',
			title: 'Time to take a break',
			iconUrl: 'icon.png',
			message: "Let's walk the dog!",
			imageUrl: 'puppy.jpg'
	},
	{
			type: 'image',
			title: 'Time to take a break',
			iconUrl: 'icon.png',
			message: "Hungry yet? Let's grab some snack!",
			imageUrl: 'snack.jpg'
	}
]

var lastNotification = 0;

function getNotification() {
	lastNotification = (lastNotification + 1)%notifications.length;
	return notifications[lastNotification];
}

function checkState (newState) {
	if (newState === 'idle' || newState === 'locked') {
		activityTime = 0;
	}	
}

chrome.alarms.create("timeElapsedUpdate", 
					 {delayInMinutes: 0, periodInMinutes: 1})

chrome.alarms.onAlarm.addListener(updateTimeElapsed);

function updateTimeElapsed (alarm) {
	activityTime += 1;
	checkActivityTime();
}

function checkActivityTime() {
	if (activityTime >= timeToBreak) {
		chrome.notifications.create('1', getNotification());
		activityTime = 0;
	}
}
