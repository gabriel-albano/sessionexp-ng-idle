var app = angular.module('sessionexpiration', ['ngIdle']);

app.controller('ExpirationCtrl', function($scope, Idle) {
    $scope.events = [];
    $scope.isTimeOut = false;
    $("#Warning").hide();
    $("#Error").hide();

    $scope.$on('IdleStart', function() {
      // the user appears to have gone idle
      console.log("Idle session detectrd...begining countdown");
    });

    $scope.$on('IdleWarn', function(e, countdown) {
      // follows after the IdleStart event, but includes a countdown until the user is considered timed out
      // the countdown arg is the number of seconds remaining until then.
      // you can change the title or display a warning dialog from here.
      // you can let them resume their session by calling Idle.watch()
      $scope.isTimeOut = true;
      $("#Warning").show();
      console.log("Idle Warning: " + countdown);
    });

    $scope.$on('IdleTimeout', function() {
      // the user has timed out (meaning idleDuration + timeout has passed without any activity)
      // this is where you'd log them
      console.log("Timeout! redirecting or showing message");
      $scope.isTimeOut = true;
      $("#Warning").hide();
      $("#Error").show();
    });

    $scope.$on('IdleEnd', function() {
      // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
      console.log("Activity detected, resenting session...");
      $scope.isTimeOut = false;
      $("#Warning").hide();
      $("#Error").hide()
      $scope.$apply();
    });

    $scope.$on('Keepalive', function() {
      // do something to keep the user's session alive
      $scope.isTimeOut = true;
      console.log("Keepalive called...");
    });

  })
  .config(function(IdleProvider, KeepaliveProvider) {
    // configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(5); // in seconds
    KeepaliveProvider.interval(10); // in seconds
  })
  .run(function(Idle) {
    // start watching when the app runs. also starts the Keepalive service by default.
    Idle.watch();
  });
