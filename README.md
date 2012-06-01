jquery.live_validation
======================

HomePage
http://misha.herokuapp.com/live_validation

Introduction
jQuery.live_validation is designed to integrate with Twitter Bootstrap though it is of course entirely optional. If you decide to use not bootstrap, you will need to style a hide class with a display none property. For everything else, we leave it up to you to style to your heart's content.
 
Overview
We have designed this plugin so that is possible to customize detailed live validation with mere simple html. The rules are pretty simple and follow from twitter bootstrap conventions. 

For any input that you want live validation, you must enclose it inside a div with the control-group class. Next to your input, you must place a span with the hide class. Inside the hidden span you may place as many validation messages as you want and the plugin will handle the rest. For an example of how to setup such an input, please refer to the html sample.
 
Built-in Validators
The following validation classes are supported by default:
empty (validates that input is not empty)
email (validates that input is a valid email)
email-confirm (validates that input matches email input)
min-3 (validates that input is at least three characters long)
min-5 (validates that input is at least five characters long)
min-20 (validates that input is at least twenty characters long)
contains-letters (validates that input contains at least one letter)
contains-numbers (validates that input contains at least one number)
 
Custom Validations
For more advanced needs, it is easy to add custom validators. For instance if you need to validate some payment processing, you may do something like this where card-number is a css class and the callback is a function that returns a boolean corresponding to whether or not the input satisfied the custom validation: 

$.live_validation.set_validator('card-number', function(input){ 
     return validate_credit_card_number(input.val()); 
});

Installation
======================
Setup your javascript
======================
$(document).ready(function(){ 
     $('form').live_validation(); 
});

Please see the html example at http://misha.herokuapp.com/live_validation to see how to setup your validated inputs.


