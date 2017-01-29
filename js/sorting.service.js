
// sorting.service.js
(function () {
    'use strict';

    angular
        .module('routeApp')
        .service('sortingService', sortingService);

    function sortingService(distanceService) {
        return optimalRouteList;

        function optimalRouteList(locations) {
            var optimal_list = [];
            var size = locations.length;

            var start = {
                lat: locations[0]["coordinate"].lat(),
                lng: locations[0]["coordinate"].lng()
            };

            var rest = [];

            for (var i = 0; i < size; i++) {
                rest.push({
                    lat: locations[i]["coordinate"].lat(),
                    lng: locations[i]["coordinate"].lng()
                });
            }

            do {
                var route_distance = [];
                for (var i = 0; i < size; i++) {
                    var dist = distanceService(start, rest[i]);
                    route_distance.push(dist);
                }
                var min_distance = route_distance[0];
                var index = 0;

                for (var j = 1; j < route_distance.length; j++) {
                    if (min_distance > route_distance[j]) {
                        min_distance = route_distance[j];
                        index = j;
                    }
                }

                start = rest[index];
                optimal_list.push(start);
                rest.splice(index, 1);
                size = rest.length;

            } while (optimal_list.length < locations.length);

            return optimal_list;
        }
    }
})();