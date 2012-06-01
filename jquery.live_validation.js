/*!
 * jQuery Live Validation Plugin
 * version: 1.0 (June 1st, 2012)
 * author: Misha Conway (https://github.com/MishaConway)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: TODO: put website here
 * Dual licensed under the MIT and GPL licenses:
 *    http://www.opensource.org/licenses/mit-license.php
 *    http://www.gnu.org/licenses/gpl.html
 */
var live_validation_validators = []; //TODO: rename this to validators
jQuery.live_validation = {
    set_validator:function (clss, validator_callback) {
        live_validation_validators[clss.trim()] = [false, true, validator_callback];
    },

    remove_validator:function (clss) {
        delete live_validation_validators[clss.trim()];
    },

    list_validators:function () {
        var keys = [];
        for (var clss in live_validation_validators)
            keys.push(clss);
        return keys.join(', ');
    },

    is_submittable:function (form) {
        form.find(':text, :password, textarea, :radio, :checkbox, select').each(function () {
            $.live_validation.validate_input($(this));
        });

        $.live_validation.update_submit_button(form);

        if (form.find('.control-group.error').size()) {
            form.find('.submit-message').removeClass('hide').show();
            return false;
        }
        return true;

    },

    remove_submit_message:function (form) {
        var submit_message = form.find('.submit-message');

        if (submit_message.size() && !submit_message.hasClass('hide'))
            submit_message.fadeOut(600, function () {
                $(this).addClass('hide');
            });

    },

    update_submit_button:function (form) {
        var disable = false;
        if ($('.email').size() && !$('.email').val().length)
            disable = true;
        if ($(':password').size() && !$(':password').val().length)
            disable = true;
        if (form.find('.control-group.error').size())
            disable = true;
        if (disable)
            form.find(':submit').addClass('disabled');
        else
            form.find(':submit').removeClass('disabled');

    },

    set_message:function (input, clss, success, error) {
        var control_group = input.parents('.control-group');

        if (success)
            control_group.addClass('success');
        else
            control_group.removeClass('success');

        if (error)
            control_group.addClass('error');
        else
            control_group.removeClass('error');

        var spans = input.next();
        spans.removeClass('hide');
        spans.find('span').each(function () {
            $(this).addClass('hide');
        });
        spans.find('.' + clss).removeClass('hide');
        return spans.find('.' + clss).size() > 0;
    },


    set_default_message:function (input) {
        $.live_validation.set_message(input, 'default', false, false);
    },

    set_empty_message:function (input) {
        if (!$.live_validation.set_message(input, 'empty', false, true))
            $.live_validation.set_default_message(input);
    },

    set_success_message:function (input) {
        $.live_validation.set_message(input, 'success', true, false);
    },

    validate_input:function (input, suppress_errors) {
        var form = input.parents('form');

        var control_group = input.parents('.control-group');
        if (control_group.size() && control_group.find(':checkbox').size()) {
            if (control_group.find('.at-least-one').size()) {
                if (!control_group.find(':checkbox:checked, :radio:checked').size()) {
                    control_group.removeClass('success').addClass('error').find('.at-least-one-error-msg').removeClass('hide');
                }
                else
                    control_group.addClass('success').removeClass('error').find('.at-least-one-error-msg').addClass('hide');
            }
            else {
                control_group.removeClass('error success');
                if (control_group.find(':checkbox:checked, :radio:checked').size())
                    control_group.addClass('success');
            }
            return;
        }


        var spans = input.next();

        var has_errors = false;

        if (0 == spans.find('.empty').size() && input.val() == '') {
            $.live_validation.set_default_message(input);
            $.live_validation.update_submit_button(form);
            return;
        }
        else {
            if (spans.find('.empty').size() && input.val() == '') {
                has_errors = true;
                if (!suppress_errors)
                    $.live_validation.set_empty_message(input);
                else
                    $.live_validation.set_default_message(input);
            }
            else {
                for (var clss in live_validation_validators) {
                    if (spans.find('.' + clss).size()) {
                        if (live_validation_validators[clss][2](input)) {

                        }
                        else {
                            has_errors = true;
                            if (!suppress_errors)
                                $.live_validation.set_message(input, clss, live_validation_validators[clss][0], live_validation_validators[clss][1])
                            else
                                $.live_validation.set_default_message(input);

                        }
                    }
                }
            }
        }

        if (!has_errors)
            $.live_validation.set_success_message(input);

        $.live_validation.update_submit_button(form);

    }
};




(function ($) {
    $.fn.live_validation = function (options) {
        var intervals = [];

        // Create some defaults, extending them with any options that were provided
        var settings = $.extend({
            // 'location':'top',
            // 'background-color':'blue'
        }, options);


        var ret = this.each(function () {
            var form = $(this);
            form.find(':text, :password, textarea, :radio, :checkbox, select').focus(
                function () {
                    $.live_validation.remove_submit_message($(this));
                    for (var i = 0; i < intervals.length; i++)
                        clearInterval(intervals[i]);
                    var spans = $(this).next();
                    if (!spans.find('.success').size() || spans.find('.success').hasClass('hide'))
                        $.live_validation.set_default_message($(this));
                }).blur(
                function () {
                    for (var i = 0; i < intervals.length; i++)
                        clearInterval(intervals[i]);

                    $.live_validation.validate_input($(this), false);
                }).keydown(
                function () {
                    for (var i = 0; i < intervals.length; i++)
                        clearInterval(intervals[i]);
                }).keyup(function (event) {
                    var that = $(this);
                    $.live_validation.set_default_message($(this));
                    $.live_validation.validate_input(that, true);
                    if (event.keyCode != '9') {
                        intervals.push(setInterval(function () {
                            $.live_validation.validate_input(that, false);
                        }, 1000));
                    }
                }).change(function () {
                    var that = $(this);
                    $.live_validation.set_default_message($(this));
                    $.live_validation.validate_input(that, true);
                    intervals.push(setInterval(function () {
                        $.live_validation.validate_input(that, false);
                    }, 1000));
                }).click(function () {
                    $.live_validation.remove_submit_message(form);
                    $.live_validation.update_submit_button(form);
                });

            if (settings['do_not_select_first_box']) {
            }
            else {
                $(this).find(':text:first').trigger('focus');
                $.live_validation.set_default_message($(this).find(':input:first'));
            }

            $(this).submit(function () {
                return $.live_validation.is_submittable($(this));
            });


        });

        return ret;

    };
})(jQuery);

/* ADD A BUNCH OF VALIDATORS */
$.live_validation.set_validator('email', function (input) {
    var email = input.val();
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length)
        return false;
    else
        return true;
});
$.live_validation.set_validator('email-confirm', function (input) {
    var form = input.parents('form');
    var email = null;
    form.find(':text').each(function () {
        if ($(this).next().find('.email').size() && !$(this).next().find('.email-confirm').size())
            email = $(this).val().toLowerCase().trim();
    });

    var email_confirm = null;
    form.find(':text').each(function () {
        if ($(this).next().find('.email-confirm').size())
            email_confirm = $(this).val().toLowerCase().trim();
    });

    return email == email_confirm;
});
$.live_validation.set_validator('min-3', function (input) {
    return input.val().length >= 3;
});
$.live_validation.set_validator('min-5', function (input) {
    return input.val().length >= 5;
});
$.live_validation.set_validator('min-20', function (input) {
    return input.val().length >= 20;
});
$.live_validation.set_validator('contains-letters', function (input) {
    return /[A-Za-z]+/i.test(input.val());
});
$.live_validation.set_validator('contains-numbers', function (input) {
    return /[0-9]+/i.test(input.val());
});