(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'module', 'angular' ], function (module, angular) {
            module.exports = factory(angular);
        });
    } else if (typeof module === 'object') {
        module.exports = factory(require('angular'));
    } else {
        if (!root.mp) {
            root.mp = {};
        }

        root.mp.deepBlur = factory(root.angular);
    }
}(this, function (angular) {
    'use strict';

    function containsDom(parent, dom) {
        while (dom) {
            if (dom === parent) {
                return true;
            }

            dom = dom.parentNode;
        }

        return false;
    }

    return angular.module('mp.deepBlur', [])
        // child links must use tabindex=0 to capture focus in Webkit and avoiding triggering blur
        .directive('deepBlur', [ '$timeout', function ($timeout) {
            return {
                restrict: 'A',
                controller: [ '$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                    var leaveExpr = $attrs.deepBlur,
                        dom = $element[0];

                    function onBlur(e) {
                        if (!containsDom(dom, e.relatedTarget || e.toElement)) { // toElement for IE8
                            // wrap in a timeout to avoid digest cycle conflict with other event handlers
                            $timeout(function () {
                                $scope.$apply(leaveExpr);
                            }, 10);
                        }
                    }

                    if (dom.addEventListener) {
                        dom.addEventListener('blur', onBlur, true);
                    } else {
                        // For IE8
                        dom.attachEvent('onfocusout', onBlur);
                    }
                } ]
            };
        } ])
        .directive('deepFocus', [ '$timeout', function ($timeout) {
            return {
                restrict: 'A',
                controller: [ '$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                    var enterExpr = $attrs.deepFocus,
                        dom = $element[0];

                    function onFocus(e) {
                        if (!containsDom(dom, e.relatedTarget || e.toElement)) { // toElement for IE8
                            // wrap in a timeout to avoid digest cycle conflict with other event handlers
                            $timeout(function () {
                                $scope.$apply(enterExpr);
                            }, 10);
                        }
                    }

                    if (dom.addEventListener) {
                        dom.addEventListener('focus', onFocus, true);
                    } else {
                        // For IE8
                        dom.attachEvent('onfocusin', onFocus);
                    }
                } ]
            };
        } ])

        .directive('deepChange', [ '$timeout', function ($timeout) {
            return {
                restrict: 'A',
                controller: [ '$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                    var enterExpr = $attrs.deepChange,
                        dom = $element[0];

                    function onFocus(e) {
                        if (!containsDom(dom, e.relatedTarget || e.toElement)) { // toElement for IE8
                            // wrap in a timeout to avoid digest cycle conflict with other event handlers
                            $timeout(function () {
                                $scope.$apply(enterExpr);
                            }, 10);
                        }
                    }

                    if (dom.addEventListener) {
                        dom.addEventListener('focus', onFocus, true);
                    } else {
                        // For IE8
                        dom.attachEvent('onfocusin', onFocus);
                    }
                } ]
            };
        } ]);
}));