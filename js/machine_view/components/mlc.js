/**
 * components/mlc.js
 * Machine Viewer V2
 * Multi Leaf Collimator
 */

class MLC {

    static render(machine) {

        const container = document.getElementById("card-mlc");

        if (!container)
            return;

        container.innerHTML = ViewerV2.renderCard(
            "MLC",
            "🧬",
            this.renderContent(machine)
        );

    }

    static renderContent(machine) {

        const mlc = machine.mlc ?? {};

        return `

<div class="mlc-grid">

    ${MachineUtils.row(
        "Model",
        Field.text(
            "mlc.model",
            mlc.model
        )
    )}

    ${MachineUtils.row(
        "Leaves",
        Field.number(
            "mlc.leaves",
            mlc.leaves
        )
    )}

    ${MachineUtils.row(
        "Leaf width (mm)",
        Field.number(
            "mlc.leaf_width_mm",
            mlc.leaf_width_mm
        )
    )}

    ${MachineUtils.row(
        "Optional",
        Field.checkbox(
            "mlc.optional",
            mlc.optional
        )
    )}

</div>

`;

    }

}