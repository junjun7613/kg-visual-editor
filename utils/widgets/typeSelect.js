var ColorSelectorWidget = function (args) {

    // 1. Find a current color setting in the annotation, if any
    var currentColorBody = args.annotation ?
        args.annotation.bodies.find(function (b) {
            return b.field == 'type';
        }) : null;

    // 2. Keep the value in a variable
    var currentColorValue = currentColorBody ? currentColorBody.value : null;

    // 3. Triggers callbacks on user action
    var addTag = function (evt) {
        if (currentColorBody) {
            args.onUpdateBody(currentColorBody, {
                field: "type",
                value: evt.target.dataset.tag
            });
        } else {
            args.onAppendBody({
                field: "type",
                value: evt.target.dataset.tag
            });
        }
    }

    // 4. This part renders the UI elements
    var createButton = function (label, value) {
        var button = document.createElement('button');
        button.className = 'r6o-btn outline';
        button.style.margin = "1px";

        if (value == currentColorValue)
            button.className = 'r6o-btn';

        button.textContent = label
        button.dataset.tag = value;
        button.addEventListener('click', addTag);
        return button;
    }

    var container = document.createElement('div');
    container.style.padding = "8px";

    const himiko = "https://junjun7613.github.io/MicroKnowledge/himiko.owl#"

    const data = [
        {
            "label": "Person",
            "value": `${himiko}PersonDescription`
        },
        {
            "label": "Place",
            "value": `${himiko}PlaceDescription`
        },
        {
            "label": "Organization",
            "value": `${himiko}OrgDescription`
        },
        {
            "label": "Date",
            "value": `${himiko}DateDescription`
        },
        {
            "label": "Object",
            "value": `${himiko}PhysicalObjDescription`
        },
        {
            "label": "Concept",
            "value": `${himiko}ConceptualObjDescription`
        }
    ]

    for(const item of data) {
        var button = createButton(item.label, item.value);
        container.appendChild(button);
    }

    return container;
}

export default ColorSelectorWidget;