function populateAutoChooser() {
    var errorMessage = "";
    errorMessage += "Sorry,";
    errorMessage += "Options Key Must Not Exist,";
    errorMessage += "Or NetworkTables/Robot Connection,";
    errorMessage += "Has Not Been Established,";
    errorMessage += "Will try again once connection is established";
    var choiceString = NetworkTables.getValue('/SmartDashboard/Autonomous mode/options', errorMessage);
    var choiceArray = choiceString.split(",");
    for (var i = 0; i < choiceArray.length; i++) {
        $('#autoModeForm').append($("<p class=\"autoModeChoice\"><input value=\"" + choiceArray[i] + "\"name=\"" + "autoModeChooser" + "\" type=\"radio\" id=\"" + "option" + i + "\" /><label for=\"" + "option" + i + "\">" + choiceArray[i] +"</label></p>"))
    }
    $('select').material_select();
}

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
    switch(key) {
        case "/SmartDashboard/Autonomous mode/options":
            populateAutoChooser();
        case "/SmartDashboard/Velocity_X":
        case "/SmartDashboard/Velocity_Y":
            var Velocity_X = NetworkTables.getValue('/SmartDashboard/Velocity_X', 0);
            var Velocity_Y = NetworkTables.getValue('/SmartDashboard/Velocity_Y', 0);
            var Speed = Math.sqrt(Math.pow(Velocity_X, 2) + Math.pow(Velocity_Y, 2));
            robot_velocity_gauge.refresh(Math.abs(Speed) * 10);
            break;
        case "/SmartDashboard/IMU_Accel_X":
        case "/SmartDashboard/IMU_Accel_Y":
            var Acceleration_X = NetworkTables.getValue('/SmartDashboard/IMU_Accel_X', 0);
            var Acceleration_Y = NetworkTables.getValue('/SmartDashboard/IMU_Accel_Y', 0);
            var Acceleration = Math.sqrt(Math.pow(Acceleration_X, 2) + Math.pow(Acceleration_Y, 2));
            robot_acceleration_gauge.refresh(Math.abs(Acceleration) * 10);
            break;
        case "/SmartDashboard/Git Info":
            $('#gitInfo').text('Version ' + value);
            break;
        case "/SmartDashboard/IMU_FusedHeading":
            $('#direction-indicator').rotate(value);
            break;
        case "/SmartDashboard/Autonomous mode/options":
            populateAutoChooser();
            break;
        case "/LiveWindow/~STATUS~/LW Enabled":
            if (value == "true")
                $('#enabledStatus').text("Robot Enabled!");
            else
                $('#enabledStatus').text("Robot Disabled!");
            break;
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
            case "/SmartDashboard/Autonomous mode/selected":
                if ($('#' + NetworkTables.keySelector(key)).length) {
                    $('#' + NetworkTables.keySelector(key)).text(value);
                } else {
                    var tr = $('<tr></tr>').appendTo($('#specific_table > tbody:last'));
                    $('<td></td>').text(key).appendTo(tr);
                    $('<td></td>').attr('id', NetworkTables.keyToId(key)).text(value).appendTo(tr);
                }
                break;
            default:
                if ($('#' + NetworkTables.keySelector(key)).length) {
                    $('#' + NetworkTables.keySelector(key)).text(value);
                } else {
                    var tr = $('<tr></tr>').appendTo($('#normal_table > tbody:last'));
                    $('<td></td>').text(key).appendTo(tr);
                    $('<td></td>').attr('id', NetworkTables.keyToId(key)).text(value).appendTo(tr);
                }
                break;
        }
    } else {
      $('#' + NetworkTables.keySelector(key)).text(value);
    }
}

$(document).ready(function() {

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

  $('.direction-div').height($('.velocity_div').height());

  populateAutoChooser();

  // sets a function that will be called when the websocket connects/disconnects
  NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

  // sets a function that will be called when the robot connects/disconnects
  NetworkTables.addRobotConnectionListener(onRobotConnection, true);

  // sets a function that will be called when any NetworkTables key/value changes
  NetworkTables.addGlobalListener(onValueChanged, true);

  $('.autoModeChoice').click(function(event) {
    var choiceSelected = $(this).children('input').val();
    console.log("Trying to set " + choiceSelected + " as the mode");
    NetworkTables.putValue('/SmartDashboard/Autonomous mode/selected', choiceSelected)
  });

});
