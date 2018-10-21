<!DOCTYPE html>
<html>
  <head>
    <link href='css/main.css' rel='stylesheet' />
    <link href='css/featherlight.css' rel='stylesheet' />
    <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.1.1/firebaseui.css" />
  </head>
  <body>
    <header>
      <nav>
        <input id="questSearch" type='text' placeholder='Search Quests..' /> 
        <input id='search' type='button' value='Search' /> 
        <a href="#" data-featherlight="add_quest.html"><input id='addQuest' type='button' value='Add Quest' style='margin:none' /></a>
        <input id='logout' type='button' value='Sign out' /> 
      </nav>
    </header>
    <br>
    <div id='firebaseui-auth-container'></div>

    <section style='background: #e06b6b; border-color: #c45454'>
      <div class='column'>
        <div class='hori'>
          <div id='welcome'>
            <h1>Welcome!</h1>
            <p>The treasures are waiting and the times are ticking! Keep hunting for treasures to level up. </p>
            <div><div id="progress"></div></div>
          </div>
          <div id='progressQuests'>
            <h1>Quests <span>(in progress)</span></h1>
            <ul></ul>
          </div>
          <div id='completeQuests'>
            <h1>Quests <span>(completed)</span></h1>
            <ul></ul>
          </div>
        </div>
        <div id='quester' style='flex-shrink: 2;'>
          <h1>Trending</h1></br>
          <div></div>
        </div>
      </div>
    </section>

    <section style='background: #6bace0; border-color: #6294bb'>
      <div class='column'>
        <div>
          <h1>Leaderboards</h1>
          <div>
            <table id='leaderboard'>
             <tr style="
    font-weight: bold;">
                <td>Rank</td>
                <td>Username</td>
                <td>Level</td>
                <td>Quests Completed</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>
    <!--The div element for the map -->
    <!--<div id="map"></div>-->
    <!--Load the API from the specified URL
    * The async attribute allows the browser to render the page while the API loads
    * The key parameter will contain your own API key (which is not needed for this tutorial)
    * The callback parameter executes the initMap() function
    -->

    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js' type='text/javascript'></script>
    <script src="https://www.gstatic.com/firebasejs/5.5.5/firebase.js" type='text/javascript'></script>
    <script src="https://cdn.firebase.com/libs/firebaseui/3.1.1/firebaseui.js"></script>
    <script src="https://rawgit.com/kimmobrunfeldt/progressbar.js/1.0.0/dist/progressbar.js" type="text/javascript"></script>
    <script src="js/main.js" type='text/javascript'></script>
    <script>
      $(document).ready(function () {
        Main.activate();
      })
    </script>
    <script src='js/featherlight.js' type='text/javascript'></script>
    <script src='js/maps_setup.js' type='text/javascript'></script>
  </body>
</html>