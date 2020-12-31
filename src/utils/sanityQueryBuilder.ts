import { nanoid } from "nanoid";
import { Dictionary } from "@/types/base";
import { QueryableParam, sanityEntity, sanityReference } from "@/types/sanity";
import { readOnlySanityClient, sanityClient } from "@/istances/sanity";
import { sanityTypes } from "@/constants/roleConstants";

type QueryModifier<T> = (value: T) => T;

export const contains: QueryModifier<string> = (param: string) => `*${param}*`;

export const startWith: QueryModifier<string> = (param: string) => `*${param}`;

export const endWith: QueryModifier<string> = (param: string) => `${param}*`;

export const modifiers = { contains, startWith, endWith };

export const reference = <T extends sanityEntity>({
  _id,
}: T): sanityReference<T> => ({
  _ref: _id,
});

export const referenceWithKey = ({ _id }: { _id: string }) => ({
  _ref: _id,
  _key: nanoid(),
});

export class QueryBuilder {
  private _type: string = "";
  private _conditions: [string, boolean][] = [];
  private _params: Dictionary<QueryableParam> = {};
  private _select: string[] = [];
  private _orderBy: [string, boolean][] = [];

  constructor(type: sanityTypes | null = null) {
    if (type) this._type = type;
  }

  type(type: sanityTypes): QueryBuilder {
    this._type = type;
    return this;
  }

  where(...builders: ConditionBuilder[]): QueryBuilder {
    for (const builder of builders) {
      if (!builder.isValid()) continue;

      const { condition, params, options } = builder.expose();

      this._conditions.push([condition, options.reverse ?? false]);
      this._params = { ...this._params, ...params };
    }
    return this;
  }

  select(select: string): QueryBuilder {
    this._select.push(select);
    return this;
  }

  orderBy(...orders: OrderBuilder[]): QueryBuilder {
    for (const order of orders) {
      this._orderBy.push(...order.expose());
    }

    return this;
  }

  expose(): { query: string; params: Dictionary<QueryableParam> } {
    return { query: "", params: this._params };
  }
  fetch<T>(useCdn: boolean = true) {
    const client = useCdn ? readOnlySanityClient : sanityClient;

    return client.fetch<T>(this.build(), this._params);
  }

  private build(): string {
    const conditions = this._conditions
      .map(([condition, not]) => `${not ? "!" : ""}(${condition})`)
      .join(" && ");

    const where = `*[_type == '${this._type}' ${
      conditions ? ` && ${conditions}` : ""
    }]`;

    const select = this._select.length ? this._select.join(" ,") : "...";

    const orderBy = this._orderBy.length
      ? `| ${this._orderBy
          .map(([prop, desc]) => `order(${prop} ${desc ? "desc" : "asc"})`)
          .join(" | ")}`
      : "";

    return `${where} {${select}} ${orderBy}`.trim();
  }
}

export class ConditionBuilder {
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

  isValid(): boolean {
    return !this._optional || ConditionBuilder.check(this._params);
  }

  expose(): {
    condition: string;
    params: Dictionary<QueryableParam>;
    options: Partial<{ optional: boolean; reverse: boolean }>;
  } {
    return {
      condition: this._condition,
      params: this._params,
      options: { optional: this._optional, reverse: this._reverse },
    };
  }

  private static check(params: Dictionary<QueryableParam>): boolean {
    for (const prop in params) {
      const obj = params[prop];

      // if is number -> standard check
      if (typeof obj === "number" && obj) return true;

      if (typeof obj === "string" && obj.replace(/[*]/g, "")) return true;

      if (Array.isArray(obj) && obj.length) return true;

      if (obj instanceof Date && obj) return true;
    }

    return false;
  }
}

export class OrderBuilder {
  private _ordes: [string, boolean][] = [];

  constructor(prop: string, desc: boolean = false) {
    this._ordes.push([prop, desc]);
  }

  then(condition: OrderBuilder): OrderBuilder {
    this._ordes = [...this._ordes, ...condition.expose()];

    return this;
  }

  expose(): [string, boolean][] {
    return this._ordes;
  }
}
