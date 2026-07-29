/**
 * components/techniques.js
 * Machine Viewer V2
 * Treatment techniques
 */

class Techniques {

    static render(machine) {

        const container = document.getElementById("card-techniques");

        if (!container)
            return;

        container.innerHTML = ViewerV2.renderCard(
            "Techniques",
            "🎯",
            this.renderContent(machine)
        );

    }

    static renderContent(machine) {

        const tech = machine.techniques ?? {};

        const techniques = [

            ["IGRT",      "igrt"],
            ["IMRT",      "imrt"],
            ["VMAT",      "vmat"],

            ["SRS",       "srs"],
            ["SRT",       "srt"],
            ["SBRT",      "sbrt"],

            ["Adaptive",  "adaptive"],
            ["Gating",    "gating"],
            ["Tracking",  "tracking"]

        ];

        if (!ViewerV2.editMode) {

            return `

<div class="techniques-grid">

    ${techniques
        .map(([label, key]) =>
            this.badge(label, tech[key]))
        .join("")}

</div>

`;

        }

        return `

<div class="techniques-edit-grid">

    ${techniques
        .map(([label, key]) => `

<label class="technique-checkbox">

    ${Field.checkbox(
        `techniques.${key}`,
        tech[key]
    )}

    <span>${label}</span>

</label>

`)
        .join("")}

</div>

`;

    }

    static badge(label, enabled) {

        let css = "technique-disabled";

        if (enabled === true)
            css = "technique-enabled";

        else if (enabled === null || enabled === undefined)
            css = "technique-unknown";

        return `

<div class="technique-badge ${css}">

    ${label}

</div>

`;

    }

}