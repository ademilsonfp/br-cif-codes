/**
 * Este arquivo é parte do programa BR-CIF-Codes
 * 
 * BR-CIF-Codes é um software livre; você pode redistribuí-lo e/ou
 * modificá-lo dentro dos termos da Licença Pública Geral Menor GNU como
 * publicada pela Free Software Foundation (FSF); na versão 3 da
 * Licença, ou (a seu critério) qualquer versão posterior.
 * 
 * Este programa é distribuído na esperança de que possa ser útil,
 * mas SEM NENHUMA GARANTIA; sem uma garantia implícita de ADEQUAÇÃO
 * a qualquer MERCADO ou APLICAÇÃO EM PARTICULAR. Veja a
 * Licença Pública Geral Menor GNU para maiores detalhes.
 * 
 * Você deve ter recebido uma cópia da Licença Pública Geral Menor GNU junto
 * com este programa, Se não, veja <http://www.gnu.org/licenses/lgpl-3.0.html>.
 */

import { writeFile, readFile } from 'fs/promises';
import { Command } from 'commander';

import {
  Config as SchemaConfig,
  createGenerator as schemaGenerator
} from 'ts-json-schema-generator';

import yaml from 'yaml';

import {
  Cif,
  CifComponent,
  CifChapter,
  CifChapterGroup,
  CifGroup,
  CifCategory
} from './schema';

const program = new Command();

program.name('build-script')
  .description('CLI para construir JSON Schemas e códigos em TypeScript');

program.command('schema')
  .action(buildSchema);

program.command('codes')
  .action(buildCodes);

program.parseAsync(process.argv)
  .catch(console.error);

async function buildSchema() {
  const type = 'CifDefinition';
  const path = 'ts/schema.ts';
  const tsconfig = 'tsconfig.json';
  const output = 'cif-schema.json';
  const config: SchemaConfig = { type, path, tsconfig };
  const schema = schemaGenerator(config).createSchema(type);
  const json = JSON.stringify(schema, null, 2);

  await writeFile(output, json, 'utf8');
}

async function buildCodes() {
  const cif: Cif = yaml.parse(await readFile('src/cif.yml', 'utf8'));
  
  type Group = CifChapter | CifChapterGroup | CifGroup;
  type Node = Group | CifCategory;

  const codes: Record<string, CifComponent | Node> = {};
  const components: string[] = [];
  const chapters: string[] = [];
  const groups: string[] = [];
  const categories: string[] = [];
  const subcategories: string[] = [];

  for (let pcode in cif) {
    let part = cif[pcode as keyof typeof cif];

    for (let ccode in part) {
      let { means, title, definitions, qualifiers, chapters } = part[ccode];

      codes[ccode] = { means, title, definitions, qualifiers };
      components.push(ccode);

      for (let hcode in chapters) {
        await add(hcode, chapters[hcode]);
      }
    }
  }

  const src = [
    '/** Códigos de componentes da CIF */\n' +
    `function components() { return [${
      components.map(c => `'${c}' as const`).join(', ')
    }]; }`,
    '/** Códigos de capítulos da CIF */\n' +
    `function chapters() { return [${
      chapters.map(c => `'${c}' as const`).join(', ')
    }]; }`,
    '/** Códigos de agrupamentos da CIF */\n' +
    `function groups() { return [${
      groups.map(c => `'${c}' as const`).join(', ')
    }]; }`,
    '/** Códigos de categorias da CIF que possuem subcategorias */\n' +
    `function categories() { return [${
      categories.map(c => `'${c}' as const`).join(', ')
    }]; }`,
    '/** Códigos de categorias da CIF que não possuem subcategorias */\n' +
    `function subcategories() { return [${
      subcategories.map(c => `'${c}' as const`).join(', ')
    }]; }`,
    [
      '/** Códigos da CIF */\n' +
      'function codes() {',
      '  const codes = {',
      Object.keys(codes)
        .map(c =>
          '    /**\n' +
          [codes[c].title]
            .concat((codes[c] as CifComponent).definitions
              ? (codes[c] as CifComponent).definitions.map(d => d.trim())
              : []
            )
            .concat((codes[c] as CifCategory).description
              ? [(codes[c] as CifCategory).description!.trim()]
              : []
            )
            .concat((codes[c] as CifCategory).includes
              ? [(codes[c] as CifCategory).includes!.trim()]
              : []
            )
            .concat((codes[c] as CifCategory).excludes
              ? [(codes[c] as CifCategory).excludes!.trim()]
              : []
            )
            .map(l => `     * ${l}`)
            .join('\n     *\n') + '\n' +
          '     */\n' +
          `    get ${c.includes('-') ? `'${c}'` : c}() ` +
          `{ return ${JSON.stringify(codes[c])}; }`
        )
        .join(',\n\n'),
      '  };',
      '  Object.defineProperties(codes, { ' +
      Object.keys(codes)
        .map(c => `${c.includes('-') ? `'${c}'` : c}: { enumerable: true }`)
        .join(', ') + ' });',
      '  return codes;',
      '};'
    ].join('\n'),
    'export default { components, chapters, groups, categories, subcategories, codes };'
  ].join('\n\n') + '\n';

  await writeFile('ts/index.ts', src, 'utf8');

  async function add<T extends Node>(code: string, node: T) {
    const obj = {} as T;
    Object.assign(obj, node);
    delete (obj as Group).groups;
    codes[code] = obj;

    const ischapter = code.length === 2;
    const isgroup = code.includes('-');

    if (ischapter) {
      chapters.push(code);
    }

    if (isgroup) {
      groups.push(code);
    }

    let
      grps = (node as Group).groups as CifGroup['groups'],
      include = (node as Group).groups as string;

    if (grps) {
      if (!ischapter && !isgroup) {
        categories.push(code);
      }

      if (typeof grps === 'string') {
        grps = yaml.parse(await readFile(`src/${include.slice(7)}`, 'utf8'));
      }

      for (code in grps) {
        await add(code, grps[code]);
      }
    } else if (!ischapter && !isgroup) {
      subcategories.push(code);
    }
  }
}
