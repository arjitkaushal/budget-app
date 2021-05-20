//budget controller

var budgetController = (function () {
    //some code
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;

    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (curr) {
            sum = sum + curr.value;
        });
        data.total[type] = sum;
    };



    var data = {

        allItems: {
            exp: [],
            inc: [],
        },
        total: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,


    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            //create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            //create new item based on "inc" and "exp" type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }
            else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem);

            //return the new elements
            return newItem;

        },

        deleteItem: function (type, id) {
            var index, ids;

            // id =6
            // data.allitems[type][id];
            //ids=[1,2,6,8,9]
            //index=3
            /*
            above method wont work as we 
            actually have to creat a new 
            array where all ids are stored 
            and then point to the index of the 
            required id which is to be deleted
            */
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }



        },

        calculateBudget: function () {
            //1 sum of all incomes sum of all expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget : income-expenses
            data.budget = data.total.inc - data.total.exp;
            // calculate the percentage of income that we spent
            if (data.total.inc > 0) {


                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },

        calculatePercentage: function () {
            /*
             a=20
             b=10  all expenses
             c=40
             income=100
             percentage of a= 20/100
             percentage of b = 10/100
             percentage of c = 40/100
            */

            data.allItems.exp.forEach(function (curr) {
                curr.calcPercentage(data.total.inc);
            });



        },

        getPercentage: function () {
            var allPercentages = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.total.inc,
                totalExpenses: data.total.exp,
                percentage: data.percentage,
            }
        },

        testing: function () {
            console.log(data);
        },
    };




})();



//independent modules no commuction they dont knw other one exists


//ui controller
var uiController = (function () {
    //some code



    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesConainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    };

    var formatNumber = function (number, type) {
        /*
        *****rules
        +or-before the number according to type
           exactly 2 decimal points
           comma seprating th thousands
           eg
           2310.4567->2,310.46

        */
        var numberSplit, int, dec, type;
        number = Math.abs(number);
        number = number.toFixed(2);//exactly 2 decimal places
        numberSplit = number.split('.');
        int = numberSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);


        }
        dec = numberSplit[1];


        return (type === 'exp' ? '-' : '+') + '' + int + '.' + dec;



    };

    var NodeListForEach = function (list, callBack) {
        for (let i = 0; i < list.length; i++) {

            callBack(list[i], i);
        }
    };




    return {
        getInput: function () {
            return {
                type: document.querySelector(domStrings.inputType).value,//will be either inc or exp
                discription: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value),


            };
        },

        addListItem: function (obj, type) {
            // create html string with placeholder text
            var html, newHtml, element;
            if (type === 'inc') {
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value% </div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = domStrings.expensesConainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
            }






            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        deleteListItem: function (selectorID) {

            var element = document.querySelector('#' + selectorID);
            element.parentNode.removeChild(element);

        },

        clearFields: function () {
            var fields;
            fields = document.querySelectorAll(domStrings.inputDescription + ',' + domStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExpenses, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = '---';
            }


        },

        displayPercentages: function (percentage) {
            var fields = document.querySelectorAll(domStrings.expensesPercentageLabel);


            NodeListForEach(fields, function (current, index) {
                if (percentage[index] > 0) {
                    current.textContent = percentage[index] + '%';
                }
                else {
                    current.textContent = '---';
                }
            });


        },

        displayDateandMonth: function () {
            var now, year, month, months;
            now = new Date();//strore date of today object date made
            year = now.getFullYear();
            months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            month = now.getMonth();
            document.querySelector(domStrings.dateLabel).textContent = months[month] + ' ' + year;


        },

        changeType: function () {
            var fields = document.querySelectorAll(
                domStrings.inputType + ',' +
                domStrings.inputDescription + ',' +
                domStrings.inputValue
            );

            NodeListForEach(fields, function (curr) {
                curr.classList.toggle('red-focus');

            });
            document.querySelector(domStrings.inputBtn).classList.toggle('red');

        },



        getDomStrings: function () {
            return domStrings;
        },


    };

})();

//GLOBAL CONTROLLER



var controller = (function (budegetCtrl, uiCtrl) {

    var setupEventListener = function () {
        var DOMM = uiController.getDomStrings();
        document.querySelector(DOMM.inputBtn).addEventListener('click', controlAddItem);
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {

                controlAddItem();

            }
        });

        document.querySelector(DOMM.container).addEventListener('click', controlDeleteItem);
        document.querySelector(DOMM.inputType).addEventListener('change', uiCtrl.changeType);

    };

    var updateBudget = function () {
        //1 calculate budget
        budegetCtrl.calculateBudget();

        // 2 return budget
        var budget = budegetCtrl.getBudget();


        // 5 display budget
        uiCtrl.displayBudget(budget);


    };

    var updatePercentage = function () {
        //1 calculate percentage
        budegetCtrl.calculatePercentage();

        //2 read/return form budget controller
        var percentages = budegetCtrl.getPercentage();
        //3 update th ui interface
        uiCtrl.displayPercentages(percentages);
    };

    var controlAddItem = function () {

        var input, newItem;
        // 1 .get the field input data
        input = uiCtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to the budget controller
            newItem = budegetCtrl.addItem(input.type, input.discription, input.value);
            // 3. add the item to the ui
            uiCtrl.addListItem(newItem, input.type);
            //4 clear fields
            uiCtrl.clearFields();
            // 5 calculate and upate and budget
            updateBudget();

            //6  update percentage
            updatePercentage();
        }
    };

    var controlDeleteItem = function (e) {
        var itemId, type, ID;

        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            //inc-1 use split method
            splitID = itemId.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1 delete item form data structure
            budegetCtrl.deleteItem(type, ID);

            //2 delete item from user interface
            uiController.deleteListItem(itemId);
            //3 update and show the new budget
            updateBudget();

            //4 update percentage

            updatePercentage();

        }
    };

    return {

        init: function () {
            console.log('application start');
            uiCtrl.displayDateandMonth();
            uiCtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1,

            }
            );

            setupEventListener();
        }
    };
})(budgetController, uiController);

controller.init();


