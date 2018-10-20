<!DOCTYPE html>
<html>
  <head>
    <link href='css/main.css' rel='stylesheet' />
    <link href='css/featherlight.css' rel='stylesheet' />
  </head>
  <body>
    <header>
      <nav>
        <input id="questSearch" type='text' placeholder='Search Quests..' /> 
        <input id='search' type='button' value='Search' /> 
        <a href="#" data-featherlight="add_quest.html"><input id='addQuest' type='button' value='Add Quest' style='margin:none' /></a>
      </nav>
    </header>
    <section id='filterbar'>
      
    </section>
    <section id='quester'>
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