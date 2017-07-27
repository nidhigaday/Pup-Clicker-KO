$(function() {

/*===============MODEL===============*/

    var model = {
        //initiate storage
        init: function() {
            if (!localStorage.notes) {
                localStorage.notes = JSON.stringify([]);
            }
        },

        //add objects to the storage
        add: function(obj) {
            var data = JSON.parse(localStorage.notes);
            var duplicate = data.some(function(item){
                return item.image === obj.image;
            });
            if(!duplicate) {
                data.push(obj);
            }
            localStorage.notes = JSON.stringify(data);
        },

        //add clicks
        addClicks: function(indx, count) {
            var data = JSON.parse(localStorage.notes);
            data[indx].clicks = count;
            localStorage.notes = JSON.stringify(data);
        },

        //add admin data
        addData: function(n, pname, pcount) {
            var newdata = JSON.parse(localStorage.notes);
            newdata[n].name = pname;
            newdata[n].clicks = pcount;
            localStorage.notes = JSON.stringify(newdata);
        },

        //pull data from storage
        getAllData: function() {
            return JSON.parse(localStorage.notes);
        },

        //local variable to save index of pup object
        index: {
            key: 0
        }
    };

/*===============OCTOPUS===============*/

    var octopus = {
        //initial functions ready
        init: function() {
            localStorage.clear();
            model.init();
            pupItem();
            view.init();
        },

        //function to get animal object
        method: function(name, path, typee) {
            model.add({
                name : name,
                image : path,
                type : typee,
                category : 'both',
                clicks: 0
            });
        },

        //pull data from storage
        getData: function() {
            return model.getAllData();
        },

        //reset function
        initReset: function() {
            localStorage.clear();
            window.location.reload();
        },

        // get input values for form submit
        initSubmit: function() {
            //disables Submit button once clicked
            $(this).attr('disabled', true);
            var pupNumbers, babyType, pupArray ;
            pupNumbers = $('#catsValue').val();
            pupArray = octopus.getData();
            if ($("input[type='radio'].puptype").is(':checked')) {
                babyType = view.getType();
            }
            //this.getPups will not work here. 'this' is 'e' from input value
            octopus.getPups(pupNumbers, pupArray, babyType);
        },

        //function call to render list of pups
        getPups: function(n, woof, typeee) {
            var counter = 0;
            for (x = 0; x < woof.length; x++) {
                if ((woof[x].type === typeee && counter < n) || (woof[x].category === typeee && counter < n)) {
                    view.render(woof[x]);
                    counter++;
                }
            }
            //enable click function for pups in the list and large image
            $('.cat-list img').click(this.pupClicked);
            $('#large-image').click(octopus.imgClicked);
        },

        //function to render clicked pup image in the list is clicked
        pupClicked: function(e) {
            e.preventDefault();
            var bigImg = $(this).attr('src');
            var pupInfo = octopus.getData();
            pupInfo.some(function(item , i) {
                if(item.image == bigImg) {
                    view.renderImg(item);
                    model['index']['key'] = i;
                }
            });
            //enable click on the list and the larger image
            octopus.initClicks();
        },

        //make admin button visible; click function for large image and admin button
        initClicks: function() {
            $('.sec_admin h4').css('display','block');
            $('.sec_admin h4').click(octopus.adminButton);
        },

        //function call to increment no. of clicks
        imgClicked: function() {
            var list, loc, val;
            list = octopus.getData();
            loc = model['index']['key'];
            val = view.getClicks();
            val = parseInt(val, 10) + 1;
            model.addClicks(loc, val);
            view.renderClicks(val);
        },

        //make admin sec visible and click function call for Save button
        adminButton: function(e) {
            e.preventDefault();
            view.adminAnimate();
            $('.admin_save').click(octopus.adminData);
        },

        //function called when Save button in admin is clicked to update name and clicks of the pup
        adminData: function() {
            var newInfo, dataList, m;
            m = model['index']['key'];
            newInfo = view.getadminInfo();
            if(newInfo[0].length > 0 && newInfo[1].length > 0) {
                model.addData(m, newInfo[0], newInfo[1]);
                dataList = octopus.getData();
                view.renderImg(dataList[m]);
                view.adminInforRender(dataList[m]);
            }
        }
    };

/*===============VIEW===============*/

    var view = {
        //initial function to get available number of pups and enable buttons
        init: function() {
            $('#catsValue').attr('max', octopus.getData().length);
            $('input.init_Submit:submit').click(octopus.initSubmit);
            $('input:reset').click(octopus.initReset);
        },

        getType: function() {
            return $("input[type='radio'].puptype:checked").val();
        },

        //render function to list all pups
        render: function(info) {
            return $('.row').append('<div class="col">' +
                '<img src="' + info.image + '">' +
                '<h2 class="col_title">' + info.name + '</h2>' +
                '</div>');
        },

        //function to render large image
        renderImg: function(pup) {
            $('div.pup_details').remove();
            $('.display-area').prepend('<div id="pup_details" class="pup_details">' +
                '<h3 class="pup_name">' + pup.name + '</h3>' +
                '<h3 class="pup_clicks">No. of clicks <span>' + pup.clicks + '</span></h3></div>');
            $('#large-image').attr('src', pup.image);
        },

        //get value of clicks from DOM
        getClicks: function() {
            return $('.display-area span').text();
        },

        //update clicks in DOM
        renderClicks: function(newClicks){
            $('.display-area span').text(newClicks);
        },

        //display admin section
        adminAnimate: function(){
            $('.sec_view').css('display','block');
            $('html, body').animate({
                scrollTop: $("#admin_view").offset().top
            }, 500);
        },

        //get admin data input values
        getadminInfo: function() {
            return [$('.new_name').val(), $('.new_count').val()];
        },

        //render values obtained from admin section
        adminInforRender: function(data){
            $('html, body').animate({
                scrollTop: $("#pup_details").offset().top
            }, 100);
            $('.col_title').text(data.name);
            $('.sec_view').css('display','none');
            $('.new_name').val('');
            $('.new_count').val('');
        }
    };


    function pupItem() {
        octopus.method('Rufus', 'images/puppy.jpg', 'dog');
        octopus.method('Tina', 'images/Cat.jpg', 'cat');
        octopus.method('Oscar', 'images/puppyTwo.png', 'dog');
        octopus.method('Teddy', 'images/CatTwo.jpg', 'cat');
        octopus.method('Sleepy', 'images/puppyThree.jpg', 'dog');
        octopus.method('Ruff and Tuff', 'images/CatThree.jpg', 'cat');
        octopus.method('Pluto, Sunny & Brian', 'images/puppyFour.jpg', 'dog');
        octopus.method('Marcus', 'images/CatFour.jpg', 'cat');
        octopus.method('Mikky & Ginny', 'images/puppyFive.jpg', 'dog');
        octopus.method('Mike', 'images/CatFive.jpg', 'cat');
        octopus.method('Mau & Pau', 'images/puppySix.jpg', 'dog');
    }

    octopus.init();
}());