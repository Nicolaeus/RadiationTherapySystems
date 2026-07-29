/**
 * field.js
 * Machine Viewer V2
 * Editable fields
 */

class Field {

    /*==============================================================
        Text
    ==============================================================*/

    static text(path, value) {

        if (!ViewerV2.editMode) {

            return MachineUtils.value(value);

        }

        return `

<input
    type="text"
    class="field-input"
    value="${MachineUtils.escape(value ?? "")}"
    onchange="Field.update('${path}', this.value)">

`;

    }

    /*==============================================================
        Number
    ==============================================================*/

    static number(path, value) {

        if (!ViewerV2.editMode) {

            return MachineUtils.value(value);

        }

        return `

<input
    type="number"
    class="field-input"
    value="${value ?? ""}"
    onchange="Field.update('${path}', Number(this.value))">

`;

    }

    /*==============================================================
        Checkbox
    ==============================================================*/

    static checkbox(path, value) {

        if (!ViewerV2.editMode) {

            return Badge.yesNo(value);

        }

        return `

<input
    type="checkbox"
    ${value ? "checked" : ""}
    onchange="Field.update('${path}', this.checked)">

`;

    }

    /*==============================================================
        Select
    ==============================================================*/

    static select(path, value, values) {

        if (!ViewerV2.editMode) {

            return MachineUtils.value(value);

        }

        return `

<select
    class="field-input"
    onchange="Field.update('${path}', this.value)">

${values.map(v => `

<option
    value="${v}"
    ${v === value ? "selected" : ""}>

${v}

</option>

`).join("")}

</select>

`;

    }

    /*==============================================================
        Update object
    ==============================================================*/

    static update(path, value) {

        const keys = path.split(".");

        let object = ViewerV2.currentMachine;

        while (keys.length > 1) {

            const key = keys.shift();

            if (!object[key]) {

                object[key] = {};

            }

            object = object[key];

        }

        object[keys[0]] = value;

    }
	
	/*==============================================================
		Textarea
	==============================================================*/

	static textarea(path, value) {

		value ??= "";

		if (!ViewerV2.editMode) {

			return MachineUtils.escape(value)
				.replace(/\n/g, "<br>");

		}

		return `

	<textarea
		class="field-textarea"
		oninput="Field.update('${path}', this.value)">${MachineUtils.escape(value)}</textarea>

	`;

	}

}

