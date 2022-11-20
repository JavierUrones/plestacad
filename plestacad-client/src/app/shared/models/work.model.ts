import { WorkCategory } from "./category.enum";
/**
 * Modelo de trabajo académico..
 */
export class Work {
  /**
   * id del trabajo académico
   */
    _id!: string;
    /**
     * título del trabajo académico
     */
    title!: string;
    /**
     * id del autor del trabajo académico
     */
    authorId!: string;
    /**
     * lista de profesores del trabajo académico
     */
    teachers!: string[];
    /**
     * lista de alumnos del trabajo académico
     */
    students!: string[];
    /**
     * categoría del trabajo académico.
     */
    category!: WorkCategory;
    /**
     * curso del trabajo académico
     */
    course!: number;
    /**
     * descripción del trabajo académico
     */
    description!: string;
    /**
     * atributo que indica si el trabajo académico esta clasificado o no
     */
    classified!: boolean;
  }