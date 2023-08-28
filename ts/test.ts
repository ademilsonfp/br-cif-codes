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

import { readFile, realpath } from 'fs/promises';
import { Command } from 'commander';

import yaml from 'yaml';
import Ajv from 'ajv';

import {
  Cif,
  CifChapter,
  CifChapterGroup,
  CifGroup,
  CifCategory
} from './schema';

const program = new Command();

program.name('test-script')
  .description('CLI para testar as definições a partir do arquivo src/cif.yml')
  .action(test);

program.parseAsync(process.argv)
  .catch(console.error);

async function test() {
  const path = await realpath('src/cif.yml');
  const cif: Cif = yaml.parse(await readFile(path, 'utf8'));
  const schema = JSON.parse(await readFile('cif-schema.json', 'utf8'));
  const ajv = new Ajv();

  if (!ajv.validate(schema, cif)) {
    console.error(path);
    throw new Error(ajv.errorsText(ajv.errors));
  }

  type Group = CifChapter | CifChapterGroup | CifGroup;
  type Node = Group | CifCategory;

  for (let pcode in cif) {
    let part = cif[pcode as keyof typeof cif];

    for (let ccode in part) {
      let { chapters } = part[ccode];

      for (let hcode in chapters) {
        await walk(hcode, chapters[hcode]);
      }
    }
  }

  async function walk<T extends Node>(code: string, node: T) {
    let
      ajv: Ajv,
      path: string,
      grps = (node as Group).groups as CifGroup['groups'],
      include = (node as Group).groups as string;

    if (grps) {
      if (typeof grps === 'string') {
        path = await realpath(`src/${include.slice(7)}`);
        grps = yaml.parse(await readFile(path, 'utf8'));
        ajv = new Ajv();

        if (!ajv.validate(schema, grps)) {
          console.error(path);
          throw new Error(ajv.errorsText(ajv.errors));
        }
      }

      for (code in grps) {
        await walk(code, grps[code]);
      }
    }
  }
}
