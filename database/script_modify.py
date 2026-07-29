#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from pathlib import Path

# Le dossier contenant ce script
DATABASE_DIR = Path(__file__).parent


def update_model(model):
    """Ajoute support_status juste après production_status."""
    if not isinstance(model, dict):
        return False

    # Déjà migré
    if "support_status" in model:
        return False

    # On ne touche qu'aux modèles
    if "production_status" not in model:
        return False

    new_model = {}

    for key, value in model.items():
        new_model[key] = value

        if key == "production_status":
            new_model["support_status"] = None

    model.clear()
    model.update(new_model)

    return True


def process_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        modified = False

        if isinstance(data, list):
            for model in data:
                if update_model(model):
                    modified = True

        elif isinstance(data, dict):
            if update_model(data):
                modified = True

        if modified:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
                f.write("\n")

            print(f"✔ {filepath.name}")

    except Exception as e:
        print(f"✖ {filepath.name} : {e}")


def main():
    json_files = sorted(DATABASE_DIR.glob("*.json"))

    print(f"{len(json_files)} fichier(s) trouvé(s).\n")

    for file in json_files:
        # On ignore l'index et les sauvegardes éventuelles
        if file.name == "index.json":
            continue

        if file.suffix.lower() != ".json":
            continue

        process_file(file)

    print("\nMigration terminée.")


if __name__ == "__main__":
    main()