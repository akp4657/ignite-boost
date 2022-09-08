

// https://stackoverflow.com/questions/32704027/how-to-call-bootstrap-alert-with-jquery
const handleError = (message) => {
    $("#dangerAlert").text(message);
    $("#dangerAlert").show();
    $("#dangerAlert").addClass('in');
    $("#dangerAlert").delay(2000).fadeOut('slow');
    return false;
};

const handleSuccess = (message) => {
    $("#successAlert").text(message);
    $("#successAlert").show();
    $("#successAlert").addClass('in');
    $("#successAlert").delay(2000).fadeOut('slow');
    return false;
}


const redirect = (response) => {
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: 'json',
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            alert(messageObj.error)
        }
    });
};

