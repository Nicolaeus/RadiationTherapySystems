/**
 * viewer_v2.js
 * Machine Viewer V2
 */

class ViewerV2 {

    /*==============================================================
        State
    ==============================================================*/

    static editMode = false;

    static currentMachine = null;

    static originalMachine = null;

    /*==============================================================
        Show machine
    ==============================================================*/

    static showMachine(machine) {

        if (!machine)
            return;

        // Nouvelle machine sélectionnée
        if (
            this.currentMachine === null ||
            this.currentMachine.id !== machine.id
        ) {

            this.currentMachine = structuredClone(machine);
            this.originalMachine = structuredClone(machine);
            this.editMode = false;

        }

        const container = document.getElementById("machine-view");

        if (!container) {

            console.error("Machine viewer not found.");

            return;

        }

        container.innerHTML = this.renderLayout();

        // Rendu des composants
        Summary.render(this.currentMachine);
        General.render(this.currentMachine);
        Beam.render(this.currentMachine);
        Imaging.render(this.currentMachine);
        MLC.render(this.currentMachine);
        Techniques.render(this.currentMachine);
        Notes.render(this.currentMachine);

        this.updateButtons();

    }

    /*==============================================================
        Layout
    ==============================================================*/

    static renderLayout() {

        return `

<div class="machine-layout-v2">

    <aside
        class="machine-summary-v2"
        id="machine-summary-v2">
    </aside>

    <main class="machine-content-v2">

        <section id="card-general"></section>

        <section id="card-beam"></section>

        <section id="card-imaging"></section>

        <section id="card-mlc"></section>

        <section id="card-techniques"></section>

        <section id="card-notes"></section>

    </main>

    <div class="viewer-actions">

        <button
            id="btn-edit"
            class="btn btn-primary"
            onclick="ViewerV2.toggleEdit()">

            ✏ Modifier

        </button>

        <button
            id="btn-save"
            class="btn btn-success"
            onclick="ViewerV2.save()">

            💾 Enregistrer

        </button>

        <button
            id="btn-cancel"
            class="btn btn-secondary"
            onclick="ViewerV2.cancel()">

            ✖ Annuler

        </button>

    </div>

</div>

`;

    }

    /*==============================================================
        Card helper
    ==============================================================*/

    static renderCard(title, icon, content) {

        return `

<div class="info-card-v2">

    <div class="info-card-header">

        <span class="card-icon">${icon}</span>

        <span class="card-title">${title}</span>

    </div>

    <div class="info-card-body">

        ${content}

    </div>

</div>

`;

    }

    /*==============================================================
        Buttons
    ==============================================================*/

    static updateButtons() {

        document.getElementById("btn-edit").style.display =
            this.editMode ? "none" : "";

        document.getElementById("btn-save").style.display =
            this.editMode ? "" : "none";

        document.getElementById("btn-cancel").style.display =
            this.editMode ? "" : "none";

    }

    /*==============================================================
        Edit mode
    ==============================================================*/

    static toggleEdit() {

        this.editMode = true;

        this.showMachine(this.currentMachine);

    }

    /*==============================================================
        Cancel
    ==============================================================*/

    static cancel() {

        this.currentMachine =
            structuredClone(this.originalMachine);

        this.editMode = false;

        this.showMachine(this.currentMachine);

    }

    /*==============================================================
        Save
    ==============================================================*/

    static save() {

        // La sauvegarde API viendra à l'étape 5

        this.originalMachine =
            structuredClone(this.currentMachine);

        this.editMode = false;

        this.showMachine(this.currentMachine);

    }

}