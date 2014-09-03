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

  function ModalPreview($element, options) {
    this.$element = $element;
    this.$acceptButton = this.$element.find('#acceptData');
    this.$rejectButton = this.$element.find('#rejectData');
    this.data = {};
    this.labels = options.labels;
    this.hiddenFields = options.hiddenFields;
    this.init();
  }

  ModalPreview.prototype = {

    init: function() {
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

    // FIXME: use Hogan templates, see previous commit
    renderModal: function(jsonData) {
      // FIXME: move it to the closure?
      // if there is no identifier do nothing
      if ($.isEmptyObject(jsonData)) {
        return;
      }

      var table = '<table class="table table-hover"><tbody>';

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

      });

      table += '</tbody></table>';

      $('#myModal .modal-body').html(table);
      this.$element.modal();
    },

    bindUIActions: function() {

      var that = this;

      this.$acceptButton.on('click', function(event) {
        that.$element.trigger('accepted', [that.data, this]);
      });

      this.$rejectButton.on('click', function(event) {
        that.$element.trigger('rejected');
      });

      this.$element.on('shown.bs.modal', function(e) {

        // trigger the More/Less on the Authors and Abstract fields
        $('.readmore').readmore({
          speed: 200,
          maxHeight: 80,
          moreLink: '<div class="pull-left"><a href="" class="fa fa-caret-square-o-down"' +
            'style="font-size: 12px;"> Show more</a></div>',
          lessLink: '<div class="pull-left"><a href="" class="fa fa-caret-square-o-up"' +
            'style="font-size: 12px;"> Show less</a></div>'
        });
      });

    }
  };
  module.exports = ModalPreview;
});
