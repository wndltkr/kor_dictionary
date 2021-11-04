$(window).on("load",function () {

    var $animation_elements = $('.move-up');
    var $window = $(window);

    function check_if_in_view() {
        var window_height = $window.height();
        var window_top_position = $window.scrollTop();
        console.log("window_top_position: "+window_top_position)
        var window_bottom_position = (window_top_position + window_height);
        console.log("window_bottom_position: "+window_bottom_position)

        $.each($animation_elements, function () {
            var $element = $(this);
            console.log($element)
            var element_height = $element.outerHeight(true);
            var element_top_position = $element.offset().top;
            var element_bottom_position = (element_top_position + element_height);

            //check to see if this current container is within viewport
            if ((element_top_position <= window_bottom_position)) {
                $element.addClass('in-view');
                $element.queue(function (next) {
                    $element.addClass('in-view');
                    next();
                });
            } else {
                $element.removeClass('in-view');
                $element.queue(function (next) {
                    $element.removeClass('in-view');
                    next();
                });
            }

        });
    }


    $window.on('scroll resize', check_if_in_view);
    $window.trigger('scroll');

});