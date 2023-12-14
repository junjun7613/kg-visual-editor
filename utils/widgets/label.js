var ExternalWidget = function (args) {
    var currentColorBody = args.annotation ?
        args.annotation.bodies.find(function (b) {
            return b.field == 'label';
        }) : null;

    // 3. Triggers callbacks on user action
    var saveText = function (evt) {
        if (currentColorBody) {
            args.onUpdateBody(currentColorBody, {
                field: "label",
                value: evt.target.value
            });
        } else {
            args.onAppendBody({
                field: "label",
                value: evt.target.value
            });
        }
    }

    var container = document.createElement('div');
    container.className = 'r6o-widget comment editable';

    var input = document.createElement('textarea');
    input.name = "label";
    input.className = "r6o-editable-text"
    input.value = currentColorBody ? currentColorBody.value : ''
    input.placeholder = "Input Label. ex) 葛飾北斎"
    input.onchange = saveText;

    container.appendChild(input);

    return container;
}

export default ExternalWidget;