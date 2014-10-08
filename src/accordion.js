define(function(require, exports, module) {
    /**
     * 可展开收起的Accordion
     * @module Accordion
     */
    'use strict';

    var $ = require('$'),
        Widget = require('widget');

    /**
     * 简单Accordion，从页面已有DOM结构生成
     *
     * @class Accordion
     * @extend Widget
     * @constructor
     */
    var Accordion = Widget.extend({

        defaults: {
            /**
             * 默认选中索引
             * @attribute selected
             * @default 0
             * @type {Number}
             */
            selected: 0,

            /**
             * 组件样式前辍
             * @attribute classPrefix
             * @default ue-accordion
             * @type {String}
             */
            classPrefix: 'ue-accordion',

            /**
             * 指定点击的元素，使用jquery选择器
             * @attribute header
             * @default h3
             * @type {String}
             */
            header: 'h3',

            /**
             * 指定panel元素，使用jquery选择器
             * @attribute panel
             * @default div,元素的直接子级
             * @type {String}
             */
            panel: 'div',

            /**
             * panel选中后的样式
             * @attribute panelClass
             * @default active in
             * @type {String}
             */
            panelClass: 'active in',

            /**
             * hander选中后的样式
             * @attribute handerClass
             * @default active
             * @type {String}
             */
            handerClass: 'active',

            /**
             * 切换效果,可以使用内置的3种，也可以直接配置{hide:function(){},show:function(){}}来自定义
             * @attribute effect
             * @default vertical,支持none、vertical(垂直收缩)、horizontal（水平收缩）
             * @type {String|Object}
             */
            effect: 'vertical',

            delegates: {
                'click [data-role=header]': 'setSelected'
            }
        },

        setup: function() {
            var self = this;
            var effect = self.option('effect');
            var panels = self.option('panel');

            if ($.trim(panels) == 'div') {
                self.panels = self.element.children(panels);
            } else {
                self.panels = self.$(panels);
            }

            self.headers = $(self.option('header'));
            if (typeof effect === 'string') {
                self.effects = EFFECTS[effect];
            } else {
                self.effects = effect;
            }
            self.headers.each(function(i, current) {
                $(current).data('panel', self.panels.eq(i))
                    .attr('data-role', 'header');
            });
            self.panels.each(function(i, current) {
                var $cur = $(current);
                $cur.attr({
                    'data-height': $cur.height(),
                    'data-width': $cur.width()
                });
            });
            self.panels.hide();
            self.setSelected(self.option('selected'));
        },

        /**
         * 设置
         * @method setSelected
         * @param {Number} e 设置要展开的索引号
         */
        setSelected: function(e) {
            var self = this;
            var headers = self.headers;
            var panels = self.panels;
            var paneClass = self.option('panelClass');
            var handClass = self.option('handerClass');
            var curHeader, curPanel, parameter;
            if (typeof e === 'number') {
                curHeader = headers.eq(e);
            } else {
                curHeader = $(e.currentTarget);
            }
            if (self.curHeader && curHeader[0] == self.curHeader[0]) {
                return;
            }
            curPanel = curHeader.data('panel');
            parameter = {
                prePanel: self.curPanel,
                curPanel: curPanel,
                preHeader: self.curHeader,
                curHeader: curHeader
            };
            if (!self.fire('switch', parameter)) {
                return;
            }
            panels.removeClass(paneClass);
            headers.removeClass(handClass);
            curHeader.addClass(handClass);
            curPanel.addClass(paneClass);
            if (self.curPanel) {
                self.effects.hide.call(self, parameter);
            }
            self.effects.show.call(self, parameter);
            self.curPanel = curPanel;
            self.curHeader = curHeader;
        }
    });


    /**
     * 切换效果
     * @type {Object}
     */
    var EFFECTS = {

        none: {
            hide: function(parameter) {
                parameter.prePanel.hide();
            },
            show: function(parameter) {
                parameter.curPanel.show();
            }
        },

        vertical: {
            hide: function(parameter) {
                parameter.prePanel.slideUp(200);
            },
            show: function(parameter) {
                parameter.curPanel.slideDown(200);
            }
        },

        horizontal: {
            hide: function(parameter) {
                parameter.prePanel.animate({
                    width: '0'
                }, 200, 'swing', function() {
                    $(this).hide();
                });
            },
            show: function(parameter) {
                var width = parameter.curPanel.attr('data-width');
                parameter.curPanel.width(0).show();
                parameter.curPanel.animate({
                    width: width
                }, 200, 'swing');
            }
        }
    };

    Accordion.EFFECTS = EFFECTS;
    module.exports = Accordion;

});
