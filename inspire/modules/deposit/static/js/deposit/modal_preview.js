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


define(function(require, exports, module) {
  "use strict";

  // require the Readmore library
  require("/vendors/readmore/readmore.min.js");

  var s;

  function ModalPreview($element, options) {
    // this.$element = $element;
    this.$element = $('#myModal');
    // this.options = settings;

    this.$acceptButton = this.$element.find('#success');
    this.$rejectButton = this.$element.find('#danger');
    this.data = {};
    this.labels = options.labels;
    this.hiddenFields = options.hiddenFields;
    this.init();
  }

  ModalPreview.prototype = {

    init: function() {
      s = this.settings;
      //console.log(s.myModal.find('.modal-body'));
      // this.renderModal(results);
      this.bindUIActions();
    },

    deleteHiddenFields: function(data) {
      var newObj = $.extend(true, {}, data);
      $.each(this.hiddenFields, function(index, id) {
        delete newObj[id];
      });
      return newObj;
    },

    setLabels: function(data) {
      var newObj = {};

      $.each(this.labels, function(id, label) {
        if (data[id]) {
          newObj[label] = data[id];
        }
      });

      if (data.authors) {
        newObj.Authors = data.authors;
      }

      return newObj;
    },

    show: function(data) {
      this.data = data;
      var renderData = this.deleteHiddenFields(data);
      renderData = this.setLabels(renderData);
      this.renderModal(renderData);
    },

    renderModal: function(jsonData) {

      var table = '<table class="table table-stripped"><tr><th>Labels</th><th>Values</th></tr><tbody>';

      console.log(jsonData);

      $.each(jsonData, function(index, user) {
        table += '<tr>';
        table += '<td style="width: 100px;">' + index + '</td>';
        if (typeof user !== 'object') {
          // console.log(user)
          // read more/less only in abstract field
          if (index === 'Abstract') {
            table += '<td><p class="readmore">' + user + '</p></td>';
          } else {
            table += '<td>' + user + '</td>';
          }
        } else {
          if (index === 'Title') {
            table += '<td>' + user[0] + '</td>';
          } else {
            table += '<td><p class="readmore">';
            for (var i in jsonData.Authors) {
              table += jsonData.Authors[i].name + '<br>';
            }
            table += '</p></td>';
          }
        }

        table += '</tr>';

        // $.publish('validation/results');
      });

      table += '</tbody></table>';

      $('#myModal .modal-body').html(table);
      this.$element.modal();
    },

    scrollSmooth: function(el) {
      var $root = $('html, body');

      $('#webdeposit_form_accordion > .panel:not(:first-child), #webdeposit_form_accordion + .well').removeClass('hide');

      var href = $.attr(el, 'href');
      $root.animate({
        scrollTop: $(href).offset().top
      }, 500, function() {
        window.location.hash = '';
      });
    },

    bindUIActions: function() {

      // console.log('bindUIActions');

      var that = this;

      this.$acceptButton.on('click', function(event) {
        that.$element.trigger('accepted', that.data);
      });

      this.$rejectButton.on('click', function(event) {
        that.$element.trigger('rejected');
      });

      $('#myModal').on('shown.bs.modal', function(e) {
        // console.log('on shown');

        $('.readmore').readmore({
          speed: 200,
          maxHeight: 80,
          moreLink: '<div class="pull-left"><a href="" class="fa fa-caret-square-o-down" style="font-size: 12px;"> Show more</a></div>',
          lessLink: '<div class="pull-left"><a href="" class="fa fa-caret-square-o-up" style="font-size: 12px;"> Show less</a></div>'
        });
      });

      // s.skip_import.on('click', function(e) {
      //   console.log('clicked');
      //   s.hide_elements.removeClass('hide');
      //   //var target = $('#webdeposit_form_accordion > .panel:eq(1)').children('.panel-collapse').attr('id');
      //   that.scrollSmooth(this);
      // });
    }
  };
  module.exports = ModalPreview;
});
