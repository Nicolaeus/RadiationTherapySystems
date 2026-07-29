/**
 * components/imaging.js
 * Machine Viewer V2
 * Imaging systems
 */

class Imaging {

    static render(machine) {

        const container = document.getElementById("card-imaging");

        if (!container)
            return;

        container.innerHTML = ViewerV2.renderCard(
            "Imaging",
            "📷",
            this.renderContent(machine)
        );

    }

    static renderContent(machine) {

        const imaging = machine.imaging ?? {};

        return `

<div class="imaging-grid">

    ${MachineUtils.row(
        "CBCT",
        Field.checkbox(
            "imaging.cbct",
            imaging.cbct
        )
    )}

    ${MachineUtils.row(
        "kV imaging",
        Field.checkbox(
            "imaging.kv",
            imaging.kv
        )
    )}

    ${MachineUtils.row(
        "MV imaging",
        Field.checkbox(
            "imaging.mv",
            imaging.mv
        )
    )}

    ${MachineUtils.row(
        "Surface guidance",
        Field.checkbox(
            "imaging.surface_guidance",
            imaging.surface_guidance
        )
    )}

</div>

`;

    }

}