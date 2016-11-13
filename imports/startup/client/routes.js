import { IronRouter } from 'meteor/iron:router';

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {
    template: 'content',
    name: 'home',
    // onBeforeAction: function() {
    //     if (Meteor.userId()) {
    //         this.next();
    //     } else {
    //         this.render('signin');
    //     }
    // }
});

Router.route('/add', {
    template: 'addColor',
    name: 'add',
    onBeforeAction: function() {
        if (Meteor.userId()) {
            this.next();
        } else {
            this.render('signin');
        }
    }
});

Router.route('/register', {
    template: 'register',
    name: 'register'
});

Router.route('/login', {
    template: 'signin',
    name: 'signin'
});