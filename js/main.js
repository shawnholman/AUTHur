const Main = (function () {
	// Initialize Firebase
    let config = {
      apiKey: "AIzaSyAl-6LJeppjxRe5Zs3dmvZv_Lr9Fack4_4",
      authDomain: "ar-geocaching-1540044825986.firebaseapp.com",
      databaseURL: "https://ar-geocaching-1540044825986.firebaseio.com",
      projectId: "ar-geocaching-1540044825986",
      storageBucket: "",
      messagingSenderId: "1005599536256"
    };
    firebase.initializeApp(config);

    let database = firebase.database();

    function attach (event, element, func) {
    	$(document).on(event, element, func);
    }

    function firebaseGet(url, func) {
    	return database.ref(url).on('value', function (snapshot) {
    		func.call(this, snapshot.val());
    	});
    }

    function readableTime (ts) {
	    let adds = (time) => time == 1 ? '' : 's';
		if (ts < 60) {
	        return ts + " seconds";
	    } else if (ts < 3600) {
			return Math.round(ts / 60) + " minute" + adds(ts / 60);
	    } else if (ts < 84600) {
	        return Math.round(ts / 3600) + " hour"  + adds(ts / 3600);
	    } else if (ts < 2622600) {
	        return Math.round(ts / 84600) + " day"  + adds(ts / 84600);
	    } else if (ts < 31536000) {
	        return Math.round(ts / 2622600) + " month"  + adds(ts / 2622600);
	    } else {
	        return Math.round(ts / 31536000) + " year"  + adds(ts / 31536000);
	    }
	}

    let app = {
    	Events: {
    		"click": {
    			"#logout": function () {
    				firebase.auth().signOut().then(function() {
					  location.reload();
					}, function(error) {
					  console.error('Sign Out Error', error);
					});
    			}
    		}
    	},
    	Firebase: {
    		loadQuests: function () {
    			return firebaseGet("quests", function (quests) {
    				for (let quest in quests) {
    					let html = app.Templates.make(app.Templates.questDisplay, quests[quest]);
	    				$('#quester > div').append(html);
    				}
    			});
    		},
    		loadCompletedQuests: function (uid) {
    			return firebaseGet("users/" + uid + "/quests/completed", function (quests) {
    				if (quests == null) $('#completeQuests ul').html('None');
    				for (let quest in quests) {
    					quests[quest].timeCompleted = readableTime (quests[quest].timeCompleted);
    					let html = app.Templates.make(app.Templates.completedQuests, quests[quest]);
	    				$('#completeQuests ul').append(html);
    				}
    			});
    		},
    		loadProgressQuests: function (uid) {
    			return firebaseGet("users/" + uid + "/quests/progress", function (quests) {
    				if (quests == null) $('#progressQuests ul').html('None');
    				for (let quest in quests) {
    					let html = app.Templates.make(app.Templates.progressQuests, quests[quest]);
	    				$('#progressQuests ul').append(html);
    				}
    			});
    		},
    		loadLeaderboard: function () {
    			return database.ref("users").orderByChild("questsCompleted").limitToLast(25).on("value", function (snapshot) {
    				let users = snapshot.val();
    				let rank = 1;

    				for (let user in users) {
    					users[user].rank = rank;
    					let html = app.Templates.make(app.Templates.leaderboardEntry, users[user]);
	    				$('#leaderboard').append(html);

	    				rank++;
    				}
    			});
    		},
    		createLoader: function (uid) {
    			return firebaseGet("users/" + uid, function (user) {
    				firebaseGet("levels/" + user.level, function (level) {
    					app.Progress.createBar({
    						color: level.color,
    						step: function(state, circle) {
						      var value = Math.round(circle.value() * 100) * level.required / 100;
						      circle.setText(value + "/" + level.required);
						    }
    					});
					    app.Progress.bar.animate(user.experience/level.required);
    				});
    			});
    		}
    	},
    	Progress: {
    		bar: null,
	    	createBar: function (options) {
	    		app.Progress.bar = new ProgressBar.Circle(document.getElementById("progress"), {
				    strokeWidth: 20,
				    easing: 'easeInOut',
				    duration: 2400,
				    trailColor: '#eee',
				    trailWidth: 3,
				    svgStyle: null,
				    ...options
				});
	    	}
    	},
    	Templates: {
    		make: function (template, data) {
    			return template.replace(/%([^%]+)%/g, function ($1, $2) {
					return data.hasOwnProperty($2) ? data[$2] : undefined;
			    });
    		},
    		questDisplay: `<div>
          		<h1>%title% <div style="float: right;font-size: 14px;"><img src="img/locationmarker.png" width="16" height="16"> %loc%</div></h1>
                <p>%desc%</p>
         	</div>`,
         	completedQuests: `<li>%title% - <span class='timeconvert'>%timeCompleted%</span> to complete</li>`,
         	progressQuests: `<li>%title% - %artifactsFound%/%totalArtifacts% artifacts found</li>`,
         	leaderboardEntry: `<tr>
                <td>%rank%.</td>
                <td>%email%</td>
                <td>%level%</td>
                <td>%questsCompleted%</td>
              </tr>`
    	},
    	activate: function () {
    		for (let event in app.Events) {
    			for (let target in app.Events[event]) {
    				attach(event, target, app.Events[event][target]);
    			}
    		}

			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
			  	let setup = [
				  	app.Firebase.loadQuests(),
				  	app.Firebase.createLoader(user.uid),
				  	app.Firebase.loadCompletedQuests(user.uid),
				  	app.Firebase.loadProgressQuests(user.uid),
				  	app.Firebase.loadLeaderboard()
			  	];

			  	$('header, #logout').show();
			  	Promise.all(setup).then(function () {
			  		$('#loader').delay(100).fadeOut(250, function () {
			  			$('section').fadeIn(600);
			  		});
			  	});
			  } else {
			  	$('#loader, #logout').hide();
			  	// Initialize the FirebaseUI Widget using Firebase.
			    var ui = new firebaseui.auth.AuthUI(firebase.auth());
			    var uiConfig = {
			    	callbacks: {
					    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
					      // the account was newly created 
					      if (authResult.additionalUserInfo.isNewUser) { // create the record in the database
					      		let user = authResult.user;
					      		database.ref('users/' + user.uid).set({
					      			displayName: user.displayName,
					      			email: user.email,
					      			level: 1,
					      			experience: 0,
					      			questsCompleted: 0,
					      			quests: {
					      				progress: {},
					      				completed: {}
					      			}
					      		});
					      }
					      // User successfully signed in.
					      // Return type determines whether we continue the redirect automatically
					      // or whether we leave that to developer to handle.
					      return false;
					    }
					  },
			    	//signInSuccessUrl: '/public/argeocaching',
					// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
					signInFlow: 'popup',
					signInOptions: [
					  // Leave the lines as is for the providers you want to offer your users.
					  firebase.auth.EmailAuthProvider.PROVIDER_ID
					]
				};
			    ui.start('#firebaseui-auth-container', uiConfig);
			  }
			});
    	}
    }
    return app;
})();