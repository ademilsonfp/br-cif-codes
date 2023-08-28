# BR-CIF-Codes

Cópia de códigos da CIF (OMS) em formato reutilizável (YAML)

Referência: [CIF &ndash; Classificação Internacional de Funcionalidade, Incapacidade e Saúde &mdash; 1&ordf; edição 2003]

Além das definições da CIF, este projeto contém também um módulo para Node.js.

## Utilização (Node.js)

Esse módulo pode ser obtido via NPM:

```bash
npm i br-cif-codes
```

Conteúdo do módulo:

- `function components() string[]` &mdash; obtém códigos dos componentes da CIF:
  `['b', 's', 'd', 'e']`;

- `function chapters(): string[]` &mdash; obtém códigos do capítulos da CIF;
- `function groups(): string[]` &mdash; obtém códigos dos agrupamentos da CIF;

- `function categories(): string[]` &mdash; obtém códigos dos capítulos da CIF
  que possuem subcategorias;

- `function subcategories(): string[]` &mdash; obtém códigos dos capítulos da
  CIF que não possuem subcategorias; e

- `function codes(): { [code: string]: { title: string, ...} }` &mdash; obtém o
  mapa com todos os códigos e definições da CIF disponíveis no projeto.

## Direitos de cópia da CIF

Copyright © 2001 by Organização Mundial da Saúde, Genebra, Suíça

Título do original em inglês:

*ICF: International Classification of Functioning, Disability and Health*

Direitos em língua portuguesa reservados ao Centro Colaborador da OMS para a
Família de Classificações Internacionais em Português (Centro Brasileiro de
Classificação de Doenças) – Faculdade de Saúde Pública da Universidade de São
Paulo/Organização Mundial da Saúde/Organização Pan-americana da Saúde.

## Licença

Este arquivo é parte do programa BR-CIF-Codes

BR-CIF-Codes é um software livre; você pode redistribuí-lo e/ou
modificá-lo dentro dos termos da Licença Pública Geral Menor GNU como
publicada pela Free Software Foundation (FSF); na versão 3 da
Licença, ou (a seu critério) qualquer versão posterior.

Este programa é distribuído na esperança de que possa ser útil,
mas SEM NENHUMA GARANTIA; sem uma garantia implícita de ADEQUAÇÃO
a qualquer MERCADO ou APLICAÇÃO EM PARTICULAR. Veja a
Licença Pública Geral Menor GNU para maiores detalhes.

Você deve ter recebido uma cópia da Licença Pública Geral Menor GNU junto
com este programa, Se não, veja <http://www.gnu.org/licenses/lgpl-3.0.html>.

[CIF &ndash; Classificação Internacional de Funcionalidade, Incapacidade e Saúde &mdash; 1&ordf; edição 2003]: https://apps.who.int/iris/bitstream/handle/10665/42407/9788531407840_por.pdf?sequence=111&isAllowed=y
