import { Meteor } from 'meteor/meteor';

import { Colors } from '../imports/api/colors';

Meteor.startup(() => {
  // code to run on server at startup
    Meteor.publish('color', () => {
       return Colors.find();
    });

    Meteor.methods({
        addColor(colorName, colorCode, userId, userEmail) {
            Colors.insert({
                name: colorName,
                code: colorCode,
                userId: userId,
                userEmail: userEmail,
                createdAt: new Date()
            });
        },

        deleteColor(id) {
            Colors.remove(id);
        }
    });
});
