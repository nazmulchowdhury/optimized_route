
// route.controller.js
(function () {
    'use strict';

    angular
        .module('routeApp')
        .controller('RouteController', RouteController);

    RouteController.$inject = ['$scope', '$http', 'optimalRouteViewingService'];

    function RouteController($scope, $http, orvs) {
        $scope.$on("mapInitialized", mapInitialized);
        $scope.point = "0, 0";
        $scope.trip_locations = [];
        $scope.isHidden = true;
        $scope.getListHeader = getListHeader;
        $scope.addLocation = addLocation;
        $scope.removeLocation = removeLocation;
        $scope.getOptimizedRoute = getOptimizedRoute;

        function mapInitialized(event, map) {
            map.setOptions({
                zoom: 8,
                directionsDisplay: new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: "#CF000F"
                    }
                }),
                directionsService: new google.maps.DirectionsService()
            });
        }

        function getListHeader() {
            if ($scope.trip_locations.length) {
                return "Route Locations";
            }
        }

        function addLocation() {
            $scope.map.markers[0].setMap($scope.map);
            if (typeof $scope.location != "undefined") {
                $scope.map.directionsDisplay.setDirections({ routes: [] });
                $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + $scope.location
                    + "&key=AIzaSyAo9sDcaQVV9YnmXlg9Qoya33WygZuTdcs").then(checkLocation);
            } else {
                $scope.errortext = "Sorry Invalid Location!";
                $scope.point = "0, 0";
            }

            function checkLocation(response) {
                if (response.data.status === "OK") {
                    var formatted_address = response.data.results[0]["formatted_address"];
                    var latitude = response.data.results[0]["geometry"]["location"]["lat"];
                    var longitude = response.data.results[0]["geometry"]["location"]["lng"];
                    var coordinate = new google.maps.LatLng(latitude, longitude);

                    $scope.point = formatted_address;
                    $scope.trip_locations.push({ "coordinate": coordinate, "location": formatted_address });
                    $scope.errortext = "";
                    if ($scope.trip_locations.length >= 2) {
                        $scope.isHidden = false;
                    }
                } else {
                    $scope.errortext = "Sorry Invalid Location!";
                    $scope.point = "0, 0";
                }
            }
        }

        function removeLocation(x) {
            $scope.errortext = "";
            $scope.trip_locations.splice(x, 1);
            if ($scope.trip_locations.length < 2) {
                $scope.isHidden = true;
            }
        }

        function getOptimizedRoute() {
            $scope.map.directionsDisplay.setMap($scope.map);
            orvs.show_optimal_route($scope.trip_locations, $scope.map.directionsService,
                $scope.map.directionsDisplay);
            for (var key in $scope.map.markers) {
                $scope.map.markers[key].setMap(null);
            }
        }
    }
})();