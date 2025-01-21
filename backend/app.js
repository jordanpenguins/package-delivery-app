// Initial Setup
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const driverController = require('./controllers/driver-controller');
const packageController = require('./controllers/package-controller');
const print = console.log
let app = express();
const DRIVER_VIEWS_PATH = path.join(__dirname, "/views/view_driver/"); //Important
const PACKAGE_VIEWS_PATH = path.join(__dirname, "/views/view_package/");
const VIEWS_PATH = path.join(__dirname, "/views/")
const { ObjectId } = require('mongodb');
const cors = require('cors');
const {Translate} = require('@google-cloud/translate').v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Insert API KEY HERE
const gemini_api_key = "";

const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const fs = require('fs')

// Imports the Google Cloud client library
const textToSpeech = require("@google-cloud/text-to-speech");

// Creates a client
const client = new textToSpeech.TextToSpeechClient();
const translate = new Translate();


//Setup the static assets directories
app.use(express.static('images'));
app.use(express.static('css'));
app.use('/audio', express.static(path.join(__dirname, 'audio')));

// Gemini API
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,  
};
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});



// Initialise socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["*"]
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('text-to-speech', async (text) => {
    const request = {
      input: { text: text },
      // Select the language and SSML Voice Gender (optional)
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      // Select the type of audio encoding
      audioConfig: { audioEncoding: "MP3" },
    };
    
    // Performs the Text-to-Speech request
    client.synthesizeSpeech(request, (err, response) => {
      if (err) {
        console.error("ERROR:", err);
        return;
      }

      
      const AUDIO_PATH = path.join(__dirname, 'audio');
      const outputFile = path.join(AUDIO_PATH, 'output.mp3');
      // Write the binary audio content to a local file
      fs.writeFile(outputFile, response.audioContent, "binary", err => {
        if (err) {
          console.error("ERROR:", err);
          return;
        }
        console.log("Audio content written to file: output.mp3");
        // send the audio url so that the client can play the audio
        const timestamp = new Date().getTime();
        const audioUrl = '/audio/output.mp3?timestamp=' + timestamp;
        socket.emit('text-to-speech-success', audioUrl);
      });
    });
  });


  socket.on('translate', async (data) => {
    
    const { text, language } = data;

    if (!language) {
      console.error('Language is required');
      socket.emit('translate-fail', 'Language is required');
      return;
    }


    console.log('Translating:', text, 'to', language);
    try {
      const [translations] = await translate.translate(text, language);
      const translatedText = Array.isArray(translations) ? translations : [translations];
      console.log('Translations:', translatedText);
      socket.emit('translate-success', { originalText: text, translatedText: translatedText[0], language });
    } catch (error) {
      console.error("ERROR:", error);
      socket.emit('translate-fail', 'Failed to translate text');
    }
  });
  
  // Handle Gemini API requests
  socket.on('get-distance', async (data) => {
    const prompt = data;
    console.log(prompt)

    if (!prompt) {
      console.error('Prompt is required');
      socket.emit('generate-text-fail', 'Prompt is required');
      return;
    }

    console.log('Generating text for prompt:', prompt);
    try {
      const response = await (await geminiModel.generateContent(`calculate the distance from melbourne to ${prompt}, IMPORTANT: only give the distance and in km e.g. '10km'`)).response.candidates[0].content.parts[0].text;
      socket.emit('generate-text-success', response);
      
    } catch (error) {
      console.error("ERROR:", error);
      socket.emit('generate-text-fail', 'Failed to generate text');
    }
  });
});


//fire base db  
const firebase = require('./firebase')
const docRef = firebase.db.collection('data').doc('stats');


app.use(express.static('./dist/assignment-3/browser'));  


//authentication 
const auth = require('./auth')


// Mongoose 
const Driver = require('./models/driver');
const Package = require('./models/package');

const PORT_NUMBER = 8080;

const BASE_PATH = '33787778/Jordan';







// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
// parse application/json
app.use(express.json())
//bootstrap
app.use(express.static("node_modules/bootstrap/dist/css"));
app.use(express.static("node_modules/bootstrap/dist/js"));






app.set('views', [VIEWS_PATH, DRIVER_VIEWS_PATH, PACKAGE_VIEWS_PATH]);

//mongoose remote vm 
// let url = "mongodb://10.192.0.3:27017/assignment3app";

//local db
let url = "mongodb://localhost:27017/assignment3app";


async function connect() {
	await mongoose.connect(url);
}

connect();





// Data
let filtered_driver_db = [];
// let filtered_driver_db = [];



/**
 * Display the home page
 * 
 * @name get/
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

app.get('/',async  function (req, res) {
    //implement total count
    const data = {
      totalDrivers: await Driver.countDocuments(),
      totalPackages: await Package.countDocuments()
    }
    res.render("index.html", {data: data});
  });


/**
 * Display all crud operations count
 * 
 * @name get/stats
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 */

// display all crud operations count
app.get(`/${BASE_PATH}/stats`,auth.isAuthenticatedMiddleware, async function (req,res) {
  const doc = await docRef.get()
  const currentData = doc.data();
  res.render("stats.html", {stats: currentData})
})

// API to display the crud operations 

app.get(`/${BASE_PATH}/api/v1/stats`, async function (req,res) { 

  try {
    const doc = await docRef.get()
    const currentData = doc.data();

    res.status(200).json({
      "insert": currentData.insert,
      "retrieve" : currentData.retrieve,
      "update" : currentData.update,
      "delete" : currentData.delete,
    });

  } catch (error) {
    res.status(400).send(error)
  }
  

  
});






/**
 * 
 * Display the sign up page
 * 
 * @name get/signup
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
app.get(`/${BASE_PATH}/signup`, function (req,res) {
  res.render("signup.html")
})



/**
 * 
 * POST request to sign up a new user
 * 
 * @name post/signup
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 */

app.post(`/${BASE_PATH}/signup`, async function (req,res) {
  const userRef = firebase.db.collection('users').doc()
  const {username, password, confirmPassword } = req.body;
  // sign up
  // a to z, A to Z, 0 to 9, 6 characters or more
  const userNameRegex = /^[a-zA-Z0-9]{6,}$/;
  // password length between 5 and 20
  const passwordlength = password.length >= 5 && password.length <= 20;


  if (!username || !password || !confirmPassword || password !== confirmPassword) {
    return res.render('invalid_data.html');
  }

  if (!userNameRegex.test(username)) {
    return res.render('invalid_data.html');
  }

  if (!passwordlength) {
    return res.render('invalid_data.html');
  }

  // check for existing user 
  const doc = await userRef.get();
  if (doc.exists){
    res.send("Username and password already exist")
  }

  await userRef.set({username: username , password: password})
  res.redirect("/33787778/Jordan/login");
})

/**
 * 
 * Logout the user
 * 
 * @name get/logout
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 */
//logout
app.get(`/${BASE_PATH}/logout`, function (req,res) {
  auth.setAuthenticated(false);
  res.redirect('/')
})


// login page

/**
 * Display the login page
 * 
 * @name get/login
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 */

app.get(`/${BASE_PATH}/login`, async function (req,res) {
  res.render("login.html")
})

// login post request

/**
 * POST request to login the user
 * 
 * @name post/login
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 */

app.post(`/${BASE_PATH}/login`, async function (req,res) {

  const data = await firebase.db.collection('users').get();
  
  // access the docs to access the array of QueryDocumentSnapshot 
  // forEach has a iterable method which allows you access query documentSnapshot directly
  const isAuthenticated = data.docs.some((doc) => {
    const userData = doc.data(); // JSON object
    return req.body.username === userData.username && req.body.password === userData.password;
  });


  auth.setAuthenticated(isAuthenticated)
  // all the users 
  auth.getAuthenticated() ? res.redirect('/') : res.render("invalid_data.html")
  
  
})


//API ENDPOINTS FOR SIGN UP AND LOGIN FEAUTRES 


/**
 * POST request to sign up a new user through the API
 * 
 * @name post/api/v1/signup
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

// sign up
app.post(`/${BASE_PATH}/api/v1/signup`, async function (req,res) {
  const userRef = firebase.db.collection('users').doc()
  const {username, password, confirmPassword } = req.body;
  // sign up
  if (!username || !password || !confirmPassword || password !== confirmPassword) {
    return res.json({
      status: "Invalid data"
    });
  }

  if (password.length < 5 || password.length > 20) {
    return res.json({
      status: "Invalid data"
    });
  }

  validateUsername = /^[a-zA-Z0-9]{6,}$/;
  if (!validateUsername.test(username)) {
    return res.json({
      status: "Invalid data"
    });
  }


  // check for existing user 
  const doc = await userRef.get();
  if (doc.exists){
    res.json({
      status: "Username and password already exist"
    })
    return;
  }

  await userRef.set({username: username , password: password})
  res.json({
    status: "Sign up successfully",
  })
})

//login 


/**
 * POST request to login the user through the API
 * 
 * @name post/api/v1/login
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 */
app.post(`/${BASE_PATH}/api/v1/login`, async function (req,res) {
  
    const data = await firebase.db.collection('users').get();
    const isAuthenticated = data.docs.some((doc) => {
      const userData = doc.data(); // JSON object
      return req.body.username === userData.username && req.body.password === userData.password;
    });
  
  
    auth.setAuthenticated(isAuthenticated)
    // all the users 
    auth.getAuthenticated() ? res.json({
      status: "Login successfully"
    }) : res.json({
      status: "Invalid data"
    })
    
  });


//---DRIVERS--

//API ENDPOINTS

// json 


/** 
 *  Insert a new driver through the API (View driver-controller.js for more details)
 * 
 * @name post/api/v1/drivers/add
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 * 
*/

//insert driver
app.post(`/${BASE_PATH}/api/v1/drivers/add`,driverController.insertDriver);

/**
 * 
 * List all drivers through the API (View driver-controller.js for more details)
 * 
 * @name get/api/v1/drivers
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 */

//list all drivers
app.get(`/${BASE_PATH}/api/v1/drivers`, driverController.listAllDrivers);

/**
 * 
 * Delete driver by id through the API (View driver-controller.js for more details)
 * 
 * @name delete/api/v1/drivers/delete
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 */

// delete driver by id
app.delete(`/${BASE_PATH}/api/v1/drivers/delete`, driverController.deleteDriverByID);

/**
 * 
 * Update driver licence and department by id through the API (View driver-controller.js for more details)
 * 
 * @name put/api/v1/drivers/update
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 */

// update driver licence and department by id
app.put(`/${BASE_PATH}/api/v1/drivers/update`, driverController.updateDriverlicenceAndDepartmentByID);



// A1 ENDPOINTS

/**
 * Display the add driver form page
 * 
 * @name get/drivers/add
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get(`/${BASE_PATH}/drivers/add`,auth.isAuthenticatedMiddleware, function (req, res) {
    fileName = DRIVER_VIEWS_PATH + "add_driver.html";
    res.sendFile(fileName);
    
});



/**
 * POST request to add a new driver
 * 
 * @name post/drivers/add
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

// Handle form submission
app.post(`/${BASE_PATH}/drivers/add`, async function (req, res) {
  
  const newDriver = {
      driver_id: generateDriverID(), 
      driver_name: req.body.name,
      driver_department: req.body.department,
      driver_licence: req.body.licence,
      driver_isActive: req.body.isActive === 'true', //boolean
      driver_createdAt: new Date()
  };
  console.log(newDriver.driver_isActive);
  try {
    const driver = new Driver(newDriver);
    await driver.save();
  } catch (err) {
    console.error(err);
  }
  // createDriver(newDriver);
  
  //redirect user to the list of drivers
  res.redirect('/33787778/Jordan/drivers');
});


/**
 * GET request to serve the delete driver form page
 * 
 * @name get/drivers/delete
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

app.get(`/${BASE_PATH}/drivers/delete`,auth.isAuthenticatedMiddleware, function (req, res) {
  res.render("delete_driver.html");
});


/**
 * GET request to delete a driver with query string 
 * driver_id being the parameter
 * 
 * @name get/drivers/delete-driver-req
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

app.get(`/${BASE_PATH}/drivers/delete-driver-req`, async function (req, res) {
  let driver_id = req.query.driver_id;
  if (driver_id) {
    // deleteDriver(driver_id) === -1 ? res.render("invalid_data.html") : res.redirect('/33787778/Jordan/drivers');
    try {
      const driver = await Driver.findOne({driver_id: driver_id});
      console.log(driver._id);
      await Package.deleteMany({driver_id: new ObjectId(driver._id)});
      const result  = await Driver.deleteOne({driver_id: driver_id});

      if (result.deletedCount === 0 ){
        res.render("invalid_data.html");
      } else{
        
        // delete all packages that are assigned to this driver
        res.redirect('/33787778/Jordan/drivers');

      }
    } catch (err) {
      console.log(err);

      res.render("invalid_data.html");
    }
  } else {
    res.render("invalid_data.html");
  }
});


/**
 * GET request to generate a list of drivers
 * 
 * @name get/drivers
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get(`/${BASE_PATH}/drivers`,auth.isAuthenticatedMiddleware,  async function (req, res) {
  let drivers = await Driver.find({});
  res.render("list_driver.html", {db: drivers});
});


/**
 * GET request to generate a list of drivers based on department
 * 
 * @name get/drivers/list_department
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

app.get(`/${BASE_PATH}/drivers/list_department`, auth.isAuthenticatedMiddleware, function (req, res) {
  console.log(filtered_driver_db);
  res.render("list_driver.html", {db: filtered_driver_db});
});

/**
* GET request to display options for drivers based on department
* 
* @name get/drivers/department
* @function
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*/
app.get(`/${BASE_PATH}/drivers/department`, auth.isAuthenticatedMiddleware, function (req, res) {
  res.render("select_department.html");
});


/**
 * POST request to handle form submission for selecting drivers by department
 * 
 * @name post/drivers/department
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

app.post(`/${BASE_PATH}/drivers/department`,async function (req, res) {
 const department = req.body.department;
//  filtered_driver_db = driver_db.filter(driver => driver.driver_department === department);
 filtered_driver_db = await Driver.find({driver_department: department});
 res.redirect('/33787778/Jordan/drivers/list_department');
});


/**
 * Generate a unique driver ID
 * 
 * @function generateDriverID
 * @returns {string} A unique driver ID in the format DXX-33-XXX
 */
function generateDriverID(){
  // generate 2 random digits
  const digits = Math.floor(Math.random() * 90 + 10).toString();
  const studentIDtwoDigits = "33"
  const randomLetters = Array.from({ length: 3 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
  const id = `D${digits}-${studentIDtwoDigits}-${randomLetters}`;
  return id
}


/**
 * Add a new driver to the driver database
 * 
 * @function createDriver
 * @param {Object} driver - The driver object to be added
 * @param {string} driver.driver_id - The unique ID of the driver
 * @param {string} driver.driver_name - The name of the driver
 * @param {string} driver.driver_department - The department of the driver
 * @param {string} driver.driver_licence - The licence of the driver
 * @param {boolean} driver.driver_isActive - The active status of the driver
 * @param {string} driver.driver_createdAt - The creation date of the driver
 * @returns {void}
 */
function createDriver(driver){
  driver_db.push(driver);
}

/**
 * Delete a driver from the driver database
 * 
 * @function deleteDriver
 * @param {string} id - The unique ID of the driver that is to be deleted
 * @returns {number} The index of the deleted driver, -1 if not found
 */

function deleteDriver(id){
  const index = driver_db.findIndex(driver => {
    return driver.driver_id === id
  });
  if (index !== -1) {
      driver_db.splice(index, 1);
  }

  return index
}

// PACKAGES


//api endpoints

/**
 * 
 * List all packages through the API (View package-controller.js for more details)
 * 
 * @name get/api/v1/packages
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
app.get(`/${BASE_PATH}/api/v1/packages`, packageController.listAllPackages);


/**
 * 
 * Insert a new package through the API (View package-controller.js for more details)
 * 
 * @name post/api/v1/packages/add
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * 
 * 
 */
app.post(`/${BASE_PATH}/api/v1/packages/add`, packageController.insertPackage);
app.delete(`/${BASE_PATH}/api/v1/packages/delete/:id`, packageController.deletePackageByID);
app.put(`/${BASE_PATH}/api/v1/packages/update`, packageController.updatePackageDestinationByID);





/**
 * GET request to display the add package page
 * 
 * @name get/packages/add
 * @function
 * @param {Object} req - Express request object 
 * @param {Object} res - Express response object
 */
app.get(`/${BASE_PATH}/packages/add`,auth.isAuthenticatedMiddleware, async function (req, res) {
  const driver_db = await Driver.find({});
  res.render("add_package.html", {db: driver_db});
});


/**
 * POST request to handle form submission for adding a new package
 * 
 * @name post/packages/add
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
app.post(`/${BASE_PATH}/packages/add`, async function (req, res) {
  const newPackage = {
    package_id: generatePackageID(),
    package_title: req.body.title,
    package_weight: req.body.weight,
    package_destination: req.body.destination,
    description: req.body.description,
    createdAt: new Date(),//
    isAllocated: req.body.isAllocated === 'true',
    driver_id: req.body.driver_id
  };

  try {
    const packageNew = new Package(newPackage);
    // check if the driver exists
    const driver = await Driver.findById(req.body.driver_id)
    //add package to the driver
    driver.assigned_packages.push(packageNew._id);
    // save driver and package
    const saveDriver = await driver.save()
    const savedPackage = await packageNew.save();
    res.redirect('/33787778/Jordan/packages');
  } catch (err) {
    console.error(err);
    res.render("invalid_data.html");
  }
  
});


/**
 * GET request to display the delete package page
 * 
 * @name get/packages/delete
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get(`/${BASE_PATH}/packages/delete`,auth.isAuthenticatedMiddleware,  function (req, res) {
  res.render("delete_package.html");
});



/**
 * GET request to handle the deletion of a package
 * 
 * @name get/packages/delete-package-req
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

app.get(`/${BASE_PATH}/packages/delete-package-req`,async function (req, res) {
  let package_id = req.query.package_id;
  if (package_id) {
    // deletePackage(package_id) === -1 ? res.render("invalid_data.html") : res.redirect('/33787778/Jordan/packages');
    try {
      const packageToDelete = await Package.findOne({package_id: package_id});
      if (!packageToDelete){
        res.render("invalid_data.html");
      }

      const result = await Package.deleteOne({package_id: package_id});
      if (result.deletedCount === 0){
        res.render("invalid_data.html");
      } else {
        await Driver.updateMany(
          {},
          { $pull: { assigned_packages: packageToDelete._id } }
        );
        res.redirect('/33787778/Jordan/packages');
      }
  } catch (err) {
    res.render("invalid_data.html");
  }
  } else {
    res.render("invalid_data.html");
  } 
});

/**
 * GET request to display the list of packages
 * 
 * @name get/packages
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get(`/${BASE_PATH}/packages`,auth.isAuthenticatedMiddleware,  async function (req, res) {
  // fileName = PACKAGE_VIEWS_PATH + "list_package.html";
  // res.sendFile(fileName);
  const package_db = await Package.find({});
  res.render("list_package.html", {db: package_db});
});

/**
 * Generate a unique package ID
 * 
 * @function generatePackageID
 * @returns {string} A unique package ID in the format PXX-JN-XXX
 */
function generatePackageID() {
  const randomChars = () => String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const randomDigits = () => Math.floor(100 + Math.random() * 900).toString();
  const initials = "JN"
  
  return `P${randomChars()}-${initials}-${randomDigits()}`;
}

/**
 * Add a new package to the package database
 * 
 * @function addPackage
 * @param {Object} pkg - The package object to be added
 * @returns {void}
 */
function addPackage(pkg){
  package_db.push(pkg);
}


/**
 * Delete a package from the package database
 * 
 * @function deletePackage
 * @param {string} id - The unique ID of the package to be deleted
 * @returns {number} The index of the deleted package, or -1 if not found
 */
function deletePackage(id){
  const index = package_db.findIndex(pkg => pkg.package_id === id
  );
  if (index !== -1) {
      package_db.splice(index, 1);
  }
  return index
}


// /**
//  * GET request to handle invalid endpoints
//  * 
//  * @name get/*
//  * @function
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  */
// app.get('*', function (req, res) {
//   res.render("page_not_found.html");
// });

/**
 * Start the server and listen on the specified port
 * 
 * @function
 * @param {number} PORT_NUMBER - The port number on which the server will listen
 */
server.listen(PORT_NUMBER, function () {
    print(`listening on port ${PORT_NUMBER}`);
  })
  



