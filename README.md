# GameStash Server

## https://gamestash.netlify.app/

<img align="left" src="screenshots\dashboard.png" />
<img align="left" src="screenshots\consolepage.png" />

<p>This is GameStash, an application for keeping track of your game collection!</p>
<p>You can create and delete consoles, and create, edit, and delete games from the global collection (no user authentication at this time).</p>
<p>The dashboard will keep track of how many games you have in your collection, and you can also document what condition your game is in.</p> 
<br/>
<p>This is my first Full Stack PERN application. This is the server side of the application which uses Node and Express to build the API. I am also using PostgreSQL as the
DB and using Knex to make queries. The application also has full "happy path" testing implemented.</p>
<br/>
<p>For API Calls, the main endpoint is /api/v1/ - Here are the following endpoints:</p>

<ul>
<li>/consoles - Will allow you to GET all consoles or POST a console to the DB</li>
<li>/console/:id - Will allow you to GET a console by ID or DELETE a console by ID</li>
<li>/console/:id/addGame - Will allow you to POST a game to a console ID, adding that console ID to the game in the database</li>
<li>/games - Will allow you to GET all games</li>
<li>/games/:id - Will allow you to GET, PATCH, and DELETE a game by ID</li>
</ul>

<p>This was a project for my Thinkful program. We have requirements for the application so between that and the time limit I was under, I was not able to do everything I wanted. In the next version I am planning on adding user authentication and using a 3rd party API for fetching data for games.</p>