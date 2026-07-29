/**
 * components/beam.js
 * Machine Viewer V2
 * Beam characteristics
 */

class Beam {

    static render(machine) {

        const container = document.getElementById("card-beam");

        if (!container)
            return;

        container.innerHTML = ViewerV2.renderCard(
            "Beam",
            "⚡",
            this.renderContent(machine)
        );

    }

    static renderContent(machine) {

        const beam = machine.beam ?? {};

        return `

<div class="beam-grid">

    ${MachineUtils.row(
        "Photon energies",
        Field.text(
            "beam.photon_energies",
            MachineUtils.list(beam.photon_energies)
        )
    )}

    ${MachineUtils.row(
        "Electron energies",
        Field.text(
            "beam.electron_energies",
            MachineUtils.list(beam.electron_energies)
        )
    )}

    ${MachineUtils.row(
        "Standard dose rate (MU/min)",
        Field.number(
            "beam.dose_rate.standard_mu_min",
            beam.dose_rate?.standard_mu_min
        )
    )}

    ${MachineUtils.row(
        "FFF dose rate (MU/min)",
        Field.number(
            "beam.dose_rate.fff_mu_min",
            beam.dose_rate?.fff_mu_min
        )
    )}

    ${MachineUtils.row(
        "FFF",
        Field.checkbox(
            "beam.fff",
            beam.fff
        )
    )}

    ${MachineUtils.row(
        "Flattening filter",
        Field.checkbox(
            "beam.flattening_filter",
            beam.flattening_filter
        )
    )}

</div>

`;

    }

}