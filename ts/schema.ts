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

/**
 * Regra genérica para digítos qualificadores
 *
 * @pattern ^\d$
 */
export type CifDigit = string;

/**
 * Regra genérica para código de componente da CIF (b, s, d, e)
 *
 * @pattern ^[bsde]$
 */
export type CifComponentCode = string;

/**
 * Regra genérica para código de capítulo da CIF (prefixo + dígito)
 *
 * @pattern ^[bsde]\d$
 */
export type CifChapterCode = string;

/**
 * Regra genérica para os códigos de agrupamentos da CIF (com suporte a
 * intervalo)
 *
 * @pattern ^[bsde]\d{3}(:?-[bsde]\d{3})?$
 */
export type CifGroupCode = string;

/**
 * Regra genérica para os demais códigos da CIF (composto pelo prefixo do
 * componente, seguido de três dígitos ou mais)
 *
 * @pattern ^[bsde]\d{3,}$
 */
export type CifCode = string;

/**
 * Regra genérica para inclusão de definições de outro arquivo YAML
 *
 * @pattern ^file://.+\.yml$
 */
export type CifPath = string;

/**
 * Definição comum dos blocos da CIF
 */
export type CifMinimalDefinition = {
  /**
   * Título da definição
   */
  title: string,

  /**
   * Descrição da definição
   */
  description?: string
};

/**
 * Definição de categoria da CIF
 */
export type CifCategory = CifMinimalDefinition & {
  /**
   * Termos de inclusão da definição de categoria
   */
  includes?: string,

  /**
   * Termos de exclusão da definição de categoria
   */
  excludes?: string
};

/**
 * Definição de grupo da CIF
 */
export type CifGroup = CifCategory & {
  /**
   * Códigos e subcategorias da definição de categoria
   */
  groups: Record<CifCode, CifCategory | CifGroup>;
};

/**
 * Definição de grupo de primeiro nível da CIF
 */
export type CifChapterGroup = CifMinimalDefinition & {
  /**
   * Definição de códigos e subcategorias da categoria ou caminho de arquivo com
   * as definições YAML para inclusão
   */
  groups?: CifPath | Record<CifCode, CifCategory | CifGroup>;
};

/**
 * Definição de capítulo da CIF
 */
export type CifChapter = CifMinimalDefinition & {
  /**
   * Definição de códigos, agrupamentos e categorias do capítulo ou caminho de
   * arquivo com as definições YAML para inclusão
   */
  groups: CifPath | Record<CifGroupCode, CifChapterGroup>;
};

/**
 * Definição genérica de valor de qualificador da CIF
 */
export type CifQualifierValue = CifMinimalDefinition & {
  /**
   * Valor da definição
   */
  value?: string;
};

/**
 * Definição genérica de qualificador da CIF
 */
export type CifQualifier = CifMinimalDefinition & (
  {
    /**
     * Qualificador negativo com prefixo `.`
     */
    negative: Record<CifDigit, CifQualifierValue>,

    /**
     * Qualificador positivo com prefixo `+`
     */
    positive?: Record<CifDigit, CifQualifierValue>
  } |
  {
    /**
     * Qualificador de natureza da deficiência
     */
    nature?: Record<CifDigit, string>
  } |
  {
    /**
     * Qualificador de localização da deficiência
     */
    location?: Record<CifDigit, string>
  }
);

/**
 * Definição genérica de componente da CIF (primeiro nível das partes 1 e 2)
 */
export type CifComponent = {
  /**
   * Significado do código da definição
   */
  means: 'body' | 'structure' | 'domain' | 'environment',

  /**
   * Título da definição
   */
  title: string,

  /**
   * Definições do componente
   */
  definitions: string[],

  /**
   * Qualificadores da definição
   */
  qualifiers: CifQualifier[],

  /**
   * Definições de códigos e capítulos do componente
   */
  chapters: Record<CifChapterCode, CifChapter>
};

/**
 * Definição de índice da CIF com parte 1 e 2
 */
export type Cif = {
  /**
   * Definições de códigos e componentes da parte 1 da CIF
   */
  part1: Record<CifComponentCode, CifComponent>,

  /**
   * Definições de códigos e componentes da parte 2 da CIF
   */
  part2: Record<CifComponentCode, CifComponent>
};

/**
 * Definições de códigos e categorias da CIF
 */
export type CifGroups = CifPath | Record<CifCode, CifCategory | CifGroup>;

/**
 * Tipo auxiliar para arquivo de definições da CIF
 */
export type CifDefinition = Cif | CifGroups;
