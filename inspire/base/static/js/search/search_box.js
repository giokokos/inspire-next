/*
** This file is part of INSPIRE.
** Copyright (C) 2014 CERN.
**
** INSPIRE is free software: you can redistribute it and/or modify
** it under the terms of the GNU General Public License as published by
** the Free Software Foundation, either version 3 of the License, or
** (at your option) any later version.
**
** INSPIRE is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with INSPIRE. If not, see <http://www.gnu.org/licenses/>.
**
** In applying this licence, CERN does not waive the privileges and immunities
** granted to it by virtue of its status as an Intergovernmental Organization
** or submit itself to any jurisdiction.
*/


(function($) {

    /* TODO: refactor! */

// function getQueryVariable(variable) {
//     var query = window.location.search.substring(1);
//     var vars = query.split('&');
//     for (var i = 0; i < vars.length; i++) {
//         var pair = vars[i].split('=');
//         if (decodeURIComponent(pair[0]) == variable) {
//             return decodeURIComponent(pair[1]);
//         }
//     }
//     console.log('Query variable %s not found', variable);
// }

// // FIX ME
// console.log(getQueryVariable('cc'));
// console.log($('#myTab a[href="#'+getQueryVariable('cc')+'"]'))
// $('#myTab a[href="#'+getQueryVariable('cc')+'"]').tab('show')
// return;
// until here

    var json, tabsState;
    $('#myTab a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var href, json, parentId, tabsState;
        tabsState = localStorage.getItem("tabs-state");
        json = JSON.parse(tabsState || "{}");
        parentId = $(e.target).parents("ul.nav.nav-tabs").attr("id");
        href = $(e.target).attr('href');
        json[parentId] = href;

        // display the options only for the default collection
        if(href=="#Literature") {
            $('#drop').show();
        } else {
            $('#drop').hide();
        }

        return localStorage.setItem("tabs-state", JSON.stringify(json));
    });

    tabsState = localStorage.getItem("tabs-state");
    json = JSON.parse(tabsState || "{}");

    $.each(json, function(containerId, href) {
        return $("#" + containerId + " a[href=" + href + "]").tab('show');
    });

    var href = json.myTab
        , el = $("a[href=" + href + "]")
        , $collection = el.data('cc');

    $('input#collection').val($collection);

    $("ul#myTab").each(function() {
        var $this = $(this);

        // when in homepage go to the default tab
        if (window.location.href.split("/").length < 5 && location.search == "") {
            $('input#collection').val($this.find("a[data-toggle=tab]:first").data('cc'));
            return $this.find("a[data-toggle=tab]:first").tab("show");
        }
    });

    $('#myTab a[data-toggle="tab"]').on('click', function(e){
        e.preventDefault();
        var $this = $(this)
            , $collection = $this.data('cc');

        if ($this.attr('id') != 'hep') {
            $('#drop').hide();
        } else {
            $('#drop').show();
        }

        // send the cc value to the hidden input
        $('input#collection').val($collection);
    });

    // this fix removes the cc parameter when inside default collection
    $( "form#searchform" ).submit(function( event ) {
        if ( $( "input#collection" ).val() === "" ) {
            $("input#collection").prop('disabled', true);
            return;
        }
    });

})(jQuery);