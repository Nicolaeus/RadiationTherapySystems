/*
==============================================================================
Radiotherapy Equipment Database
Git Manager

Handles:
- version information
- import/export
- changelog
- backup
- restore
==============================================================================*/

'use strict';

const Git = {

    version: null,

    history: [],

    modified: false

};

/*==============================================================================
 Load version
==============================================================================*/

Git.load = async function () {

    try {

        const response = await fetch("database/version.json");

        if (!response.ok)
            return;

        this.version = await response.json();

        this.updateHeader();

    }
    catch (e) {

        console.warn("version.json not found.");

    }

};

/*==============================================================================
 Header
==============================================================================*/

Git.updateHeader = function () {

    const element = document.getElementById(
        "database-version"
    );

    if (!element)
        return;

    if (!this.version) {

        element.textContent = "Database";

        return;

    }

    element.textContent =
        "Database " +
        this.version.version +
        " • " +
        this.version.date;

};

/*==============================================================================
 Modified
==============================================================================*/

Git.markModified = function () {

    this.modified = true;

    updateStatus("Unsaved changes");

};

/*==============================================================================
 Saved
==============================================================================*/

Git.markSaved = function () {

    this.modified = false;

    updateStatus("Ready");

};

/*==============================================================================
 Create backup
==============================================================================*/

Git.backup = function () {

    const filename =

        "backup_" +

        new Date()

            .toISOString()

            .replaceAll(":", "-") +

        ".json";

    const blob = new Blob(

        [

            Database.exportJSON()

        ],

        {

            type: "application/json"

        }

    );

    this.download(blob, filename);

};

/*==============================================================================
 Restore
==============================================================================*/

Git.restore = function () {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = ".json";

    input.onchange = async e => {

        const file =

            e.target.files[0];

        if (!file)
            return;

        const text =

            await file.text();

        Database.database =

            JSON.parse(text);

        Database.buildIndexes();

        Dashboard.refresh();

        Viewer.refresh();

        this.markSaved();

    };

    input.click();

};

/*==============================================================================
 Export
==============================================================================*/

Git.exportDatabase = function () {

    const blob = new Blob(

        [

            Database.exportJSON()

        ],

        {

            type: "application/json"

        }

    );

    this.download(

        blob,

        "database.json"

    );

};

/*==============================================================================
 Import
==============================================================================*/

Git.importDatabase = function () {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = ".json";

    input.onchange = async event => {

        const file =

            event.target.files[0];

        if (!file)
            return;

        const text =

            await file.text();

        Database.database =

            JSON.parse(text);

        Database.buildIndexes();

        Dashboard.refresh();

        Viewer.refresh();

        this.markModified();

    };

    input.click();

};

/*==============================================================================
 Changelog
==============================================================================*/

Git.addHistory = function (

    action,

    details = ""

) {

    this.history.push({

        date: new Date(),

        action,

        details

    });

};

/*==============================================================================
 History
==============================================================================*/

Git.showHistory = function () {

    console.table(this.history);

};

/*==============================================================================
 Version
==============================================================================*/

Git.bumpVersion = function (

    major = false

) {

    if (!this.version)
        return;

    const parts =

        this.version.version

            .split(".")

            .map(Number);

    if (major) {

        parts[0]++;

        parts[1] = 0;

        parts[2] = 0;

    }
    else {

        parts[2]++;

    }

    this.version.version =

        parts.join(".");

    this.version.date =

        new Date()

            .toISOString()

            .substring(0,10);

    this.updateHeader();

};

/*==============================================================================
 Download helper
==============================================================================*/

Git.download = function (

    blob,

    filename

) {

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
 Before unload
==============================================================================*/

window.addEventListener(

    "beforeunload",

    event => {

        if (!Git.modified)
            return;

        event.preventDefault();

        event.returnValue = "";

    }

);

/*==============================================================================
 Initialize
==============================================================================*/

Git.init = async function () {

    await this.load();

};

/*==============================================================================
 End
==============================================================================*/