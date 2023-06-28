The objective is to build a simple platform to upload and view files:

User authentication via a token
List all files
Upload a new file
Change permission of a file
View a file
Generate thumbnails for images
You will be guided step by step for building it, but you have some freedoms of implementation, split in more files etc… (utils folder will be your friend)

Of course, this kind of service already exists in the real life - it’s a learning purpose to assemble each piece and build a full product.

Enjoy!

Resources
Read or watch:

Node JS getting started
Process API doc
Express getting started
Mocha documentation
Nodemon documentation
MongoDB
Bull
Image thumbnail
Mime-Types
Redis
Learning Objectives
At the end of this project, you are expected to be able to explain to anyone, without the help of Google:

how to create an API with Express
how to authenticate a user
how to store data in MongoDB
how to store temporary data in Redis
how to setup and use a background worker
Requirements
Allowed editors: vi, vim, emacs, Visual Studio Code
All your files will be interpreted/compiled on Ubuntu 18.04 LTS using node (version 12.x.x)
All your files should end with a new line
A README.md file, at the root of the folder of the project, is mandatory
Your code should use the js extension
Your code will be verified against lint using ESLint
Provided files
package.json
Click to show/hide file contents
.eslintrc.js
Click to show/hide file contents
babel.config.js
Click to show/hide file contents
and…
Don’t forget to run $ npm install when you have the package.json

Tasks
0. Redis utils
mandatory
Inside the folder utils, create a file redis.js that contains the class RedisClient.

RedisClient should have:

the constructor that creates a client to Redis:
any error of the redis client must be displayed in the console (you should use on('error') of the redis client)
a function isAlive that returns true when the connection to Redis is a success otherwise, false
an asynchronous function get that takes a string key as argument and returns the Redis value stored for this key
an asynchronous function set that takes a string key, a value and a duration in second as arguments to store it in Redis (with an expiration set by the duration argument)
an asynchronous function del that takes a string key as argument and remove the value in Redis for this key
After the class definition, create and export an instance of RedisClient called redisClient.


===========================================================================================================

Dans le dossier utils, créez un fichier redis.js qui contient la classe RedisClient.

RedisClient doit avoir :

le constructeur qui crée un client Redis :
toute erreur du client Redis doit être affichée dans la console (vous devez utiliser on('error') du client Redis)
une fonction isAlive qui renvoie true si la connexion à Redis est un succès, sinon, false
une fonction asynchrone get qui prend une clé en argument et renvoie la valeur Redis stockée pour cette clé
une fonction asynchrone set qui prend en argument une clé de type chaîne, une valeur et une durée en seconde pour la stocker dans Redis (avec une expiration fixée par l'argument de durée)
une fonction asynchrone del qui prend en argument une clé de type chaîne et supprime la valeur dans Redis pour cette clé.
Après la définition de la classe, créez et exportez une instance de RedisClient appelée redisClient.


bob@dylan:~$ cat main.js
import redisClient from './utils/redis';

(async () => {
    console.log(redisClient.isAlive());
    console.log(await redisClient.get('myKey'));
    await redisClient.set('myKey', 12, 5);
    console.log(await redisClient.get('myKey'));

    setTimeout(async () => {
        console.log(await redisClient.get('myKey'));
    }, 1000*10)
})();

bob@dylan:~$ npm run dev main.js
true
null
12
null
bob@dylan:~$ 
Repo:

GitHub repository: alx-files_manager
File: utils/redis.js
  
1. MongoDB utils
mandatory
Inside the folder utils, create a file db.js that contains the class DBClient.

DBClient should have:

the constructor that creates a client to MongoDB:
host: from the environment variable DB_HOST or default: localhost
port: from the environment variable DB_PORT or default: 27017
database: from the environment variable DB_DATABASE or default: files_manager
a function isAlive that returns true when the connection to MongoDB is a success otherwise, false
an asynchronous function nbUsers that returns the number of documents in the collection users
an asynchronous function nbFiles that returns the number of documents in the collection files
After the class definition, create and export an instance of DBClient called dbClient.


===========================================================================================================

Dans le dossier utils, créez un fichier db.js qui contient la classe DBClient.

DBClient doit avoir :

le constructeur qui crée un client pour MongoDB :
host : de la variable d'environnement DB_HOST ou par défaut : localhost
port : de la variable d'environnement DB_PORT ou par défaut : 27017
database : de la variable d'environnement DB_DATABASE ou par défaut : files_manager
une fonction isAlive qui renvoie true si la connexion à MongoDB est un succès sinon, false
une fonction asynchrone nbUsers qui renvoie le nombre de documents dans la collection users
une fonction asynchrone nbFiles qui renvoie le nombre de documents dans la collection files.
Après la définition de la classe, créez et exportez une instance de DBClient appelée dbClient.


bob@dylan:~$ cat main.js
import dbClient from './utils/db';

const waitConnection = () => {
    return new Promise((resolve, reject) => {
        let i = 0;
        const repeatFct = async () => {
            await setTimeout(() => {
                i += 1;
                if (i >= 10) {
                    reject()
                }
                else if(!dbClient.isAlive()) {
                    repeatFct()
                }
                else {
                    resolve()
                }
            }, 1000);
        };
        repeatFct();
    })
};

(async () => {
    console.log(dbClient.isAlive());
    await waitConnection();
    console.log(dbClient.isAlive());
    console.log(await dbClient.nbUsers());
    console.log(await dbClient.nbFiles());
})();

bob@dylan:~$ npm run dev main.js
false
true
4
30
bob@dylan:~$ 
Repo:

GitHub repository: alx-files_manager
File: utils/db.js
  
2. First API
mandatory
Inside server.js, create the Express server:

it should listen on the port set by the environment variable PORT or by default 5000
it should load all routes from the file routes/index.js
Inside the folder routes, create a file index.js that contains all endpoints of our API:

GET /status => AppController.getStatus
GET /stats => AppController.getStats
Inside the folder controllers, create a file AppController.js that contains the definition of the 2 endpoints:

GET /status should return if Redis is alive and if the DB is alive too by using the 2 utils created previously: { "redis": true, "db": true } with a status code 200
GET /stats should return the number of users and files in DB: { "users": 12, "files": 1231 } with a status code 200
users collection must be used for counting all users
files collection must be used for counting all files


===========================================================================================================

Dans server.js, créez le serveur Express :st

il doit écouter sur le port défini par la variable d'environnement PORT ou par défaut 5000
il doit charger toutes les routes à partir du fichier routes/index.js
Dans le dossier routes, créez un fichier index.js qui contient tous les points de terminaison de notre API :

GET /status => AppController.getStatus
GET /stats => AppController.getStats
Dans le dossier controllers, créez un fichier AppController.js qui contient la définition des 2 endpoints :

GET /status doit retourner si Redis est vivant et si la DB est également vivante en utilisant les 2 utils créés précédemment : { "redis" : true, "db" : true } avec un code de statut 200
GET /stats devrait retourner le nombre d'utilisateurs et de fichiers dans la base de données : { "users" : 12, "files" : 1231 } avec un code d'état 200
la collection des utilisateurs doit être utilisée pour compter tous les utilisateurs
la collection files doit être utilisée pour compter tous les fichiers


Terminal 1:

bob@dylan:~$ npm run start-server
Server running on port 5000
...
Terminal 2:

bob@dylan:~$ curl 0.0.0.0:5000/status ; echo ""
{"redis":true,"db":true}
bob@dylan:~$ 
bob@dylan:~$ curl 0.0.0.0:5000/stats ; echo ""
{"users":4,"files":30}
bob@dylan:~$ 
Repo:

GitHub repository: alx-files_manager
File: server.js, routes/index.js, controllers/AppController.js
  
3. Create a new user
mandatory
Now that we have a simple API, it’s time to add users to our database.

In the file routes/index.js, add a new endpoint:

POST /users => UsersController.postNew
Inside controllers, add a file UsersController.js that contains the new endpoint:

POST /users should create a new user in DB:

To create a user, you must specify an email and a password
If the email is missing, return an error Missing email with a status code 400
If the password is missing, return an error Missing password with a status code 400
If the email already exists in DB, return an error Already exist with a status code 400
The password must be stored after being hashed in SHA1
The endpoint is returning the new user with only the email and the id (auto generated by MongoDB) with a status code 201
The new user must be saved in the collection users:
email: same as the value received
password: SHA1 value of the value received


===========================================================================================================

Maintenant que nous disposons d'une API simple, il est temps d'ajouter des utilisateurs à notre base de données.

Dans le fichier routes/index.js, ajoutez un nouveau point de terminaison :

POST /users => UsersController.postNew
Dans les contrôleurs, ajoutez un fichier UsersController.js qui contient le nouveau point de terminaison :

POST /users devrait créer un nouvel utilisateur dans la base de données :

Pour créer un utilisateur, vous devez spécifier un email et un mot de passe
Si l'email est manquant, le système renvoie une erreur Missing email avec un code de statut 400.
Si le mot de passe est manquant, le système renvoie une erreur Missing password avec un code d'état 400.
Si l'email existe déjà dans la base de données, le système renvoie une erreur Already exist avec un code d'état 400
Le mot de passe doit être stocké après avoir été haché en SHA1
Le point d'accès retourne le nouvel utilisateur avec seulement l'email et l'identifiant (généré automatiquement par MongoDB) avec un code de statut 201.
Le nouvel utilisateur doit être sauvegardé dans la collection users :
email : identique à la valeur reçue
password : valeur SHA1 de la valeur reçue


bob@dylan:~$ curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "bob@dylan.com", "password": "toto1234!" }' ; echo ""
{"id":"5f1e7d35c7ba06511e683b21","email":"bob@dylan.com"}
bob@dylan:~$ 
bob@dylan:~$ echo 'db.users.find()' | mongo files_manager
{ "_id" : ObjectId("5f1e7d35c7ba06511e683b21"), "email" : "bob@dylan.com", "password" : "89cad29e3ebc1035b29b1478a8e70854f25fa2b2" }
bob@dylan:~$ 
bob@dylan:~$ 
bob@dylan:~$ curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "bob@dylan.com", "password": "toto1234!" }' ; echo ""
{"error":"Already exist"}
bob@dylan:~$ 
bob@dylan:~$ curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "bob@dylan.com" }' ; echo ""
{"error":"Missing password"}
bob@dylan:~$ 
Repo:

GitHub repository: alx-files_manager
File: utils/, routes/index.js, controllers/UsersController.js
  
4. Authenticate a user
mandatory
In the file routes/index.js, add 3 new endpoints:

GET /connect => AuthController.getConnect
GET /disconnect => AuthController.getDisconnect
GET /users/me => UserController.getMe
Inside controllers, add a file AuthController.js that contains new endpoints:

GET /connect should sign-in the user by generating a new authentication token:

By using the header Authorization and the technique of the Basic auth (Base64 of the <email>:<password>), find the user associate to this email and with this password (reminder: we are storing the SHA1 of the password)
If no user has been found, return an error Unauthorized with a status code 401
Otherwise:
Generate a random string (using uuidv4) as token
Create a key: auth_<token>
Use this key for storing in Redis (by using the redisClient create previously) the user ID for 24 hours
Return this token: { "token": "155342df-2399-41da-9e8c-458b6ac52a0c" } with a status code 200
Now, we have a way to identify a user, create a token (= avoid to store the password on any front-end) and use this token for 24h to access to the API!

Every authenticated endpoints of our API will look at this token inside the header X-Token.

GET /disconnect should sign-out the user based on the token:

Retrieve the user based on the token:
If not found, return an error Unauthorized with a status code 401
Otherwise, delete the token in Redis and return nothing with a status code 204
Inside the file controllers/UsersController.js add a new endpoint:

GET /users/me should retrieve the user base on the token used:

Retrieve the user based on the token:
If not found, return an error Unauthorized with a status code 401
Otherwise, return the user object (email and id only)


===========================================================================================================

Dans le fichier routes/index.js, ajoutez 3 nouveaux points de terminaison :

GET /connect => AuthController.getConnect
GET /disconnect => AuthController.getDisconnect
GET /users/me => UserController.getMe
Dans les contrôleurs, ajoutez un fichier AuthController.js qui contient de nouveaux points de terminaison :

GET /connect doit connecter l'utilisateur en générant un nouveau jeton d'authentification :

En utilisant l'en-tête Authorization et la technique de l'authentification de base (Base64 du <email>:<password>), trouver l'utilisateur associé à cet email et avec ce mot de passe (rappel : nous stockons le SHA1 du mot de passe)
Si aucun utilisateur n'a été trouvé, retourner une erreur Unauthorized avec un code de statut 401
Sinon :
Générer une chaîne aléatoire (en utilisant uuidv4) comme token
Créer une clé : auth_<token>.
Utiliser cette clé pour stocker dans Redis (en utilisant la commande redisClient create précédemment) l'identifiant de l'utilisateur pendant 24 heures.
Retourner ce token : { "token" : "155342df-2399-41da-9e8c-458b6ac52a0c" } avec un code de statut 200
Maintenant, nous avons un moyen d'identifier un utilisateur, de créer un token (= éviter de stocker le mot de passe sur n'importe quel front-end) et d'utiliser ce token pendant 24h pour accéder à l'API !

Tous les points d'accès authentifiés de notre API regarderont ce jeton dans l'en-tête X-Token.

GET /disconnect devrait déconnecter l'utilisateur sur la base du jeton :

Récupérer l'utilisateur sur la base du jeton :
S'il n'est pas trouvé, il renvoie une erreur "Unauthorized" avec un code d'état 401
Sinon, supprimer le jeton dans Redis et ne rien renvoyer avec un code d'état 204.
Dans le fichier controllers/UsersController.js, ajoutez un nouveau point de terminaison :

GET /users/me devrait récupérer l'utilisateur en fonction du jeton utilisé :

Récupérer l'utilisateur en fonction du jeton :
S'il n'est pas trouvé, il renvoie une erreur "Unauthorized" avec un code de statut 401
Sinon, renvoyer l'objet utilisateur (email et identifiant uniquement).


bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"031bffac-3edc-4e51-aaae-1c121317da8a"}
bob@dylan:~$ 
bob@dylan:~$ curl 0.0.0.0:5000/users/me -H "X-Token: 031bffac-3edc-4e51-aaae-1c121317da8a" ; echo ""
{"id":"5f1e7cda04a394508232559d","email":"bob@dylan.com"}
bob@dylan:~$ 
bob@dylan:~$ curl 0.0.0.0:5000/disconnect -H "X-Token: 031bffac-3edc-4e51-aaae-1c121317da8a" ; echo ""

bob@dylan:~$ curl 0.0.0.0:5000/users/me -H "X-Token: 031bffac-3edc-4e51-aaae-1c121317da8a" ; echo ""
{"error":"Unauthorized"}
bob@dylan:~$ 
Repo:

GitHub repository: alx-files_manager
File: utils/, routes/index.js, controllers/UsersController.js, controllers/AuthController.js
  
5. First file
mandatory
In the file routes/index.js, add a new endpoint:

POST /files => FilesController.postUpload
Inside controllers, add a file FilesController.js that contains the new endpoint:

POST /files should create a new file in DB and in disk:

Retrieve the user based on the token:
If not found, return an error Unauthorized with a status code 401
To create a file, you must specify:
name: as filename
type: either folder, file or image
parentId: (optional) as ID of the parent (default: 0 -> the root)
isPublic: (optional) as boolean to define if the file is public or not (default: false)
data: (only for type=file|image) as Base64 of the file content
If the name is missing, return an error Missing name with a status code 400
If the type is missing or not part of the list of accepted type, return an error Missing type with a status code 400
If the data is missing and type != folder, return an error Missing data with a status code 400
If the parentId is set:
If no file is present in DB for this parentId, return an error Parent not found with a status code 400
If the file present in DB for this parentId is not of type folder, return an error Parent is not a folder with a status code 400
The user ID should be added to the document saved in DB - as owner of a file
If the type is folder, add the new file document in the DB and return the new file with a status code 201
Otherwise:
All file will be stored locally in a folder (to create automatically if not present):
The relative path of this folder is given by the environment variable FOLDER_PATH
If this variable is not present or empty, use /tmp/files_manager as storing folder path
Create a local path in the storing folder with filename a UUID
Store the file in clear (reminder: data contains the Base64 of the file) in this local path
Add the new file document in the collection files with these attributes:
userId: ID of the owner document (owner from the authentication)
name: same as the value received
type: same as the value received
isPublic: same as the value received
parentId: same as the value received - if not present: 0
localPath: for a type=file|image, the absolute path to the file save in local
Return the new file with a status code 201


===========================================================================================================

Dans le fichier routes/index.js, ajoutez un nouveau point de terminaison :

POST /files => FilesController.postUpload
Dans les contrôleurs, ajoutez un fichier FilesController.js qui contient le nouveau point de terminaison :

POST /files doit créer un nouveau fichier dans la base de données et sur le disque :

Récupérer l'utilisateur en se basant sur le jeton :
S'il n'est pas trouvé, il renvoie une erreur Unauthorized avec un code de statut 401.
Pour créer un fichier, vous devez spécifier
nom : comme nom de fichier
type : soit dossier, soit fichier, soit image
parentId : (facultatif) l'ID du parent (par défaut : 0 -> la racine)
isPublic : (facultatif) un booléen pour définir si le fichier est public ou non (par défaut : false)
data : (seulement pour type=file|image) comme Base64 du contenu du fichier
Si le nom est manquant, le système renvoie une erreur Nom manquant avec un code d'état 400.
Si le type est manquant ou ne fait pas partie de la liste des types acceptés, le système renvoie une erreur Missing type avec un code d'état 400
Si les données sont manquantes et que le type != dossier, le système renvoie une erreur Données manquantes avec un code d'état 400
Si le parentId est défini :
Si aucun fichier n'est présent dans la base de données pour ce parentId, le système renvoie une erreur Parent non trouvé avec un code d'état 400.
Si le fichier présent dans la base de données pour ce parentId n'est pas de type dossier, le système renvoie une erreur Parent n'est pas un dossier avec un code d'état 400.
L'identifiant de l'utilisateur doit être ajouté au document enregistré dans la base de données - en tant que propriétaire d'un fichier.
Si le type est dossier, ajouter le nouveau document dans la base de données et renvoyer le nouveau fichier avec un code d'état 201.
Dans le cas contraire :
Tous les fichiers seront stockés localement dans un dossier (à créer automatiquement s'il n'existe pas) :
Le chemin relatif de ce dossier est donné par la variable d'environnement FOLDER_PATH.
Si cette variable n'est pas présente ou si elle est vide, le chemin du dossier de stockage est /tmp/files_manager.
Créer un chemin local dans le dossier de stockage avec un nom de fichier et un UUID
Stocker le fichier en clair (rappel : les données contiennent la Base64 du fichier) dans ce chemin local
Ajouter le nouveau document dans la collection de fichiers avec ces attributs :
userId : ID du document propriétaire (propriétaire à partir de l'authentification)
name : identique à la valeur reçue
type : identique à la valeur reçue
isPublic : identique à la valeur reçue
parentId : identique à la valeur reçue - s'il n'est pas présent : 0
localPath : pour un type=file|image, le chemin absolu vers le fichier enregistré dans local
Retourne le nouveau fichier avec un code d'état 201


bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"f21fb953-16f9-46ed-8d9c-84c6450ec80f"}
bob@dylan:~$ 
bob@dylan:~$ curl -XPOST 0.0.0.0:5000/files -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" -H "Content-Type: application/json" -d '{ "name": "myText.txt", "type": "file", "data": "SGVsbG8gV2Vic3RhY2shCg==" }' ; echo ""
{"id":"5f1e879ec7ba06511e683b22","userId":"5f1e7cda04a394508232559d","name":"myText.txt","type":"file","isPublic":false,"parentId":0}
bob@dylan:~$
bob@dylan:~$ ls /tmp/files_manager/
2a1f4fc3-687b-491a-a3d2-5808a02942c9
bob@dylan:~$
bob@dylan:~$ cat /tmp/files_manager/2a1f4fc3-687b-491a-a3d2-5808a02942c9 
Hello Webstack!
bob@dylan:~$
bob@dylan:~$ curl -XPOST 0.0.0.0:5000/files -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" -H "Content-Type: application/json" -d '{ "name": "images", "type": "folder" }' ; echo ""
{"id":"5f1e881cc7ba06511e683b23","userId":"5f1e7cda04a394508232559d","name":"images","type":"folder","isPublic":false,"parentId":0}
bob@dylan:~$
bob@dylan:~$ cat image_upload.py
import base64
import requests
import sys

file_path = sys.argv[1]
file_name = file_path.split('/')[-1]

file_encoded = None
with open(file_path, "rb") as image_file:
    file_encoded = base64.b64encode(image_file.read()).decode('utf-8')

r_json = { 'name': file_name, 'type': 'image', 'isPublic': True, 'data': file_encoded, 'parentId': sys.argv[3] }
r_headers = { 'X-Token': sys.argv[2] }

r = requests.post("http://0.0.0.0:5000/files", json=r_json, headers=r_headers)
print(r.json())

bob@dylan:~$
bob@dylan:~$ python image_upload.py image.png f21fb953-16f9-46ed-8d9c-84c6450ec80f 5f1e881cc7ba06511e683b23
{'id': '5f1e8896c7ba06511e683b25', 'userId': '5f1e7cda04a394508232559d', 'name': 'image.png', 'type': 'image', 'isPublic': True, 'parentId': '5f1e881cc7ba06511e683b23'}
bob@dylan:~$
bob@dylan:~$ echo 'db.files.find()' | mongo files_manager
{ "_id" : ObjectId("5f1e881cc7ba06511e683b23"), "userId" : ObjectId("5f1e7cda04a394508232559d"), "name" : "images", "type" : "folder", "parentId" : "0" }
{ "_id" : ObjectId("5f1e879ec7ba06511e683b22"), "userId" : ObjectId("5f1e7cda04a394508232559d"), "name" : "myText.txt", "type" : "file", "parentId" : "0", "isPublic" : false, "localPath" : "/tmp/files_manager/2a1f4fc3-687b-491a-a3d2-5808a02942c9" }
{ "_id" : ObjectId("5f1e8896c7ba06511e683b25"), "userId" : ObjectId("5f1e7cda04a394508232559d"), "name" : "image.png", "type" : "image", "parentId" : ObjectId("5f1e881cc7ba06511e683b23"), "isPublic" : true, "localPath" : "/tmp/files_manager/51997b88-5c42-42c2-901e-e7f4e71bdc47" }
bob@dylan:~$
bob@dylan:~$ ls /tmp/files_manager/
2a1f4fc3-687b-491a-a3d2-5808a02942c9   51997b88-5c42-42c2-901e-e7f4e71bdc47
bob@dylan:~$
Repo:

GitHub repository: alx-files_manager
File: utils/, routes/index.js, controllers/FilesController.js
  
6. Get and list file
mandatory
In the file routes/index.js, add 2 new endpoints:

GET /files/:id => FilesController.getShow
GET /files => FilesController.getIndex
In the file controllers/FilesController.js, add the 2 new endpoints:

GET /files/:id should retrieve the file document based on the ID:

Retrieve the user based on the token:
If not found, return an error Unauthorized with a status code 401
If no file document is linked to the user and the ID passed as parameter, return an error Not found with a status code 404
Otherwise, return the file document
GET /files should retrieve all users file documents for a specific parentId and with pagination:

Retrieve the user based on the token:
If not found, return an error Unauthorized with a status code 401
Based on the query parameters parentId and page, return the list of file document
parentId:
No validation of parentId needed - if the parentId is not linked to any user folder, returns an empty list
By default, parentId is equal to 0 = the root
Pagination:
Each page should be 20 items max
page query parameter starts at 0 for the first page. If equals to 1, it means it’s the second page (form the 20th to the 40th), etc…


===========================================================================================================

Dans le fichier routes/index.js, ajoutez 2 nouveaux points de terminaison :

GET /files/:id => FilesController.getShow
GET /files => FilesController.getIndex
Dans le fichier controllers/FilesController.js, ajoutez les 2 nouveaux points de terminaison :

GET /files/:id doit permettre de récupérer le document du fichier en fonction de l'ID :

Récupérer l'utilisateur sur la base du jeton :
S'il n'est pas trouvé, il renvoie une erreur Non autorisé avec un code d'état 401.
Si aucun document de fichier n'est lié à l'utilisateur et à l'ID passé en paramètre, le système renvoie une erreur Non trouvé avec un code d'état 404.
Sinon, renvoyer le document de fichier
GET /files devrait permettre de récupérer tous les documents de fichiers des utilisateurs pour un parentId spécifique et avec pagination :

Récupérer l'utilisateur sur la base du jeton :
S'il n'est pas trouvé, il renvoie une erreur Non autorisé avec un code d'état 401.
Sur la base des paramètres de requête parentId et page, retourner la liste des documents de fichiers
parentId :
Aucune validation de parentId n'est nécessaire - si parentId n'est lié à aucun dossier d'utilisateur, la liste renvoyée est vide.
Par défaut, parentId est égal à 0 = la racine
Pagination :
Chaque page doit contenir 20 éléments au maximum
Le paramètre de requête page commence à 0 pour la première page. S'il est égal à 1, cela signifie qu'il s'agit de la deuxième page (de la 20ème à la 40ème), etc...
La pagination peut être effectuée directement par l'agrégat de MongoDB


Pagination can be done directly by the aggregate of MongoDB
bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"f21fb953-16f9-46ed-8d9c-84c6450ec80f"}
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
[{"id":"5f1e879ec7ba06511e683b22","userId":"5f1e7cda04a394508232559d","name":"myText.txt","type":"file","isPublic":false,"parentId":0},{"id":"5f1e881cc7ba06511e683b23","userId":"5f1e7cda04a394508232559d","name":"images","type":"folder","isPublic":false,"parentId":0},{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}]
bob@dylan:~$
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files?parentId=5f1e881cc7ba06511e683b23 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
[{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}]
bob@dylan:~$
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}
bob@dylan:~$
Repo:

GitHub repository: alx-files_manager
File: utils/, routes/index.js, controllers/FilesController.js
  
7. File publish/unpublish
mandatory
In the file routes/index.js, add 2 new endpoints:

PUT /files/:id/publish => FilesController.putPublish
PUT /files/:id/publish => FilesController.putUnpublish
In the file controllers/FilesController.js, add the 2 new endpoints:

PUT /files/:id/publish should set isPublic to true on the file document based on the ID:

Retrieve the user based on the token:
If not found, return an error Unauthorized with a status code 401
If no file document is linked to the user and the ID passed as parameter, return an error Not found with a status code 404
Otherwise:
Update the value of isPublic to true
And return the file document with a status code 200
PUT /files/:id/unpublish should set isPublic to false on the file document based on the ID:

Retrieve the user based on the token:
If not found, return an error Unauthorized with a status code 401
If no file document is linked to the user and the ID passed as parameter, return an error Not found with a status code 404
Otherwise:
Update the value of isPublic to false
And return the file document with a status code 200


===========================================================================================================

Dans le fichier routes/index.js, ajoutez 2 nouveaux points de terminaison :

PUT /files/:id/publish => FilesController.putPublish
PUT /files/:id/publish => FilesController.putUnpublish
Dans le fichier controllers/FilesController.js, ajoutez les 2 nouveaux endpoints :

PUT /files/:id/publish doit définir isPublic à true sur le document de fichier basé sur l'ID :

Récupérer l'utilisateur en fonction du jeton :
S'il n'est pas trouvé, il renvoie une erreur "Unauthorized" avec un code d'état 401.
Si aucun document de fichier n'est lié à l'utilisateur et à l'ID passé en paramètre, le système renvoie une erreur Non trouvé avec un code d'état 404.
Dans le cas contraire :
Mettre à jour la valeur de isPublic à true
Et renvoyer le document de fichier avec un code d'état 200
PUT /files/:id/unpublish devrait mettre isPublic à false sur le document de fichier basé sur l'ID :

Récupérer l'utilisateur sur la base du jeton :
S'il n'est pas trouvé, il renvoie une erreur "Unauthorized" avec un code d'état 401.
Si aucun document de fichier n'est lié à l'utilisateur et à l'ID passé en paramètre, renvoyer une erreur Non trouvé avec un code d'état 404.
Dans le cas contraire :
Mettre à jour la valeur de isPublic à false
et renvoyer le document de fichier avec un code d'état 200


bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"f21fb953-16f9-46ed-8d9c-84c6450ec80f"}
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":false,"parentId":"5f1e881cc7ba06511e683b23"}
bob@dylan:~$
bob@dylan:~$ curl -XPUT 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/publish -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}
bob@dylan:~$ 
bob@dylan:~$ curl -XPUT 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/unpublish -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":false,"parentId":"5f1e881cc7ba06511e683b23"}
bob@dylan:~$ 
Repo:

GitHub repository: alx-files_manager
File: utils/, routes/index.js, controllers/FilesController.js
  
8. File data
mandatory
In the file routes/index.js, add one new endpoint:

GET /files/:id/data => FilesController.getFile
In the file controllers/FilesController.js, add the new endpoint:

GET /files/:id/data should return the content of the file document based on the ID:

If no file document is linked to the ID passed as parameter, return an error Not found with a status code 404
If the file document (folder or file) is not public (isPublic: false) and no user authenticate or not the owner of the file, return an error Not found with a status code 404
If the type of the file document is folder, return an error A folder doesn't have content with a status code 400
If the file is not locally present, return an error Not found with a status code 404
Otherwise:
By using the module mime-types, get the MIME-type based on the name of the file
Return the content of the file with the correct MIME-type


===========================================================================================================

Dans le fichier routes/index.js, ajoutez un nouveau point d'arrivée :

GET /files/:id/data => FilesController.getFile
Dans le fichier controllers/FilesController.js, ajoutez le nouveau point de terminaison :

GET /files/:id/data doit renvoyer le contenu du document du fichier basé sur l'ID :

Si aucun document de fichier n'est lié à l'ID passé en paramètre, il renvoie une erreur Non trouvé avec un code d'état 404.
Si le document de fichier (dossier ou fichier) n'est pas public (isPublic : false) et qu'aucun utilisateur ne s'est authentifié ou qu'il n'est pas le propriétaire du fichier, le système renvoie une erreur Non trouvé avec un code d'état 404.
Si le type du document de fichier est un dossier, le système renvoie une erreur Un dossier n'a pas de contenu avec un code d'état 400.
Si le fichier n'est pas présent localement, le système renvoie une erreur Non trouvé avec un code d'état 404.
Dans le cas contraire :
En utilisant le module mime-types, obtenir le type MIME basé sur le nom du fichier.
Renvoyer le contenu du fichier avec le bon type MIME.


bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"f21fb953-16f9-46ed-8d9c-84c6450ec80f"}
bob@dylan:~$ 
bob@dylan:~$ curl -XPUT 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/unpublish -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e879ec7ba06511e683b22","userId":"5f1e7cda04a394508232559d","name":"myText.txt","type":"file","isPublic":false,"parentId":0}
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/data -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
Hello Webstack!

bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/data ; echo ""
{"error":"Not found"}
bob@dylan:~$ 
bob@dylan:~$ curl -XPUT 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/publish -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e879ec7ba06511e683b22","userId":"5f1e7cda04a394508232559d","name":"myText.txt","type":"file","isPublic":true,"parentId":0}
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/data ; echo ""
Hello Webstack!

bob@dylan:~$
Repo:

GitHub repository: alx-files_manager
File: utils/, routes/index.js, controllers/FilesController.js
 
9. Image Thumbnails
mandatory
Update the endpoint POST /files endpoint to start a background processing for generating thumbnails for a file of type image:

Create a Bull queue fileQueue
When a new image is stored (in local and in DB), add a job to this queue with the userId and fileId
Create a file worker.js:

By using the module Bull, create a queue fileQueue
Process this queue:
If fileId is not present in the job, raise an error Missing fileId
If userId is not present in the job, raise an error Missing userId
If no document is found in DB based on the fileId and userId, raise an error File not found
By using the module image-thumbnail, generate 3 thumbnails with width = 500, 250 and 100 - store each result on the same location of the original file by appending _<width size>
Update the endpoint GET /files/:id/data to accept a query parameter size:

size can be 500, 250 or 100
Based on size, return the correct local file
If the local file doesn’t exist, return an error Not found with a status code 404
Terminal 3: (start the worker)


===========================================================================================================

Mise à jour du point de terminaison POST /files pour lancer un traitement en arrière-plan afin de générer des vignettes pour un fichier de type image :

Créer une file d'attente Bull fileQueue
Lorsqu'une nouvelle image est stockée (en local et dans la base de données), ajouter un travail à cette file avec l'identifiant de l'utilisateur et l'identifiant du fichier.
Créer un fichier worker.js :

En utilisant le module Bull, créer une file d'attente fileQueue
Traiter cette file d'attente :
Si fileId n'est pas présent dans le job, lever une erreur Missing fileId
Si userId n'est pas présent dans le job, lever une erreur Missing userId
Si aucun document n'est trouvé dans la base de données en fonction du fileId et du userId, l'erreur File not found est levée.
En utilisant le module image-thumbnail, générer 3 vignettes avec largeur = 500, 250 et 100 - stocker chaque résultat au même endroit que le fichier original en ajoutant _<taille de la largeur>.
Mettre à jour le point de terminaison GET /files/:id/data pour accepter un paramètre de requête taille :

size peut être 500, 250 ou 100
En fonction de la taille, renvoyer le fichier local correct
Si le fichier local n'existe pas, renvoyer une erreur Non trouvé avec un code d'état 404.


bob@dylan:~$ npm run start-worker
...
Terminal 2:

bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"f21fb953-16f9-46ed-8d9c-84c6450ec80f"}
bob@dylan:~$ 
bob@dylan:~$ python image_upload.py image.png f21fb953-16f9-46ed-8d9c-84c6450ec80f 5f1e881cc7ba06511e683b23
{'id': '5f1e8896c7ba06511e683b25', 'userId': '5f1e7cda04a394508232559d', 'name': 'image.png', 'type': 'image', 'isPublic': True, 'parentId': '5f1e881cc7ba06511e683b23'}
bob@dylan:~$ ls /tmp/files_manager/
2a1f4fc3-687b-491a-a3d2-5808a02942c9   51997b88-5c42-42c2-901e-e7f4e71bdc47   6dc53397-8491-4b7c-8273-f748b1a031cb   6dc53397-8491-4b7c-8273-f748b1a031cb_100   6dc53397-8491-4b7c-8273-f748b1a031cb_250    6dc53397-8491-4b7c-8273-f748b1a031cb_500
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/data -so new_image.png ; file new_image.png
new_image.png: PNG image data, 471 x 512, 8-bit/color RGBA, non-interlaced
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/data?size=100 -so new_image.png ; file new_image.png
new_image.png: PNG image data, 100 x 109, 8-bit/color RGBA, non-interlaced
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/data?size=250 -so new_image.png ; file new_image.png
new_image.png: PNG image data, 250 x 272, 8-bit/color RGBA, non-interlaced
bob@dylan:~$
Repo:

GitHub repository: alx-files_manager
File: utils/, controllers/FilesController.js, worker.js
 
10. Tests!
#advanced
Of course, a strong and stable project can not be good without tests.

Create tests for redisClient and dbClient.

Create tests for each endpoints:

GET /status
GET /stats
POST /users
GET /connect
GET /disconnect
GET /users/me
POST /files
GET /files/:id
GET /files (don’t forget the pagination)
PUT /files/:id/publish
PUT /files/:id/unpublish
GET /files/:id/data
Repo:

GitHub repository: alx-files_manager
File: tests/
 
11. New user - welcome email
#advanced
Update the endpoint POST /users endpoint to start a background processing for sending a “Welcome email” to the user:

Create a Bull queue userQueue
When a new user is stored (in DB), add a job to this queue with the userId
Update the file worker.js:

By using the module Bull, create a queue userQueue
Process this queue:
If userId is not present in the job, raise an error Missing userId
If no document is found in DB based on the userId, raise an error User not found
Print in the console Welcome <email>!
In real life, you can use a third party service like Mailgun to send real email. These API are slow, (sending via SMTP is worst!) and sending emails via a background job is important to optimize API endpoint.


===========================================================================================================

Mise à jour du point de terminaison POST /users afin de lancer un traitement en arrière-plan pour l'envoi d'un "Welcome email" à l'utilisateur :

Créer une file d'attente Bull userQueue
Lorsqu'un nouvel utilisateur est enregistré (dans la base de données), ajouter un travail à cette file d'attente avec l'identifiant de l'utilisateur.
Mettre à jour le fichier worker.js :

En utilisant le module Bull, créer une file d'attente userQueue
Traiter cette file d'attente :
Si l'identifiant de l'utilisateur n'est pas présent dans le travail, générer une erreur Missing userId
Si aucun document n'est trouvé dans la base de données sur la base de l'ID utilisateur, l'erreur User not found est levée.
Imprimer dans la console Bienvenue <email> !
Dans la vraie vie, vous pouvez utiliser un service tiers comme Mailgun pour envoyer de vrais courriels. Ces API sont lentes, (l'envoi via SMTP est le pire !) et l'envoi d'emails via un job d'arrière-plan est important pour optimiser le point de terminaison de l'API.


Repo:

GitHub repository: alx-files_manager
File: utils/, worker.js, controllers/UsersController.js
 
Copyright © 2023 ALX, All rights reserved.