/*
 * This file is part of INSPIRE.
 * Copyright (C) 2014 CERN.
 *
 * INSPIRE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * INSPIRE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with INSPIRE. If not, see <http://www.gnu.org/licenses/>.
 *
 * In applying this licence, CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

/**
 * Display a spinner when importing Identifiers
 * using the spin.js library
 */
var opts = {
        lines: 9, // The number of lines to draw
        length: 9, // The length of each line
        width: 8, // The line thickness
        radius: 24, // The radius of the inner circle
        corners: 0.6, // Corner roundness (0..1)
        rotate: 5, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1.1, // Rounds per second
        trail: 69, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
      },
      target,
      spinner = new Spinner(opts).spin(),
      $document = $(document);

/**
 * Controls the animation when importing .DOI/arXiv/ISBN
 * @returns Object with startAnimation and stopAnimation methods
 */
var animationController = function () {
    var timeout = null;
    var delayBy = 200; //Number of milliseconds to wait before ajax animation starts.

    var pub = {};

    var actualAnimationStart = function() {
        target = $('body'); //grabs the body to append the element
        target.append(spinner.el);
    };

    var actualAnimationStop = function () {
        spinner.spin(false);
    };

    pub.startAnimation = function () {
        timeout = setTimeout(actualAnimationStart, delayBy);
    };

    pub.stopAnimation = function () {
        //If ajax call finishes before the timeout occurs, we wouldn't have
        //shown any animation.
        clearTimeout(timeout);
        actualAnimationStop();
    };

    return pub;
}();

function bindAjaxAnimations() {
    $document.ajaxStart(animationController.startAnimation);
    $document.ajaxStop(animationController.stopAnimation);
}

// handlers to document to trigger animations
bindAjaxAnimations();
