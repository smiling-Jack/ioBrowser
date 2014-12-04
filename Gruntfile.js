/**
 * Created by jack on 03.12.2014.
 */
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.initConfig({
        nodewebkit: {
            win: {
                options: {
                    platforms: ['win'],
                    buildDir: './build/win/', // Where the build version of my node-webkit app is saved
                },
                src: ['./src/**/*'] // Your node-webkit app
            },
           osx: {
                options: {
                    platforms: ['osx'],
                    buildDir: './build/osx/', // Where the build version of my node-webkit app is saved
                },
                src: ['./src/**/*'] // Your node-webkit app
            },
            linux: {
                options: {
                    platforms: ['linux32'],
                    buildDir: './build/linux/', // Where the build version of my node-webkit app is saved
                },
                src: ['./src/**/*'] // Your node-webkit app
            }
        }
    });

};