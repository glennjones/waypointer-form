/*
   Highlight code for plain theme of waypointer
*/

addEventListener('load', function () {
    var preList = nodesToArray(document.querySelectorAll('pre code'));
    preList.forEach(function (pre) {
        hljs.highlightBlock(pre);
    });

    // add onsubmit event and activate submit button
    var formList = nodesToArray(document.querySelectorAll('form'));
    formList.forEach(function (form) {
        form.onsubmit = fireEndpoint;
        var submit = form.querySelector('input[type="submit"]');
        submit.disabled = false;
    });

});


function fireEndpoint(e) {
    var form = e.target ? e.target : e.srcElement;
    var method = form.dataset.method;
    var urlTemplate = form.dataset.urlTemplate;


    var inputList = nodesToArray(form.querySelectorAll('input'));
    inputList.forEach(function (input) {
        var name = input.name;
        var value = input.value;
        var parameterType = input.dataset.parameterType;

        switch (parameterType) {
            case 'path':
                urlTemplate = appendPathValue(urlTemplate, name, value);
                //Statements executed when the result of expression matches value1
                break;
            case 'query':
                //Statements executed when the result of expression matches value2
                break;
            case 'header':
                //Statements executed when the result of expression matches valueN
                break;
       }
    });


    fetchIt.get('//' + urlTemplate)
        .then(function (json) {
            alert('response:\n\n' + JSON.stringify(json, null, '  '));
        })
        .catch(function(err) {
            console.log(err);
        });


    e.preventDefault();
}


function appendPathValue(urlTemplate, name, value){
    return urlTemplate.replace('{' + name + '}',value);
}

function nodesToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}