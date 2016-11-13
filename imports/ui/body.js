import { Template } from 'meteor/templating';

import { Colors } from '../api/colors';

import '../startup/client/routes';

import './layouts/layout.html';
import './layouts/navigation.html';
import './layouts/content.html';
import './layouts/addColor.html';
import './layouts/register.html';
import './layouts/signin.html';

Template.addColor.events({
    'submit form'(event) {
        event.preventDefault();

        let colorName = event.target.name.value;
        let colorCode = event.target.code.value;

        if (colorName === '' || colorCode === '')
            return;

        Meteor.call('addColor', colorName, colorCode, Meteor.userId(), Meteor.user().emails[0].address, function (error) {
            if (error) {
                console.log(error.reason);
            } else {
                Router.go('home');
            }
        });
    }
});

Template.content.onCreated(() => {
    $('.alert').hide();
});

Template.content.onRendered(() => {
    $('.alert').hide();
});

Meteor.subscribe('color');
Template.content.helpers({
    isEmpty() {
        return Colors.find({}).count() == 0;
    },

    color() {
        return Colors.find({ userId: Meteor.userId() }, {sort: {createdAt: -1}});
    },

    colorByAll() {
        return Colors.find({}, {sort: {createdAt: -1}});
    }
});

Template.content.events({
    'click .plain-textbox'(event) {
        event.preventDefault();

        let elem = event.target;
        elem.select();
        document.execCommand('copy');
        document.getSelection().removeAllRanges();

        $('.alert').show();
        $('.alert').css('background', event.target.value);
    },

    'click .close'(event) {
        $('.alert').hide();
    },

    'click .delete-color'(event) {
        event.preventDefault();

        if (confirm('Are you sure?')) {
            Meteor.call('deleteColor', this._id);
        }
    }
});

Template.navigation.helpers({
    currentUserEmail() {
        return Meteor.user().emails[0].address;
    }
});

Template.navigation.events({
    'keyup .navbar-form'(event) {
        event.preventDefault();

        // Live Search
        // Show only those colors which are being searched
        let text = $(event.target).val().toLowerCase();
        $(".thumbnail").filter(function() {
            return $(this).find("input").val().toLowerCase().indexOf('#' + text) !== 0;
        }).parent().hide();

        $(".thumbnail").filter(function() {
            return $(this).find("input").val().toLowerCase().includes(text);
        }).parent().show();
    },

    'click .logout'(event) {
        event.preventDefault();

        Meteor.logout();
        Router.go('home');
    }
});

Template.register.events({
    'submit form'(event) {
        event.preventDefault();

        Accounts.createUser({
            email: event.target.email.value,
            password: event.target.password.value
        }, function (error) {
            if (error) {
                console.log(error.reason);
            } else {
                Router.go('home');
            }
        });
    },
});

Template.signin.events({
    'submit form'(event) {
        event.preventDefault();

        Meteor.loginWithPassword(event.target.email.value, event.target.password.value, (error) => {
            if (error) {
                console.log(error.reason);
            } else {
                if (Router.current().route.getName() == "signin") {
                    Router.go('home');
                }
            }
        });
    },
});