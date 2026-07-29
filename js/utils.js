/*
==============================================================================
Radiotherapy Equipment Database
Utilities

Author : N N
==============================================================================*/

'use strict';

const Utils = {};

/*==============================================================================
 UUID
==============================================================================*/

Utils.uuid = function () {

    return crypto.randomUUID();

};

/*==============================================================================
 Deep clone
==============================================================================*/

Utils.clone = function (object) {

    return structuredClone(object);

};

/*==============================================================================
 Deep merge
==============================================================================*/

Utils.merge = function (target, source) {

    Object.keys(source).forEach(key => {

        if (

            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key])

        ) {

            target[key] ??= {};

            Utils.merge(

                target[key],

                source[key]

            );

        }
        else {

            target[key] = source[key];

        }

    });

    return target;

};

/*==============================================================================
 Deep equality
==============================================================================*/

Utils.equals = function (a, b) {

    return JSON.stringify(a) === JSON.stringify(b);

};

/*==============================================================================
 Empty
==============================================================================*/

Utils.isEmpty = function (value) {

    return (

        value === undefined ||

        value === null ||

        value === ""

    );

};

/*==============================================================================
 Number
==============================================================================*/

Utils.toNumber = function (value) {

    if (

        value === "" ||

        value === null ||

        value === undefined

    )

        return null;

    const number = Number(value);

    return Number.isNaN(number)

        ? null

        : number;

};

/*==============================================================================
 Boolean
==============================================================================*/

Utils.toBoolean = function (value) {

    if (

        value === true ||

        value === "true" ||

        value === 1 ||

        value === "1"

    )

        return true;

    return false;

};

/*==============================================================================
 Capitalize
==============================================================================*/

Utils.capitalize = function (text = "") {

    if (!text.length)
        return "";

    return text.charAt(0).toUpperCase()

        + text.slice(1);

};

/*==============================================================================
 Pretty label
==============================================================================*/

Utils.pretty = function (text = "") {

    return text

        .replaceAll("_", " ")

        .replaceAll(".", " / ")

        .replace(/\b\w/g, c => c.toUpperCase());

};

/*==============================================================================
 Slug
==============================================================================*/

Utils.slug = function (text = "") {

    return text

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .replace(/[^a-z0-9]+/g, "-")

        .replace(/^-|-$/g, "");

};

/*==============================================================================
 Date
==============================================================================*/

Utils.today = function () {

    return new Date()

        .toISOString()

        .substring(0, 10);

};

/*==============================================================================
 Format date
==============================================================================*/

Utils.formatDate = function (date) {

    if (!date)
        return "";

    return new Date(date)

        .toLocaleDateString();

};

/*==============================================================================
 Download
==============================================================================*/

Utils.download = function (

    filename,

    content,

    mime = "text/plain"

) {

    const blob = new Blob(

        [content],

        {

            type: mime

        }

    );

    const url =

        URL.createObjectURL(blob);

    const a =

        document.createElement("a");

    a.href = url;

    a.download = filename;

    a.click();

    URL.revokeObjectURL(url);

};

/*==============================================================================
 JSON
==============================================================================*/

Utils.downloadJSON = function (

    filename,

    object

) {

    Utils.download(

        filename,

        JSON.stringify(

            object,

            null,

            4

        ),

        "application/json"

    );

};

/*==============================================================================
 CSV
==============================================================================*/

Utils.downloadCSV = function (

    filename,

    rows

) {

    const csv = rows

        .map(

            row =>

                row

                    .map(value => `"${value}"`)

                    .join(";")

        )

        .join("\n");

    Utils.download(

        filename,

        csv,

        "text/csv"

    );

};

/*==============================================================================
 Clipboard
==============================================================================*/

Utils.copy = async function (text) {

    await navigator.clipboard.writeText(text);

};

/*==============================================================================
 Debounce
==============================================================================*/

Utils.debounce = function (

    callback,

    delay = 300

) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(

            () => callback(...args),

            delay

        );

    };

};

/*==============================================================================
 DOM
==============================================================================*/

Utils.id = function (id) {

    return document.getElementById(id);

};

Utils.qs = function (selector) {

    return document.querySelector(selector);

};

Utils.qsa = function (selector) {

    return [

        ...document.querySelectorAll(selector)

    ];

};

/*==============================================================================
 Visibility
==============================================================================*/

Utils.show = function (element) {

    if (typeof element === "string")

        element = Utils.id(element);

    if (element)

        element.style.display = "";

};

Utils.hide = function (element) {

    if (typeof element === "string")

        element = Utils.id(element);

    if (element)

        element.style.display = "none";

};

Utils.toggle = function (element) {

    if (typeof element === "string")

        element = Utils.id(element);

    if (!element)
        return;

    element.style.display =

        element.style.display === "none"

            ? ""

            : "none";

};

/*==============================================================================
 Badge helper
==============================================================================*/

Utils.badge = function (

    label,

    css

) {

    return `

        <span class="badge ${css}">

            ${label}

        </span>

    `;

};

/*==============================================================================
 HTML escape
==============================================================================*/

Utils.escapeHTML = function (text = "") {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

};

/*==============================================================================
 Object path
==============================================================================*/

Utils.get = function (

    object,

    path,

    defaultValue = undefined

) {

    return path

        .split(".")

        .reduce(

            (o, key) => o?.[key],

            object

        ) ?? defaultValue;

};

Utils.set = function (

    object,

    path,

    value

) {

    const keys = path.split(".");

    let current = object;

    while (keys.length > 1) {

        const key = keys.shift();

        current[key] ??= {};

        current = current[key];

    }

    current[keys[0]] = value;

};

/*==============================================================================
 Group
==============================================================================*/

Utils.groupBy = function (

    array,

    key

) {

    return array.reduce(

        (groups, item) => {

            const value =

                typeof key === "function"

                    ? key(item)

                    : item[key];

            groups[value] ??= [];

            groups[value].push(item);

            return groups;

        },

        {}

    );

};

/*==============================================================================
 Unique
==============================================================================*/

Utils.unique = function (

    array

) {

    return [...new Set(array)];

};

/*==============================================================================
 Sort
==============================================================================*/

Utils.sortBy = function (

    array,

    field,

    ascending = true

) {

    return [...array].sort(

        (a, b) => {

            const av = Utils.get(a, field);

            const bv = Utils.get(b, field);

            if (av == null) return 1;

            if (bv == null) return -1;

            if (typeof av === "number") {

                return ascending

                    ? av - bv

                    : bv - av;

            }

            return ascending

                ? av.toString().localeCompare(bv)

                : bv.toString().localeCompare(av);

        }

    );

};

/*==============================================================================
 End
==============================================================================*/