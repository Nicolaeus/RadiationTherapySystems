/*
==============================================================================
Radiotherapy Equipment Database
Comparison Engine

Author : N N
==============================================================================*/

'use strict';

const Compare = {

    selectedMachines: [],

    maxMachines: 5

};

/*==============================================================================
 Add machine
==============================================================================*/

Compare.add = function (id) {

    if (this.selectedMachines.includes(id))
        return;

    if (this.selectedMachines.length >= this.maxMachines) {

        alert(
            "Maximum " +
            this.maxMachines +
            " machines."
        );

        return;

    }

    this.selectedMachines.push(id);

    this.render();

};

/*==============================================================================
 Remove machine
==============================================================================*/

Compare.remove = function (id) {

    this.selectedMachines =

        this.selectedMachines.filter(

            machineId => machineId !== id

        );

    this.render();

};

/*==============================================================================
 Clear
==============================================================================*/

Compare.clear = function () {

    this.selectedMachines = [];

    this.render();

};

/*==============================================================================
 Render
==============================================================================*/

Compare.render = function () {

    const container =

        document.getElementById("compare-view");

    if (!container)
        return;

    container.innerHTML = "";

    if (this.selectedMachines.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h2>No comparison</h2>

                <p>

                    Select one or more machines
                    to compare them.

                </p>

            </div>

        `;

        return;

    }

    container.appendChild(

        this.createToolbar()

    );

    container.appendChild(

        this.createTable()

    );

};

/*==============================================================================
 Toolbar
==============================================================================*/

Compare.createToolbar = function () {

    const toolbar = document.createElement("div");

    toolbar.className = "toolbar";

    toolbar.innerHTML = `

        <div class="toolbar-left">

            <h2>

                Machine comparison

            </h2>

        </div>

        <div class="toolbar-right">

            <button
                class="btn btn-secondary"
                onclick="Compare.exportCSV()">

                Export CSV

            </button>

            <button
                class="btn btn-secondary"
                onclick="Compare.exportJSON()">

                Export JSON

            </button>

            <button
                class="btn btn-danger"
                onclick="Compare.clear()">

                Clear

            </button>

        </div>

    `;

    return toolbar;

};

/*==============================================================================
 Table
==============================================================================*/

Compare.createTable = function () {

    const wrapper = document.createElement("div");

    wrapper.className = "table-container";

    const table = document.createElement("table");

    table.className = "compare-table";

    const machines =

        this.selectedMachines.map(

            id => Database.getMachine(id)

        );

    const fields =

        this.collectFields(machines);

    table.appendChild(

        this.createHeader(machines)

    );

    const tbody = document.createElement("tbody");

    fields.forEach(field => {

        tbody.appendChild(

            this.createRow(

                field,

                machines

            )

        );

    });

    table.appendChild(tbody);

    wrapper.appendChild(table);

    return wrapper;

};

/*==============================================================================
 Header
==============================================================================*/

Compare.createHeader = function (machines) {

    const thead = document.createElement("thead");

    const row = document.createElement("tr");

    row.innerHTML = "<th>Property</th>";

    machines.forEach(machine => {

        row.innerHTML += `

            <th>

                ${machine.name}

                <br>

                <small>

                    ${machine.manufacturer}

                </small>

            </th>

        `;

    });

    thead.appendChild(row);

    return thead;

};

/*==============================================================================
 Collect fields
==============================================================================*/

Compare.collectFields = function (machines) {

    const fields = new Set();

    machines.forEach(machine => {

        this.walk(

            machine,

            "",

            fields

        );

    });

    return [...fields].sort();

};

/*==============================================================================
 Recursive walk
==============================================================================*/

Compare.walk = function (

    object,

    prefix,

    fields

) {

    Object.entries(object).forEach(([key, value]) => {

        const path =

            prefix
                ? prefix + "." + key
                : key;

        if (

            value &&
            typeof value === "object" &&
            !Array.isArray(value)

        ) {

            this.walk(

                value,

                path,

                fields

            );

        }
        else {

            fields.add(path);

        }

    });

};

/*==============================================================================
 Row
==============================================================================*/

Compare.createRow = function (

    field,

    machines

) {

    const row = document.createElement("tr");

    const property = document.createElement("td");

    property.className = "compare-property";

    property.textContent =

        Viewer.pretty(

            field.replaceAll(".", " / ")

        );

    row.appendChild(property);

    machines.forEach(machine => {

        const cell = document.createElement("td");

        cell.className = "compare-value";

        cell.innerHTML =

            this.format(

                this.getValue(

                    machine,

                    field

                )

            );

        row.appendChild(cell);

    });

    return row;

};

/*==============================================================================
 Value
==============================================================================*/

Compare.getValue = function (

    object,

    path

) {

    return path

        .split(".")

        .reduce(

            (current, key) =>

                current?.[key],

            object

        );

};

/*==============================================================================
 Formatting
==============================================================================*/

Compare.format = function (value) {

    if (

        value === undefined ||

        value === null ||

        value === ""

    ) {

        return '<span class="value-null">—</span>';

    }

    if (typeof value === "boolean") {

        return value

            ? '<span class="value-true">✔</span>'

            : '<span class="value-false">✖</span>';

    }

    if (Array.isArray(value)) {

        return value.join("<br>");

    }

    return value;

};

/*==============================================================================
 Export JSON
==============================================================================*/

Compare.exportJSON = function () {

    const data =

        this.selectedMachines.map(

            id => Database.getMachine(id)

        );

    const blob = new Blob(

        [

            JSON.stringify(

                data,

                null,

                4

            )

        ],

        {

            type: "application/json"

        }

    );

    this.download(

        blob,

        "comparison.json"

    );

};

/*==============================================================================
 Export CSV
==============================================================================*/

Compare.exportCSV = function () {

    const machines =

        this.selectedMachines.map(

            id => Database.getMachine(id)

        );

    const fields =

        this.collectFields(machines);

    let csv = "Property";

    machines.forEach(machine => {

        csv += `;"${machine.name}"`;

    });

    csv += "\n";

    fields.forEach(field => {

        csv += `"${field}"`;

        machines.forEach(machine => {

            let value =

                this.getValue(

                    machine,

                    field

                );

            if (Array.isArray(value))
                value = value.join(",");

            if (value === undefined)
                value = "";

            csv += `;"${value}"`;

        });

        csv += "\n";

    });

    const blob = new Blob(

        [

            csv

        ],

        {

            type: "text/csv"

        }

    );

    this.download(

        blob,

        "comparison.csv"

    );

};

/*==============================================================================
 Download helper
==============================================================================*/

Compare.download = function (

    blob,

    filename

) {

    const url =

        URL.createObjectURL(blob);

    const a =

        document.createElement("a");

    a.href = url;

    a.download = filename;

    a.click();

    URL.revokeObjectURL(url);

};

/*==============================================================================
 End
==============================================================================*/