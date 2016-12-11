# DUNGEONS & MOGETTES                    
 
API RPG game using ASCII to display graphics

## Techno stack
NodeJS 6.9.2
Npm 3.10.9


## Launching project
- npm install
- npm start
- Play the game using a tool such as Postman
- You can also play the game using the minimalist UI running at http://localhost:8080/


## Gameplay
- Register http://localhost:8080/register/{yourname}
- Get the token and use it as a Header such as {"token": "xxxxxtokenkeyxxxx"}
- Use the routes http://localhost:8080/play/ or http://localhost:8080/play/{action} to play
- Don't die


## Documentaion
A swagger describing the API routes is available under doc folder

## Tests
To run tests run command `npm test`