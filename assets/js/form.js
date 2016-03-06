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

    var textAreaList = nodesToArray(document.querySelectorAll('textarea[data-parameter-type="body"]'));
    textAreaList.forEach(function (textArea) {
        textArea.cm = CodeMirror.fromTextArea(textArea);
    });


});


function fireEndpoint(e) {
     e.preventDefault();

    var form = e.target ? e.target : e.srcElement;
    var method = form.dataset.method;
    var urlTemplate = form.dataset.urlTemplate;

    var inputList = nodesToArray(form.querySelectorAll('input, select'));
    var options = {
        method: method,
        headers: {},
        query: {},
        form: {}
    }

    inputList.forEach(function (input) {
        var name = input.name;
        var value;

        // from input
        if(input.value){
           value = input.value;
        }
        // from select
        if(input.options){
           value = input.options[input.selectedIndex].value
        }

        var parameterType = input.dataset.parameterType;

        switch (parameterType) {
            case 'path':
                urlTemplate = appendPathValue(urlTemplate, name, value);
                break;
            case 'query':
                options.query[name] = value;
                break;
            case 'header':
                options.headers[name] = value;
                break;
            case 'form':
                if(input.type !== 'file'){
                    options.form[name] = value;
                }
                break;
         }
    });


    // body with JSON
    var textArea = form.querySelector('textarea[data-parameter-type="body"]');
    if(textArea){
        if(textArea.cm){
            textArea.cm.save();
        }
        options.headers['Content-Type'] = textArea.dataset.mimeType;
        options.body = textArea.value;
    }


    // body with querystring
    if(hasProperties(options.form)){
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        options.body = queryStringObject(options.form);
    }
    delete options.form;


    // body with file
    var fileInput = document.querySelector('input[type="file"]')
    if(fileInput){
        var data = new FormData()
        data.append('file', fileInput.files[0])
        if(options.method === 'post' || options.method === 'put'){
            options.body = data;
        }
    }


    // querystring
    if(hasProperties(options.query)){
        var querystring = queryStringObject(options.query);
        urlTemplate = appendQueryString(urlTemplate, querystring);
    }
    delete options.query;





    fetch('//' + urlTemplate, options)
        .then(function (response) {
            displayResponseObj(form, response);
            return response.json();
        }).then(function (data) {
            displayBodyObj(form, data);
        }).catch(function (err) {
            console.log('Fetch Error', err);
        });


}


function appendPathValue(urlTemplate, name, value){
    return urlTemplate.replace('{' + name + '}',value);
}

function nodesToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}

function displayBodyObj(form, data){
    var responseBodyElt = form.querySelector('.response-body code');
    responseBodyElt.innerHTML = js_beautify(JSON.stringify(data), {indent: 2});
    hljs.highlightBlock(responseBodyElt.parentNode)
}

function displayResponseObj(form, response){
    var responseHeadersElt = form.querySelector('.response-headers code');

    outHeaders = 'Status: ' + response.status + '\n';
    outHeaders += 'URL: ' + response.url + '\n';
    for (var pair of response.headers.entries()) {
        outHeaders += pair[0]+ ': '+ pair[1] + '\n';
    }
    responseHeadersElt.innerHTML = outHeaders;
}


/**
	* does an object have any of its own properties
	*
	* @param  {Object} obj
	* @return {Boolean}
	*/
var hasProperties = function (obj) {

    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
};


/**
	* create a querystring from a object of pair values
	*
	* @param  {Object} obj
	* @return {String}
	*/
var queryStringObject = function (obj){
    var str = [];
    for(var item in obj){
        if (obj.hasOwnProperty(item) && obj[item]) {
            str.push(encodeURIComponent(item) + "=" + encodeURIComponent(obj[item]));
        }
    }
    return str.join("&");
}


/**
	* appends a querystring to a url
	*
	* @param  {String} urlTemplate
    * @param  {String} querystring
	* @return {String}
	*/
var appendQueryString = function (urlTemplate, querystring){
    if(querystring !== ''){
        var parts = urlTemplate.split('/')
        if(parts[parts.length-1].indexOf('?') > -1){
            return urlTemplate + '&' + querystring;
        }
        return urlTemplate + '?' + querystring;
    }
    return urlTemplate;
}