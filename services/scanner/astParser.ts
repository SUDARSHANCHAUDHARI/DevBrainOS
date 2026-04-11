import ts from "typescript";
import fs from "fs";

export interface ParsedFile {
  filePath: string;
  functions: string[];
  classes: string[];
  imports: string[];
  exports: string[];
  interfaces: string[];
}

export function parseTypeScriptFile(filePath: string): ParsedFile {
  const source = fs.readFileSync(filePath, "utf-8");

  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);

  const result: ParsedFile = {
    filePath,
    functions: [],
    classes: [],
    imports: [],
    exports: [],
    interfaces: [],
  };

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      result.functions.push(node.name.text);
    }

    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
      const parent = node.parent;
      if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
        result.functions.push(parent.name.text);
      }
    }

    if (ts.isClassDeclaration(node) && node.name) {
      result.classes.push(node.name.text);
    }

    if (ts.isInterfaceDeclaration(node) && node.name) {
      result.interfaces.push(node.name.text);
    }

    if (ts.isImportDeclaration(node)) {
      const moduleSpec = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpec)) {
        result.imports.push(moduleSpec.text);
      }
    }

    if (ts.isExportDeclaration(node) || ts.isExportAssignment(node)) {
      result.exports.push("export");
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return result;
}

export function buildFileSummary(parsed: ParsedFile): string {
  const parts: string[] = [`FILE: ${parsed.filePath}`];

  if (parsed.classes.length > 0) parts.push(`Classes: ${parsed.classes.join(", ")}`);
  if (parsed.functions.length > 0) parts.push(`Functions: ${parsed.functions.join(", ")}`);
  if (parsed.interfaces.length > 0) parts.push(`Interfaces: ${parsed.interfaces.join(", ")}`);
  if (parsed.imports.length > 0) parts.push(`Imports: ${parsed.imports.join(", ")}`);

  return parts.join("\n");
}
