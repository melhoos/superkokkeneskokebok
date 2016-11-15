// public/core.js
var superkokkeneskokebok = angular.module('superkokkeneskokebok', ["ngAlertify"]);


/*
    colors:
    ice: #99D3DF
    freshwater: #88BBD6
    plaster: #CDCDCD
    linen: #E9E9E9
*/

function mainController($scope, $http, alertify) {

    $scope.selectedMeal = "Velg";
    $scope.orderByExpression = "";
    $scope.orderByReverse= true;
    $scope.formData = {};
    $scope.meals = ['frokost', 'snack', 'lunsj', 'middag', 'dessert', 'tilbehør', 'drikke'];

    alertify.logPosition("bottom right")

    // when landing on the page, get all recipes and show them
    angular.element(document).ready( function () {
        getAllRecipies();
    })

    function getAllRecipies () {
        $http.get('/api/recipes')
            .success(function(data) {
                $scope.recipes = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.setActiveRecipe = function (recipie) {
        $scope.activeRecipie = recipie;
    }

    $scope.setDropdownButtonText = function (meal) {
        $scope.selectedMeal = meal;
        $scope.formData.meal = meal;
    }

    $scope.resetFormData = function () {
        $scope.selectedMeal = "Velg";
        $scope.formData = {};
    }

    $scope.filterBasedOnMeal = function (meal) {
        $http.get('/api/recipes/' + meal)
            .success(function(data) {
                $scope.recipes = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        
    }

    $scope.getAllRecipies = function() {
        $scope.orderByExpression = "title"
        $scope.orderByReverse = !$scope.orderByReverse;
        getAllRecipies();
    }

    $scope.setRandomRecipieAsActiveRecipie = function () {
        var randomNumber = Math.floor(Math.random() * $scope.recipes.length );
        console.log("random: ", randomNumber);
        $scope.activeRecipie = $scope.recipes[randomNumber];
    }

    // when submitting the add form, send the text to the node API
    $scope.createRecipie = function() {
        $http.post('/api/recipes', $scope.formData)
            .success(function(data) {
                alertify.success($scope.formData.title + " lagt til! ");
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.recipes = data;
                console.log(data);

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a recipe after checking it
    $scope.deleteRecipie = function(id) {
        alertify.confirm("Er du sikker på at du vil slette denne oppskriften?", function () {
            $http.delete('/api/recipes/' + id)
                .success(function(data) {
                    alertify.error("Slettet!");
                    $scope.recipes = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }, function() {
            // user clicked "cancel"
        });        
    };

}

