/*
==============================================================================
Radiotherapy Equipment Database
Viewer

Author : N N
==============================================================================*/

'use strict';

const Viewer = {};

/*==============================================================================
 Populate manufacturers
==============================================================================*/

Viewer.populateManufacturers = function () {

    const container = document.getElementById("manufacturer-list");

    if (!container)
        return;

    container.innerHTML = "";

    Database.getManufacturers().forEach(manufacturer => {

        const item = document.createElement("div");

        item.className = "manufacturer-item";

        item.textContent =
            manufacturer.name +
            " (" +
            manufacturer.machines.length +
            ")";

        item.onclick = () => {

            selectManufacturer(manufacturer.id);

        };

        container.appendChild(item);

    });

};

/*==============================================================================
 Populate machine list
==============================================================================*/

Viewer.populateMachineList = function (

    machines = Database.getMachines()

) {

    const container =
        document.getElementById("machine-list-view");

    if (!container)
        return;

    container.innerHTML = "";

    if (machines.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h2>No machine found</h2>
                <p>The current filters returned no result.</p>
            </div>
        `;

        return;

    }

    const grid = document.createElement("div");

    grid.className = "machine-grid";

    machines.forEach(machine => {

        grid.appendChild(

            this.createMachineCard(machine)

        );

    });

    container.appendChild(grid);

};

/*==============================================================================
 Machine card
==============================================================================*/

Viewer.createMachineCard = function (machine) {

    const card = document.createElement("div");

    card.className = "machine-card";

    card.onclick = () => openMachine(machine.id);

    const photon =
        machine.beam?.photon_energies?.length
            ? machine.beam.photon_energies.join(" / ") + " MV"
            : "-";

    const electron =
        machine.beam?.electron_energies?.length
            ? machine.beam.electron_energies.join(" / ") + " MeV"
            : "-";

    const techniques = Object.entries(machine.techniques ?? {})
        .filter(([_, value]) => value)
        .map(([key]) => key.toUpperCase())
        .join(" • ");

    card.innerHTML = `

    <div class="machine-card-header">

        <div class="machine-model">

            ${machine.model}

        </div>

        <div class="machine-manufacturer">

            ${machine.manufacturer}

        </div>

    </div>

    <div class="machine-card-body">

        ${this.createTechnologyBadges(machine)}

        <div class="machine-info-row">

            <span class="machine-info-label">
                Country
            </span>

            <span class="machine-info-value">
                ${machine.manufacturer_country || "-"}
            </span>

        </div>

        <div class="machine-info-row">

            <span class="machine-info-label">
                Type
            </span>

            <span class="machine-info-value">
                ${machine.machine_type || "-"}
            </span>

        </div>

        <div class="machine-info-row">

            <span class="machine-info-label">
                Photons
            </span>

            <span class="machine-info-value">
                ${photon}
            </span>

        </div>

        <div class="machine-info-row">

            <span class="machine-info-label">
                Electrons
            </span>

            <span class="machine-info-value">
                ${electron}
            </span>

        </div>

        <div class="machine-info-row">

            <span class="machine-info-label">
                MLC
            </span>

            <span class="machine-info-value">
                ${
                    machine.mlc?.model
                        ? machine.mlc.model +
                          (machine.mlc.leaves
                              ? ` (${machine.mlc.leaves})`
                              : "")
                        : "-"
                }
            </span>

        </div>

        <div class="machine-info-row">

            <span class="machine-info-label">
                Production
            </span>

            <span class="machine-info-value">
                ${machine.production_status || "-"}
            </span>

        </div>

        <div class="machine-info-row">

            <span class="machine-info-label">
                Installed
            </span>

            <span class="machine-info-value">
                ${(machine.installation_start ?? "?")}
                -
                ${(machine.installation_end ?? "...")}
            </span>

        </div>

        ${
            techniques
                ? `
        <div class="machine-info-block">

            <div class="machine-info-label">
                Techniques
            </div>

            <div class="machine-techniques">
                ${techniques}
            </div>

        </div>
        `
                : ""
        }

    </div>

    `;

    return card;

};

/*==============================================================================
 Technology badges
==============================================================================*/

Viewer.createTechnologyBadges = function (machine) {

    const badges = [];

    const tech = machine.technology ?? {};

    if (tech.type)
        badges.push(tech.type);

    if (tech.c_arm)
        badges.push("C-ARM");

    if (tech.ring_gantry)
        badges.push("RING");

    if (tech.robotic)
        badges.push("ROBOTIC");

    if (tech.mr_linac)
        badges.push("MR-LINAC");

    if (tech.tomotherapy)
        badges.push("TOMOTHERAPY");

    if (tech.proton)
        badges.push("PROTON");

    if (tech.carbon)
        badges.push("CARBON");

    return `

        <div class="badge-group">

            ${badges.map(label => `

                <span class="badge badge-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">

                    ${label}

                </span>

            `).join("")}

        </div>

    `;

};


/*==============================================================================
 Show machine
==============================================================================*/

const USE_VIEWER_V2 = true;

Viewer.showMachine = function (id) {

    const machine = Database.getMachine(id);

    if (!machine)
        return;

    if (USE_VIEWER_V2) {

        ViewerV2.showMachine(machine);

        return;

    }

    const container =
        document.getElementById("machine-view");

    if (!container)
        return;

    container.innerHTML = `

        <div class="machine-layout">

            <div class="machine-summary">

                ${this.renderSummary(machine)}

            </div>

            <div class="machine-details">

                ${this.renderTechnicalInformation(machine)}

                ${this.renderImaging(machine)}

                ${this.renderBeam(machine)}

                ${this.renderMLC(machine)}

                ${this.renderTechniques(machine)}

                ${this.renderNotes(machine)}

            </div>

        </div>

    `;

};

/*==============================================================================
 Summary
==============================================================================*/

Viewer.renderSummary = function (machine) {

    return `

        <div class="machine-summary-card">

            <div class="machine-title">

                ${machine.model}

            </div>

            <div class="machine-subtitle">

                ${machine.manufacturer}

            </div>

            ${this.createTechnologyBadges(machine)}

        </div>

    `;

};

/*==============================================================================
 Generic section
==============================================================================*/

Viewer.section = function (

    title,

    html

) {

    return `

        <div class="info-card">

            <div class="info-card-title">

                ${title}

            </div>

            <div class="info-card-body">

                ${html}

            </div>

        </div>

    `;

};

/*==============================================================================
 Technical information
==============================================================================*/

Viewer.renderTechnicalInformation = function (machine) {

    return this.section(

        "General",

        this.renderObject(machine.general ?? machine)

    );

};

/*==============================================================================
 Beam
==============================================================================*/

Viewer.renderBeam = function (machine) {

    return this.section(

        "Beam",

        this.renderObject(machine.beam)

    );

};

/*==============================================================================
 Imaging
==============================================================================*/

Viewer.renderImaging = function (machine) {

    return this.section(

        "Imaging",

        this.renderObject(machine.imaging)

    );

};

/*==============================================================================
 MLC
==============================================================================*/

Viewer.renderMLC = function (machine) {

    return this.section(

        "MLC",

        this.renderObject(machine.mlc)

    );

};

/*==============================================================================
 Techniques
==============================================================================*/

Viewer.renderTechniques = function (machine) {

    return this.section(

        "Techniques",

        this.renderObject(machine.techniques)

    );

};

/*==============================================================================
 Status
==============================================================================*/

Viewer.renderStatus = function (key, value) {

    if (value === null)
        return "-";

    return `
        <span class="status-badge status-${value.toLowerCase().replaceAll("_","-")}">
            ${this.pretty(value)}
        </span>
    `;

};

/*==============================================================================
 Notes
==============================================================================*/

Viewer.renderNotes = function (machine) {

    if (!machine.notes)
        return "";

    return this.section(

        "Notes",

        `<div class="notes">${machine.notes}</div>`

    );

};

/*==============================================================================
 Generic object renderer
==============================================================================*/

Viewer.renderObject = function (object) {

    if (!object)
        return "<i>No information</i>";

    let html = '<div class="info-grid">';

    Object.entries(object).forEach(([key, value]) => {

        if (value === undefined)
            return;

        if (typeof value === "object")
            return;

        html += `

            <div class="info-item">

                <div class="info-key">

                    ${this.pretty(key)}

                </div>

                <div class="info-value">

                    ${
                        key.endsWith("_status")
                            ? this.renderStatus(key, value)
                            : this.formatValue(value)
                    }

                </div>

            </div>

        `;

    });

    html += "</div>";

    return html;

};

/*==============================================================================
 Format values
==============================================================================*/

Viewer.formatValue = function (value) {

	if (typeof value === "boolean") {

		return value
			? '<span class="yes">✔ Yes</span>'
			: '<span class="no">✖ No</span>';

	}

    if (Array.isArray(value))
        return value.join(", ");

    return value;

};

/*==============================================================================
 Pretty names
==============================================================================*/

Viewer.pretty = function (text) {

    return text

        .replaceAll("_", " ")

        .replace(/\b\w/g, c => c.toUpperCase());

};

/*==============================================================================
 Filter manufacturer
==============================================================================*/

Viewer.filterManufacturer = function (id) {

    this.populateMachineList(

        Database.byManufacturer(id)

    );

};

/*==============================================================================
 Refresh
==============================================================================*/

Viewer.refresh = function () {

    this.populateManufacturers();

    this.populateMachineList();

};

/*==============================================================================
 End
==============================================================================*/