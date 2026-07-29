/**
 * components/badge.js
 * Machine Viewer V2
 * Generic badge component
 */

class Badge {

    static render(label, type = "default") {

        return `<span class="badge badge-${type}">
            ${label}
        </span>`;

    }

    static yesNo(value) {

        if (value === true)
            return this.render("Yes", "success");

        if (value === false)
            return this.render("No", "danger");

        return this.render("Unknown", "unknown");

    }

    static status(status) {

        switch ((status ?? "").toLowerCase()) {

            case "production":

            case "in production":
                return this.render("In Production", "production");

            case "discontinued":
                return this.render("Discontinued", "danger");

            case "obsolete":
                return this.render("Obsolete", "danger");

            case "prototype":
                return this.render("Prototype", "warning");

            case "research":
                return this.render("Research", "info");

            default:
                return this.render(status || "Unknown", "unknown");

        }

    }

    static support(status) {

        switch ((status ?? "").toLowerCase()) {

            case "full support":
                return this.render("Full Support", "support");

            case "limited support":
                return this.render("Limited Support", "warning");

            case "end of support":
                return this.render("End of Support", "danger");

            case "legacy support":
                return this.render("Legacy Support", "secondary");

            default:
                return this.render(status || "Unknown", "unknown");

        }

    }

    static technique(label, enabled) {

        if (enabled === true)
            return this.render(label, "technique");

        if (enabled === false)
            return this.render(label, "disabled");

        return this.render(label, "unknown");

    }

    static tag(label) {

        return this.render(label, "tag");

    }

    static energy(value, unit = "MV") {

        return this.render(`${value} ${unit}`, "energy");

    }

    static country(country) {

        return this.render(country, "country");

    }

    static validation(level) {

        return this.render(level, "validation");

    }

    static manufacturer(name) {

        return this.render(name, "manufacturer");

    }

}