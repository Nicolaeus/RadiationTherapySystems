/**
 * components/summary.js
 * Machine Viewer V2
 * Summary panel
 */

class Summary
{

    /*==============================================================
        Render
    ==============================================================*/

    static render(machine)
    {

        const container =
            document.getElementById(
                "machine-summary-v2"
            );

        if (!container)
            return;

        container.innerHTML = `

<div class="summary-card">

    ${this.renderPhoto(machine)}

    ${this.renderIdentity(machine)}

    ${this.renderTechnology(machine)}

    ${this.renderGeneral(machine)}

    ${this.renderStatus(machine)}

    ${this.renderTimeline(machine)}

    ${this.renderSuccessor(machine)}

</div>

`;

    }

    /*==============================================================
        Photo
    ==============================================================*/

    static renderPhoto(machine)
    {

        const image =
            `assets/images/machines/${machine.id}.webp?t=${Date.now()}`;

        return `

<div class="summary-photo">

    <img
        src="${image}"
        alt="${machine.model}"
        loading="lazy"
        onerror="this.onerror=null;this.src='assets/images/machines/placeholder.webp';">

</div>

${
    ViewerV2.editMode
        ? `

<div class="summary-photo-actions">

    <button
        class="photo-edit-button"
        onclick="document.getElementById('machine-photo-input').click()">

        📷 Changer la photo

    </button>

    <input
        id="machine-photo-input"
        type="file"
        accept="image/*"
        style="display:none"
        onchange="Summary.changePhoto(event)">

</div>

`
        : ""
}

`;

    }

    /*==============================================================
        Identity
    ==============================================================*/
	
	    static renderIdentity(machine)
    {

        return `

<div class="summary-identity">

    <h1 class="machine-name">

        ${Field.text(
            "model",
            machine.model
        )}

    </h1>

    <div class="machine-manufacturer">

        ${Field.text(
            "manufacturer",
            machine.manufacturer
        )}

    </div>

    <div class="machine-country">

        ${Field.text(
            "manufacturer_country",
            machine.manufacturer_country
        )}

    </div>

</div>

`;

    }

    /*==============================================================
        Technology badges
    ==============================================================*/

    static renderTechnology(machine)
    {

        const tech =
            machine.technology ?? {};

        let html = "";

        if (tech.type)
            html += `<span class="summary-badge">${tech.type}</span>`;

        if (tech.c_arm)
            html += `<span class="summary-badge">C-ARM</span>`;

        if (tech.ring_gantry)
            html += `<span class="summary-badge">RING</span>`;

        if (tech.robotic)
            html += `<span class="summary-badge">ROBOTIC</span>`;

        if (tech.mr_linac)
            html += `<span class="summary-badge">MR-LINAC</span>`;

        if (tech.tomotherapy)
            html += `<span class="summary-badge">TOMOTHERAPY</span>`;

        if (tech.proton)
            html += `<span class="summary-badge">PROTON</span>`;

        if (tech.carbon)
            html += `<span class="summary-badge">CARBON</span>`;

        return `

<div class="summary-badges">

    ${html}

</div>

`;

    }

    /*==============================================================
        General
    ==============================================================*/

    static renderGeneral(machine)
    {

        return `

<div class="summary-section">

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
        "Machine type",
        Field.text(
            "machine_type",
            machine.machine_type
        )
    )}

    ${MachineUtils.row(
        "Validation",
        Field.text(
            "validation",
            machine.validation
        )
    )}

</div>

`;

    }

    /*==============================================================
        Status
    ==============================================================*/
	
	    static renderStatus(machine)
    {

        return `

<div class="summary-section">

    ${MachineUtils.row(
        "Production",
        Field.text(
            "production_status",
            machine.production_status
        )
    )}

    ${MachineUtils.row(
        "Support",
        Field.text(
            "support_status",
            machine.support_status
        )
    )}

</div>

`;

    }

    /*==============================================================
        Timeline
    ==============================================================*/

    static renderTimeline(machine)
    {

        return `

<div class="summary-section">

    ${MachineUtils.row(
        "Installation start",
        Field.number(
            "installation_start",
            machine.installation_start
        )
    )}

    ${MachineUtils.row(
        "Installation end",
        Field.number(
            "installation_end",
            machine.installation_end
        )
    )}

</div>

`;

    }

    /*==============================================================
        Successor
    ==============================================================*/

    static renderSuccessor(machine)
    {

        return `

<div class="summary-section">

    ${MachineUtils.row(
        "Successor",
        Field.text(
            "successor",
            machine.successor
        )
    )}

</div>

`;

    }

    /*==============================================================
        Photo upload
    ==============================================================*/
	
	    static async changePhoto(event)
    {

        const file =
            event.target.files[0];

        if (!file)
        {
            return;
        }

        const formData = new FormData();

        formData.append(
            "machine_id",
            ViewerV2.currentMachine.id
        );

        formData.append(
            "photo",
            file
        );

        try
        {

            const response =
                await fetch(
                    "api/upload_machine_photo.php",
                    {
                        method: "POST",
                        body: formData
                    }
                );

            if (!response.ok)
            {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const text = await response.text();

			console.log("=== Réponse du serveur ===");
			console.log(text);

			const result = JSON.parse(text);

            if (!result.success)
            {
                alert(
                    result.message ??
                    "Upload failed."
                );

                return;
            }

            const image =
                document.querySelector(
                    ".summary-photo img"
                );

            if (image)
            {
                image.src =
                    result.url +
                    "?t=" +
                    Date.now();
            }

            event.target.value = "";

        }
        catch (error)
        {

            console.error(error);

            alert(
                "Unable to upload the image."
            );

        }

    }

}