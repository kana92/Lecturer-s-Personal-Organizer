// make sure DOM is ready
$(document).ready(function() {

    //when hover over the menu selected item
    $('#menu li').hover(function() {

	    // animate it
	    // by changing the left padding from its initial value to 20px
        // set animation duration to 300 milliseconds


        $(this).animate({ paddingLeft: '20px' }, 300);


    }, function() {

        // on mouseout, put the original value back in

        $(this).animate({ paddingLeft: '0px' }, 300);


    });

});