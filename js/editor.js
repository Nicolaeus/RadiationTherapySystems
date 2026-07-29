/*
==============================================================================
Radiotherapy Equipment Database
Editor

Author : N N
==============================================================================*/

'use strict';

const Editor = {

    currentMachine: null,

    currentManufacturer: null,

    modified: false

};

/*==============================================================================
 New machine
==============================================================================*/

Editor.new = function () {

    this.currentManufacturer = null;

    this.currentMachine = {};

    this.modified = false;

    this.render();

};

/*==============================================================================
 Edit machine
==============================================================================*/

Editor.edit = function (id) {

    const machine = Database.getMachine(id);

    if (!machine)
        return;

    this.currentManufacturer = machine.manufacturerId;

    this.currentMachine = structuredClone(machine);

    this.modified = false;

    this.render();

};

/*==============================================================================
 Render editor
==============================================================================*/

Editor.render = function () {

    const container = document.getElementById("editor-view");

    if (!container)
        return;

    container.innerHTML = "";

    container.appendChild(

        this.createToolbar()

    );

    container.appendChild(

        this.createForm()

    );

};

/*==============================================================================
 Toolbar
==============================================================================*/

Editor.createToolbar = function () {

    const toolbar = document.createElement("div");

    toolbar.className = "editor-toolbar";

    toolbar.innerHTML = `

        <div>

            <h2>

                ${this.currentMachine.id
                    ? "Edit Machine"
                    : "New Machine"}

            </h2>

        </div>

        <div class="editor-actions">

            <button
                class="btn btn-secondary"
                onclick="showView('list')">

                Cancel

            </button>

            <button
                class="btn btn-primary"
                onclick="saveMachine()">

                Save

            </button>

        </div>

    `;

    return toolbar;

};

/*==============================================================================
 Create form
==============================================================================*/

Editor.createForm = function () {

    const wrapper = document.createElement("div");

    wrapper.className = "form-container";

    const schema = Database.database.schema;

    if (!schema)
        return wrapper;

    Object.entries(schema).forEach(([name, definition]) => {

        wrapper.appendChild(

            this.createSection(

                name,

                definition,

                this.currentMachine[name]

            )

        );

    });

    return wrapper;

};

/*==============================================================================
 Section
==============================================================================*/

Editor.createSection = function (

    name,

    definition,

    values

) {

    const section = document.createElement("div");

    section.className = "form-section";

    const body = this.createFields(

        definition,

        values ?? {},

        name

    );

    section.innerHTML = `

        <div class="form-section-header">

            <div class="form-section-title">

                ${Viewer.pretty(name)}

            </div>

        </div>

    `;

    section.appendChild(body);

    return section;

};

/*==============================================================================
 Recursive fields
==============================================================================*/

Editor.createFields = function (

    schema,

    values,

    path

) {

    const body = document.createElement("div");

    body.className = "form-section-body";

    const grid = document.createElement("div");

    grid.className = "form-grid";

    Object.entries(schema).forEach(([key, type]) => {

        const fieldPath = path + "." + key;

        const value = values[key];

        if (typeof type === "object") {

            const nested = document.createElement("div");

            nested.className = "form-field full";

            nested.appendChild(

                this.createFields(

                    type,

                    value ?? {},

                    fieldPath

                )

            );

            grid.appendChild(nested);

            return;

        }

        grid.appendChild(

            this.createField(

                key,

                type,

                value,

                fieldPath

            )

        );

    });

    body.appendChild(grid);

    return body;

};

/*==============================================================================
 Field
==============================================================================*/

Editor.createField = function (

    name,

    type,

    value,

    path

) {

    const field = document.createElement("div");

    field.className = "form-field";

    const label = document.createElement("label");

    label.textContent = Viewer.pretty(name);

    field.appendChild(label);

    let input;

    switch (type) {

        case "boolean":

            input = document.createElement("input");

            input.type = "checkbox";

            input.checked = value === true;

            break;

        case "number":

            input = document.createElement("input");

            input.type = "number";

            input.value = value ?? "";

            break;

        case "textarea":

            input = document.createElement("textarea");

            input.value = value ?? "";

            break;

        case "array":

            input = this.createArrayEditor(

                value ?? [],

                path

            );

            field.appendChild(input);

            return field;

        default:

            input = document.createElement("input");

            input.type = "text";

            input.value = value ?? "";

    }

    input.dataset.path = path;

    input.addEventListener(

        "input",

        () => this.markModified()

    );

    input.addEventListener(

        "change",

        () => this.markModified()

    );

    field.appendChild(input);

    return field;

};

/*==============================================================================
 Array editor
==============================================================================*/

Editor.createArrayEditor = function (

    array,

    path

) {

    const wrapper = document.createElement("div");

    wrapper.className = "array-editor";

    array.forEach(value => {

        wrapper.appendChild(

            this.createArrayItem(

                value,

                path

            )

        );

    });

    const add = document.createElement("button");

    add.className = "btn btn-secondary";

    add.textContent = "Add";

    add.onclick = () => {

        wrapper.insertBefore(

            this.createArrayItem("", path),

            add

        );

        this.markModified();

    };

    wrapper.appendChild(add);

    return wrapper;

};

Editor.createArrayItem = function (

    value,

    path

) {

    const row = document.createElement("div");

    row.className = "array-item";

    row.innerHTML = `

        <input
            type="text"
            value="${value}"
            data-path="${path}">

        <button class="btn-icon">

            ✕

        </button>

    `;

    row.querySelector("input")

        .addEventListener(

            "input",

            () => this.markModified()

        );

    row.querySelector("button")

        .onclick = () => {

            row.remove();

            this.markModified();

        };

    return row;

};

/*==============================================================================
 Save
==============================================================================*/

Editor.save = async function () {

    this.readForm();

    if (!this.validate())
        return;

    if (this.currentMachine.id &&
        Database.getMachine(this.currentMachine.id)) {

        Database.updateMachine(

            this.currentMachine.id,

            this.currentMachine

        );

    }
    else {

        Database.addMachine(

            this.currentManufacturer,

            this.currentMachine

        );

    }

    Database.save();

    this.modified = false;

};

/*==============================================================================
 Read form
==============================================================================*/

Editor.readForm = function () {

    document

        .querySelectorAll("[data-path]")

        .forEach(input => {

            const path = input.dataset.path.split(".");

            let object = this.currentMachine;

            while (path.length > 1) {

                const key = path.shift();

                object[key] ??= {};

                object = object[key];

            }

            const key = path[0];

            if (input.type === "checkbox") {

                object[key] = input.checked;

            }
            else if (input.type === "number") {

                object[key] =
                    input.value === ""
                        ? null
                        : Number(input.value);

            }
            else {

                object[key] = input.value;

            }

        });

};

/*==============================================================================
 Validation
==============================================================================*/

Editor.validate = function () {

    if (!this.currentMachine.id) {

        alert("Machine id is mandatory.");

        return false;

    }

    if (!this.currentMachine.name) {

        alert("Machine name is mandatory.");

        return false;

    }

    return true;

};

/*==============================================================================
 Modified
==============================================================================*/

Editor.markModified = function () {

    this.modified = true;

    updateStatus("Modified");

};

/*==============================================================================
 Remove
==============================================================================*/

Editor.remove = async function (id) {

    Database.deleteMachine(id);

    Database.save();

};

/*==============================================================================
 End
==============================================================================*/