# Radiotherapy Equipment Database

> Comprehensive open database of commercial radiotherapy treatment systems.

---

# Overview

The objective of this project is to build the most complete structured database of radiotherapy treatment systems ever commercialized.

The database includes:

- Medical linear accelerators (LINAC)
- MR-LINAC
- Tomotherapy
- Robotic radiotherapy systems
- Proton therapy
- Carbon ion therapy
- IORT systems
- FLASH systems
- Historical treatment systems
- Commercial systems currently in development

The database is intended for:

- Medical physicists
- Hospitals
- Researchers
- Manufacturers
- Regulatory authorities
- Students
- Historical documentation

---

# Project Goals

The database is designed to be:

- human readable
- machine readable
- searchable
- version controlled
- extensible
- easy to maintain

No SQL database is required.

Every manufacturer is stored inside a JSON file.

Git provides the complete history of modifications.

---

# Repository Structure

```
linac_database/

│
├── index.html
├── README.md
│
├── css/
│
├── js/
│
├── api/
│
├── assets/
│
├── schema/
│     accelerators_DataModel.json
│
└── database/

      VARIAN.json
      ELEKTA.json
      ACCURAY.json
      IBA.json
      ...
```

---

# Data Model

Each accelerator is described using a common JSON schema.

Main sections are:

- General information
- Technology
- Beam
- MLC
- Jaws
- Imaging
- Clinical techniques
- Couch
- DICOM
- Production
- Installation dates
- Notes

This guarantees interoperability between all manufacturers.

---

# Supported Technologies

Current supported machine families:

- LINAC
- MR-LINAC
- Tomotherapy
- Robotic LINAC
- Proton Therapy
- Carbon Ion Therapy
- IORT
- FLASH Electron Therapy

Future versions may include:

- BNCT
- VHEE
- Synchrocyclotron
- Cyclotron
- Compact Proton Systems

---

# Viewer

The application provides:

- Dashboard
- Manufacturer browser
- Machine browser
- Advanced search
- Machine comparison
- Full machine viewer
- JSON editor
- Git integration

---

# Dashboard

The dashboard automatically computes:

- Number of manufacturers
- Number of machines
- Number of technologies
- Active products
- Historical products
- Validation status
- Geographic distribution

---

# Search

Search supports:

- manufacturer

- model

- aliases

- technology

- country

- production status

- energy

- techniques

- free text

Search is performed entirely on the client side.

---

# Machine Viewer

Each machine has a dedicated page displaying:

- General information

- Technology

- Beam

- MLC

- Imaging

- Techniques

- Installation period

- Production status

- Notes

---

# Machine Editor

Every field from the DataModel can be edited.

The editor supports:

- text

- numbers

- booleans

- arrays

- nested objects

- validation

Changes can be written back directly to the JSON files.

---

# New Machine

The application can generate a new machine directly from the DataModel.

The user only has to fill the fields.

A valid JSON document is automatically generated.

---

# Comparison

Multiple machines can be compared simultaneously.

Examples:

- TrueBeam vs Versa HD

- Unity vs MRIdian

- CyberKnife vs ZAP-X

- Proteus One vs MEVION S250

---

# Git Integration

The application can interact with a local Git repository.

Available actions:

- Status

- Add

- Commit

- Push

- Pull

Every modification of the database remains fully traceable.

---

# Validation Levels

The following validation states are available.

| Value | Meaning |
|-------|---------|
| confirmed | Commercially confirmed |
| pre-commercial | Under development |
| research | Research only |
| prototype | Prototype |

---

# Production Status

Typical values:

- In Production

- Discontinued

- Prototype

- Research

- Pre-Commercial

---

# Data Sources

Typical sources include:

- Manufacturers

- Scientific publications

- Regulatory agencies

- Product brochures

- Conference proceedings

- Peer-reviewed literature

Each record should be supported by publicly available documentation whenever possible.

---

# Philosophy

The project follows several principles.

- No duplicated information.

- One machine = one JSON object.

- One manufacturer = one JSON file.

- Human-readable data.

- Git as the database history.

- No proprietary dependencies.

- Long-term maintainability.

---

# License

To be defined.

---

# Author

Radiotherapy Equipment Database Project

2026