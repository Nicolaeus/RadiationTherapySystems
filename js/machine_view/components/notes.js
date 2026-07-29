/**
 * components/notes.js
 * Machine Viewer V2
 * Notes
 */

class Notes {

    static render(machine) {

        const container = document.getElementById("card-notes");

        if (!container)
            return;

        container.innerHTML = ViewerV2.renderCard(
            "Notes",
            "📝",
            this.renderContent(machine)
        );

    }

    static renderContent(machine) {

        return `

<div class="notes-container">

    <div class="notes-section">

        <div class="notes-title">

            Notes

        </div>

        <div class="notes-text">

            ${Field.textarea(
                "notes",
                machine.notes
            )}

        </div>

    </div>

</div>

`;

    }

}