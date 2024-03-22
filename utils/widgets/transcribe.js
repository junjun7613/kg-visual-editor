var TranscribeWidget = function (args) {
    var currentColorBody = args.annotation ?
        args.annotation.bodies.find(function (b) {
            return b.field == 'transcribe';
        }) : null;

    // 3. Triggers callbacks on user action
    var saveText = function (evt) {
        if (currentColorBody) {
            args.onUpdateBody(currentColorBody, {
                field: "transcribe",
                value: evt.target.value
            });
        } else {
            args.onAppendBody({
                field: "transcribe",
                value: evt.target.value
            });
        }
    }

    var container = document.createElement('div');
    container.className = 'r6o-widget comment editable';

    var input = document.createElement('textarea');
    input.name = "transcribe";
    input.className = "r6o-editable-text"
    input.value = currentColorBody ? currentColorBody.value : ''
    input.placeholder = "transcribe.."
    input.onchange = saveText;

    container.appendChild(input);

    return container;
}

export default TranscribeWidget;