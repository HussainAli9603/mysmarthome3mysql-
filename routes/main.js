var express = require('express');
var router = express.Router();
var Device = require('../models/devices');  

const mysql = require('mysql');

// Connection Pool
let connection = mysql.createConnection({
  host:"localhost",
  user: "root",
  password: "",
  database: "mysmarthome"
});

  // Get Home Page
router.get('/',(req,res)=>{
  connection.query('SELECT * FROM devices',(err,device)=>{
    res.render('admin/home',{      // renders views/admin/home.ejs
    device:device.length
  })
})
})

 // Get About Page
router.get('/about',(req,res)=>{
    res.render('admin/about')
})

 // Add Device Page 
router.get('/add-device',(req,res)=>{
    res.render('admin/add_device')
});

router.post('/add-device',(req,res)=>{

    // Retrieves fields from Add Device page from request body
  var name        = req.body.deviceName;
  var onOff       = req.body.onOff;
  var openClose   = req.body.openClose;
  var temperature = req.body.temperature;
  var volume      = req.body.volume;
  var channel      = req.body.channel;

  // User the connection
  connection.query('INSERT INTO devices SET name = ?, onOff = ?, openClose = ?, temperature = ?, volume = ?, channel =?', [name, onOff, openClose, temperature, volume,channel], (err, rows) => {
    if (!err) {
      req.flash('success','Device was successfully Created');
      res.redirect('/add-device')   // redirect to this link http://localhost:8089/add-device
    } else {
      console.log(err);
    }
    console.log('The data from channel table: \n', rows);
  });
});


 // Show Device Status Page
router.get('/show-device-status',(req,res)=>{
   // User the connection
  connection.query('SELECT * FROM devices', (err, getAllDevices) => {  // Retrieves all Devices from database
    if (!err) {
      res.render('admin/show_device_status',{
      getAllDevices:getAllDevices   // passes Device object to ejs 
    })
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', getAllDevices);
  });
})

 // Update Device Status Page
router.get('/update-device-status',(req,res)=>{
   // Devices the connection
  connection.query('SELECT * FROM devices', (err, getDevice) => {  // Retrieves all Devices from database
    if (!err) {
      res.render('admin/update_device_status',{
      getDevice:getDevice   // passes Device object to ejs 
    })
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', getDevice);
  });
})

 // Update1 Device Status Page
router.get('/update1-device-status/:id',(req,res)=>{
   // User the connection
  connection.query('SELECT * FROM devices WHERE id = ?', [req.params.id], (err, getDevice) => {
    if (!err) {
      res.render('admin/update1_device_status', { getDevice:getDevice[0] }); // passes Device object to ejs 
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', getDevice);
  });
})

 // POST method Update Device status
router.post('/update1-device-status/:id',(req,res)=>{
	// Retrieves fields from Add Device page from request body
	var name        = req.body.deviceName;
	var onOff       = req.body.onOff;
	var openClose   = req.body.openClose;
	var temperature = req.body.temperature;
	var volume      = req.body.volume;
  var channel      = req.body.channel;
  var id          = req.params.id;

  connection.query('UPDATE devices SET name = ?, onOff = ?, openClose = ?, temperature = ?, volume = ?, channel =? WHERE id = ?', [name, onOff, openClose, temperature, volume,channel,req.params.id], (err, rows) => {
    if (!err) {
      // User the connection
      connection.query('SELECT * FROM devices WHERE id = ?', [req.params.id], (err, rows) => {
        // When done with the connection, release it
        
        if (!err) {
           req.flash('success','Device was successfully Updated');
            res.redirect('/update-device-status');
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
});



 // Delete Device  Page
router.get('/delete-device-status',(req,res)=>{
	connection.query('SELECT * FROM devices', (err, getAllDevices) => {  // Retrieves all Devices from database
      res.render('admin/delete_device',{
    	getAllDevices:getAllDevices   // passes Device object to ejs 
    })
  }); 
})

 // Device Delete Method 
router.get('/delete1-device/:id',(req,res)=>{
	var id = req.params.id;
	connection.query('DELETE FROM devices WHERE id = ?', [req.params.id],(err,deleteDevices)=>{ // Retrieves Single Device from database
        req.flash('success','Device was successfully Deleted!');
        res.redirect('/delete-device-status')
  }); 
})

module.exports = router;



