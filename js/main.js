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
    let data = {
    	Templates: {
    		make: function (template, data) {
    			return template.replace(/%([^%]+)%/g, function ($1, $2) {
					return data.hasOwnProperty($2) ? data[$2] : undefined;
			    });
    		},
    		questDisplay: `<div>
          		<h1>%title% <div style="float: right;font-size: 14px;"><img src="img/locationmarker.png" width="16" height="16"> %loc%</div></h1>
                <p>%desc%</p>
         	</div>`
    	},
    	activate: function () {
    		database.ref("quests").on('value', function (snapshot) {
    			for (let quest of snapshot.val()) {
    				if (quest != undefined) {
    					let html = data.Templates.make(data.Templates.questDisplay, quest);
    					$('#quester').append(html);
    				}
    			}
    		});
    	}
    }
    return data;
})();