/**
 * components/MachineUtils.js
 * Machine Viewer V2
 * Shared utility functions
 */

class MachineUtils {

    /**
     * Returns true if value is undefined, null or empty.
     */
    static isEmpty(value) {

        return (
            value === undefined ||
            value === null ||
            value === ""
        );

    }

    /**
     * Formats any value for display.
     */
    static value(value, fallback = "—") {

        if (this.isEmpty(value))
            return fallback;

        return value;

    }

    /**
     * Formats a number with a unit.
     */
    static unit(value, unit = "") {

        if (this.isEmpty(value))
            return "—";

        return unit
            ? `${value} ${unit}`
            : value;

    }

    /**
     * Formats an array.
     */
    static list(values, separator = ", ") {

        if (!Array.isArray(values) || values.length === 0)
            return "—";

        return values.join(separator);

    }

    /**
     * Formats an array as HTML tags.
     */
    static tags(values, css = "tag") {

        if (!Array.isArray(values) || values.length === 0)
            return "—";

        return values
            .map(v => `<span class="${css}">${v}</span>`)
            .join("");

    }

    /**
     * Boolean formatter.
     */
    static bool(value) {

        if (value === true)
            return Badge.yesNo(true);

        if (value === false)
            return Badge.yesNo(false);

        return Badge.yesNo(null);

    }

    /**
     * Year formatter.
     */
    static year(value) {

        if (this.isEmpty(value))
            return "—";

        return Number(value);

    }

    /**
     * Installation period.
     */
    static period(start, end) {

        start = this.year(start);

        end = this.isEmpty(end)
            ? "Today"
            : this.year(end);

        return `${start} → ${end}`;

    }

    /**
     * Country display.
     */
    static country(country) {

        if (this.isEmpty(country))
            return "—";

        return country;

    }

    /**
     * Escapes HTML.
     */
    static escape(text) {

        if (this.isEmpty(text))
            return "";

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

    /**
     * Returns a safe image path.
     */
    static image(path) {

        if (this.isEmpty(path))
            return "assets/images/machines/placeholder.webp";

        return path;

    }

    /**
     * Creates an information row.
     */
    static row(label, value) {

        return `

<div class="info-item">

    <div class="info-label">

        ${label}

    </div>

    <div class="info-value">

        ${value}

    </div>

</div>

`;

    }

    /**
     * Creates a section title.
     */
    static section(title) {

        return `

<div class="section-title">

    ${title}

</div>

`;

    }

    /**
     * Capitalizes first letter.
     */
    static capitalize(text) {

        if (this.isEmpty(text))
            return "";

        return text.charAt(0).toUpperCase() + text.slice(1);

    }

}