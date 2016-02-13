$(document).ready(function() {

  $('select').material_select();

  // Initalizes the Data Displays
  var robot_velocity_gauge = new JustGage({
      id: "robot_velocity_gauge",
      value: 0,
      min: 0,
      max: 15,
      title: "Speed"
  });

  var robot_acceleration_gauge = new JustGage({
      id: "robot_acceleration_gauge",
      value: 0,
      min: 0,
      max: 15,
      title: "Acceleration"
  })

  function populateAutoChooser() {
    var choiceString = NetworkTables.getValue('/SmartDashboard/Autonomous mode/options', 'e,r,r,o,r');
    var choiceArray = choiceString.split(",");
    for (var i = 0; i < choiceArray.length; i++) {
        $('#autoModeSelect')
         .append($("<option></option>")
         .attr("value",choiceArray[i])
         .text(choiceArray[i]));
    }
    $('select').material_select();
  }

  $('.direction-div').height($('.velocity_div').height());

  // sets a function that will be called when the websocket connects/disconnects
  NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

  // sets a function that will be called when the robot connects/disconnects
  NetworkTables.addRobotConnectionListener(onRobotConnection, true);

  // sets a function that will be called when any NetworkTables key/value changes
  NetworkTables.addGlobalListener(onValueChanged, true);

  function onNetworkTablesConnection(connected) {
    if (connected) {
      $('#networktables_connection').text("Connected!");
    } else {
      $('#networktables_connection').text("Disconnected");
    }
  }

  function onRobotConnection(connected) {
    if (connected) {
      $('#robot_connection').text("Connected!");
    } else {
      $('#robot_connection').text("Disconnected");
    }
  }

  function onValueChanged(key, value, isNew) {
      if (key == "/SmartDashboard/Velocity_X" || key == "/SmartDashboard/Velocity_Y") {
          var Velocity_X = NetworkTables.getValue('/SmartDashboard/Velocity_X', 0);
          var Velocity_Y = NetworkTables.getValue('/SmartDashboard/Velocity_Y', 0);
          var Speed = Math.sqrt(Math.pow(Velocity_X, 2) + Math.pow(Velocity_Y, 2));
          robot_velocity_gauge.refresh(Math.abs(Speed) * 10);
      }

      if (key == "/SmartDashboard/IMU_Accel_X" || key == "/SmartDashboard/IMU_Accel_Y") {
          var Acceleration_X = NetworkTables.getValue('/SmartDashboard/IMU_Accel_X', 0);
          var Acceleration_Y = NetworkTables.getValue('/SmartDashboard/IMU_Accel_Y', 0);
          var Acceleration = Math.sqrt(Math.pow(Acceleration_X, 2) + Math.pow(Acceleration_Y, 2));
          robot_acceleration_gauge.refresh(Math.abs(Acceleration) * 10);
      }

      if (key == "/SmartDashboard/IMU_FusedHeading") {
          $('#direction-indicator').rotate(value);
      }

      if (key == "/SmartDashboard/Autonomous mode/options") {
        populateAutoChooser();
      }

      /*
      if (key == "/GRIP/tracking/centerX" || key == "/GRIP/tracking/centerY") {
          var CenterX = NetworkTables.getValue('/GRIP/tracking/centerX', 0);
          var CenterY = NetworkTables.getValue('/GRIP/tracking/centerY', 0);
          //$('#trackingSquare').animate({ "left": CenterX }, "slow" );
      }
      */

      if (key == "/LiveWindow/~STATUS~/LW Enabled") {
          if (value == "true") {
              $('#enabledStatus').text("Robot Enabled!");
          } else {
              $('#enabledStatus').text("Robot Disabled!");
          }
      }

      if (isNew) {
          switch (key) {
              case "/SmartDashboard/Velocity_X":
              case "/SmartDashboard/Velocity_Y":
              case "/SmartDashboard/IMU_Accel_X":
              case "/SmartDashboard/IMU_Accel_Y":
              case "/SmartDashboard/Left rate":
              case "/SmartDashboard/Right rate":
              case "/SmartDashboard/IMU_Pitch":
              case "/SmartDashboard/IMU_IsRotating":
              case "/LiveWindow/~STATUS~/LW Enabled":
              case "/GRIP/tracking/centerX":
              case "/GRIP/tracking/centerY":
              case "/SmartDashboard/Autonomous mode/options":
                  var tr = $('<tr></tr>').appendTo($('#specific_table > tbody:last'));
                  $('<td></td>').text(key).appendTo(tr);
                  $('<td></td>').attr('id', NetworkTables.keyToId(key)).text(value).appendTo(tr);
                  break;
              default:
                  var tr = $('<tr></tr>').appendTo($('#normal_table > tbody:last'));
                  $('<td></td>').text(key).appendTo(tr);
                  $('<td></td>').attr('id', NetworkTables.keyToId(key)).text(value).appendTo(tr);
                  break;
          }
      } else {
          $('#' + NetworkTables.keySelector(key)).text(value);
      }
  }
});
