#!/usr/bin/env python3
# generate_deps.py
# PureScriptのソースコードからモジュール依存関係のJSONを生成し、標準出力に表示します。

import os
import re
import json
import sys
import argparse

def main():
    parser = argparse.ArgumentParser(description="Generate PureScript module dependency JSON.")
    parser.add_argument(
        "--external", "-e",
        action="store_true",
        help="Include external package dependencies (e.g. Prelude, Data.Maybe) in the output"
    )
    args = parser.parse_args()

    # スクリプト自身の配置場所を基準にsrcディレクトリを探す
    script_dir = os.path.dirname(os.path.abspath(__file__))
    src_dir = os.path.join(script_dir, "src")

    if not os.path.exists(src_dir):
        print(f"Error: 'src' directory not found at {src_dir}", file=sys.stderr)
        sys.exit(1)

    # モジュール名抽出用
    module_pattern = re.compile(r'^module\s+([A-Za-z0-9._]+)')
    # インポート名抽出用
    import_pattern = re.compile(r'^import\s+(?:qualified\s+)?([A-Za-z0-9._]+)')

    modules_data = {}
    all_project_modules = set()

    # 1次スキャン: プロジェクト内モジュールの名前と相対パスを収集
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.purs'):
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, src_dir)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        match = module_pattern.match(line)
                        if match:
                            mod_name = match.group(1)
                            all_project_modules.add(mod_name)
                            modules_data[mod_name] = {
                                "file": os.path.join("src", rel_path),
                                "raw_imports": set()
                            }
                            break

    # 2次スキャン: インポート関係の収集
    for mod_name, data in modules_data.items():
        abs_filepath = os.path.join(os.path.dirname(src_dir), data["file"])
        if os.path.exists(abs_filepath):
            with open(abs_filepath, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    match = import_pattern.match(line)
                    if match:
                        imp_name = match.group(1)
                        if imp_name != mod_name:
                            data["raw_imports"].add(imp_name)

    # 出力用JSONの作成
    final_output = {
        "meta": {
            "project": "prail/purs",
            "description": "Generated module dependencies"
        },
        "modules": {}
    }

    for mod_name, data in sorted(modules_data.items()):
        imports_project = []
        imports_external = []
        
        for imp in sorted(list(data["raw_imports"])):
            if imp in all_project_modules:
                imports_project.append(imp)
            else:
                imports_external.append(imp)
                
        mod_entry = {
            "file": data["file"],
            "imports_project": imports_project
        }
        
        # -e / --external が指定された場合のみ外部依存を含める
        if args.external:
            mod_entry["imports_external"] = imports_external
            
        final_output["modules"][mod_name] = mod_entry

    # 標準出力にJSONを出力
    print(json.dumps(final_output, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
