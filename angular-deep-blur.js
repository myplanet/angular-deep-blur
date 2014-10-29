define([ 'angular' ], function (ng) {
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

    // child links must use tabindex=0 to capture focus in Webkit and avoiding triggering blur
    ng.module('mp.deepBlur', []).directive('deepBlur', [ '$timeout', function ($timeout) {
        return {
            restrict: 'A',
            controller: [ '$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                var leaveExpr = $attrs.deepBlur,
                    dom = $element[0];

                function onBlur(e) {
                    if (!containsDom(dom, e.relatedTarget)) {
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
                    dom.attachEvent('focusout', onBlur);
                }
            } ]
        };
    } ]);
});
