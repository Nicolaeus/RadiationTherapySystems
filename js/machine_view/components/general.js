/**
 * components/general.js
 * Machine Viewer V2
 * General information card
 */

class General {

    static render(machine) {

        const container = document.getElementById("card-general");

        if (!container)
            return;

        container.innerHTML = ViewerV2.renderCard(
            "General",
            "⚙",
            this.renderGrid(machine)
        );

    }

    static renderGrid(machine) {

        return `

<div class="info-grid">

    ${MachineUtils.row(
        "Manufacturer",
        Field.text(
            "manufacturer",
            machine.manufacturer
        )
    )}

    ${MachineUtils.row(
        "Country",
        Field.text(
            "country",
            machine.country
        )
    )}

    ${MachineUtils.row(
        "Family",
        Field.text(
            "family",
            machine.family
        )
    )}

    ${MachineUtils.row(
        "Series",
        Field.text(
            "series",
            machine.series
        )
    )}

    ${MachineUtils.row(
        "Generation",
        Field.text(
            "generation",
            machine.generation
        )
    )}

    ${MachineUtils.row(
        "Type",
        Field.text(
            "type",
            machine.type
        )
    )}

    ${MachineUtils.row(
        "Validation",
        Field.text(
            "validation",
            machine.validation
        )
    )}

    ${MachineUtils.row(
        "First release",
        Field.number(
            "installation_start",
            machine.installation_start
        )
    )}

</div>

`;

    }

}