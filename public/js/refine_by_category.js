$(document).on("ready", function(){
    
    let refine_by = []
    
    // Reset all checkboxes
    function resetBoxes(){
        $(".each-result").show()
        $(".each-result").trigger("marker:show")
        $(".each-result").trigger("distance:display");
        $(".form-check-input").attr("checked", false)
    }
    
    // When a 'Refine by City' box is checked...
    $(".form-check-input").click(function(){ 
        addRefine($(this).val())
        showRefined()
    })
    
    // Add its value to refine_by (or remove if present)
    function addRefine(x){
        if ($.inArray(x, refine_by) === -1){
            refine_by.push($.trim(x))
        }
        else {
            refine_by.splice($.inArray(x, refine_by), 1)
        }
        console.log(refine_by)
    }
    
    // Hide/show .search-results according to refine_by contents
    function showRefined(){
        let count = 0
        $(".each-result").each(function(){ // Go through each search result
            const this_result = $(this)
            if (refine_by.length === 0){ // If no checkbox is selected, show this result
                this_result.show()
                this_result.trigger("marker:show")
                this_result.trigger("distance:display")
                count++
            } else { 
                // Otherwise, add each category listed under this result to an array
                const categories = $(this).find("li.category").map(function (){
                    return $(this).text() 
                }).get()
                
                // Does this result have ALL checked categories?
                function checkCategories(refine_by){
                    for (i = 0; i < refine_by.length; i++){
                        if ($.inArray(refine_by[i], categories) === -1){
                            return false // If not, stop the function
                        }
                    }
                    return true
                }
                
                if (checkCategories(refine_by) === true){
                    this_result.show()
                    this_result.trigger("marker:show")
                    this_result.trigger("distance:display")
                    count++
                } else {
                    this_result.hide()
                    this_result.trigger("marker:hide")
                }  
            }
        })
        numberResults(count)
    }
    
    // Update #number-results
    function numberResults(count){
        let word = " results"
        if (count === 1){
            word = " result"
        }
        $("#number-results").text(count + word)
    }
    
    // Collapse descriptions by default
    $(".each-result").click(function(){
        $(this).find(".full-description").toggleClass("collapsed");
        $(this).toggleClass("expanded");
    });
    
    resetBoxes()
})