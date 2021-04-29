import { uuid } from "@/utils";
import { Dictionary } from "@/types";
import { sanityTypes } from "@/constants";
import { readOnlySanityClient, sanityClient } from "@/instances/sanity";
import { QueryableParam, sanityEntity, sanityReference } from "@/types";

export const contains = (param: string) => `*${param}*`;

export const startWith = (param: string) => `*${param}`;

export const endWith = (param: string) => `${param}*`;

export const reference = <T extends sanityEntity>({
  _id,
}: T): sanityReference<T> => ({ _ref: _id });

export const referenceWithKey = ({ _id }: { _id: string }) => ({
  _ref: _id,
  _key: uuid(),
});

type Condition = { condition: string; reverse: boolean };

type Order = { prop: string; desc: boolean };

class QueryBuilder {
  private _type: string = "";
  private _conditions = new Map<string, Condition>();
  private _params = new Map<string, QueryableParam>();
  private _select = new Set<string>();
  private _orderBy = new Map<string, Order>();
  private _pagination: { page: number; pageSize: number } | null = null;
  private _sanityClient = sanityClient;

  constructor(type: string | null = null) {
    this._type = type ?? "";
  }

  public type(type: sanityTypes): QueryBuilder {
    this._type = type;
    return this;
  }

  public where(builder: ConditionBuilder): QueryBuilder {
    const { condition, params, reverse } = builder.expose();

    if (!builder.isValid()) {
      this._conditions.delete(condition);

      for (const key in params) this._params.delete(key);

      return this;
    }

    this._conditions.set(condition, { condition, reverse });

    for (const param in params) {
      this._params.set(param, params[param]);
    }

    return this;
  }

  public select(value: string): QueryBuilder {
    this._select.add(value);

    return this;
  }

  public orderBy(order: OrderBuilder): QueryBuilder {
    for (const value of order.expose()) this._orderBy.set(value.prop, value);

    return this;
  }

  public get(pagination: PaginationBuilder): QueryBuilder {
    this._pagination = pagination.expose();

    return this;
  }

  public expose(): { query: string; params: Dictionary<QueryableParam> } {
    const params = Object.fromEntries(this._params.entries());

    return { query: this.build(), params };
  }

  public cached(): Readonly<QueryBuilder> {
    this._sanityClient = readOnlySanityClient;

    return this;
  }
  public fetch<T>(): Promise<T> {
    const params = Object.fromEntries(this._params.entries());

    const query = this.build();

    return this._sanityClient.fetch<T>(query, params);
  }

  private handlePagination(): string {
    if (!this._pagination) return "";

    const { page, pageSize } = this._pagination;

    if (pageSize === 1) return `[${page - 1}]`;

    return `[${(page - 1) * pageSize}...${page * pageSize}]`;
  }

  private build(): string {
    const conditions = Array.from(this._conditions.entries())
      .map(([, value]) => value)
      .map(({ condition, reverse }) => `${reverse ? "!" : ""}(${condition})`)
      .join(" && ");

    const where = `*[_type == '${this._type}' ${
      conditions ? ` && ${conditions}` : ""
    }]`;

    const select = this._select.size ? [...this._select].join(" ,") : "...";

    const orderBy = this._orderBy.size
      ? `| ${[...this._orderBy.entries()]
          .map(([, value]) => value)
          .reverse() //fix for groq query
          .map(({ prop, desc }) => ` order(${prop} ${desc ? "desc" : "asc"}) `)
          .join(" | ")}`
      : "";

    const pagination = this.handlePagination();

    return `${where} {${select}} ${orderBy} ${pagination}`.trim();
  }
}

class ConditionBuilder {
  private _condition: string = "";
  private _params: Dictionary<QueryableParam> = {};
  private _optional: boolean = false;
  private _reverse: boolean = false;

  constructor(condition: string) {
    this._condition = condition;
  }

  optional(): ConditionBuilder {
    this._optional = true;

    return this;
  }

  reverse(): ConditionBuilder {
    this._reverse = true;

    return this;
  }

  params(params: Dictionary<QueryableParam>): ConditionBuilder {
    this._params = { ...this._params, ...params };

    return this;
  }

  isValid() {
    return !this._optional || ConditionBuilder.check(this._params);
  }

  expose() {
    return {
      condition: this._condition,
      params: this._params,
      reverse: this._reverse,
    };
  }

  private static check(params: Dictionary<QueryableParam>): boolean {
    for (const prop in params) {
      const obj = params[prop];

      // if is number -> standard check
      if (typeof obj === "number" && obj) return true;

      if (typeof obj === "string" && obj.replace(/[*]/g, "")) return true;

      if (Array.isArray(obj) && obj.length) return true;

      if (obj instanceof Date && obj.getTime()) return true;
    }

    return false;
  }
}

class OrderBuilder {
  private _orders: Order[] = [];

  constructor(prop: string, desc: boolean = false) {
    this._orders.push({ prop, desc });
  }

  then(condition: OrderBuilder): OrderBuilder {
    this._orders = [...this._orders, ...condition.expose()];

    return this;
  }

  expose(): Order[] {
    return this._orders;
  }
}

class PaginationBuilder {
  private _page: number;
  private _pageSize: number;

  constructor(page: number = 0, pageSize: number = 10) {
    this._page = page;
    this._pageSize = pageSize;
  }

  public first(): PaginationBuilder {
    this._page = 1;
    this._pageSize = 1;

    return this;
  }

  public all(): PaginationBuilder {
    this._page = 1;
    this._pageSize = -1;

    return this;
  }

  public next(): PaginationBuilder {
    this._page++;

    return this;
  }

  public shouldContinue(response: unknown[]): boolean {
    return response.length === this._pageSize;
  }

  public resetPage(): PaginationBuilder {
    this._page = 0;
    return this;
  }

  public expose() {
    return { page: this._page, pageSize: this._pageSize };
  }
}

export const groq = {
  QueryBuilder,
  ConditionBuilder,
  OrderBuilder,
  PaginationBuilder,
};

export namespace GroqTypes {
  export class QueryBuilderType extends QueryBuilder {}
}
