/*===============MODEL===============*/

//model object to communicate with local storage

var model = {
    //initiate storage and function call to add pup data
    init: function() {
        localStorage.clear();
        if (!localStorage.notes) {
            localStorage.notes = JSON.stringify([]);
        }
        pupItem();
    },

    //add objects to the storage
    add: function(obj) {
        var data = JSON.parse(localStorage.notes);
        var duplicate = data.some(function(item) {
            return item.image === obj.image;
        });
        if (!duplicate) {
            data.push(obj);
        }
        localStorage.notes = JSON.stringify(data);
    },

    //function to all all the values to local storage
    method: function(name, path, count) {
        model.add({
            name: name,
            image: path,
            clickCount: count
        });
    },

    // saves clicks of the image to the local storage
    saveClicks: function(value, index) {
        var data = JSON.parse(localStorage.notes);
        data[index].clickCount = value;
        localStorage.notes = JSON.stringify(data);
    },

    //pull data from storage
    getAllData: function() {
        return JSON.parse(localStorage.notes);
    }

};


//add data to local storage
function pupItem() {
    model.method('Rufus', 'images/puppy.jpg', 0);
    model.method('Tina', 'images/Cat.jpg', 0);
    model.method('Oscar', 'images/puppyTwo.png', 0);
    model.method('Teddy', 'images/CatTwo.jpg', 0);
    model.method('Sleepy', 'images/puppyThree.jpg', 0);
    model.method('Ruff and Tuff', 'images/CatThree.jpg', 0);
    model.method('Pluto, Sunny & Brian', 'images/puppyFour.jpg', 0);
    model.method('Marcus', 'images/CatFour.jpg', 'cat');
    model.method('Mikky & Ginny', 'images/puppyFive.jpg', 0);
    model.method('Mike', 'images/CatFive.jpg', 0);
    model.method('Mau & Pau', 'images/puppySix.jpg', 0);
}

//constructor function to create pup KO objects
var Pup = function(data, index) {
    this.clickCount = ko.observable(data.clickCount);
    this.name = ko.observable(data.name);
    this.image = ko.observable(data.image);
    this.id = ko.observable(index);
};

/*=============ViewModel============*/

var ViewModel = function() {
    model.init();

    var self = this;

    self.pupList = ko.observableArray([]);

    self.numPups = ko.observable();

    self.currentPup = ko.observable();

    self.submitNo = function() {
        self.reset();
        var allPups = model.getAllData();
        var n = self.numPups();
        for(var i = 0; i < n; i++) {
            self.pupList.push(new Pup(allPups[i], i));
        }

        self.currentPup(self.pupList()[0]);
    };

    self.reset = function() {
        self.pupList([]);
        self.currentPup();
    };

    self.clickedPup = function(info) {
        self.currentPup(info);
    };

    self.incrementCounter = function() {
        self.currentPup().clickCount(self.currentPup().clickCount() + 1);
        model.saveClicks(self.currentPup().clickCount(), self.currentPup().id());
    };

};


ko.applyBindings(new ViewModel());
