import { uuid } from "./uuid";
import { Dictionary } from "@/types/base";
import { readOnlySanityClient, sanityClient } from "@/instances/sanity";
import { sanityTypes } from "@/constants/roleConstants";
import { QueryableParam, sanityEntity, sanityReference } from "@/types/base";

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

type Freezable<T> = { value: T; freezed?: boolean };

type Condition = { condition: string; reverse: boolean };

type Order = { prop: string; desc: boolean };

class QueryBuilder {
  private _type: string = "";
  private _conditions: Freezable<Condition>[] = [];
  private _params: Freezable<Dictionary<QueryableParam>>[] = [];
  private _select: Freezable<string>[] = [];
  private _orderBy: Freezable<Order>[] = [];
  private _pagination: { page: number; pageSize: number } | null = null;
  private _freezed: boolean = false;
  private _sanityClient = sanityClient;

  constructor(type: string | null = null) {
    this._type = type ?? "";
  }

  public type(type: sanityTypes): QueryBuilder {
    this._type = type;
    return this;
  }

  public where(...builders: ConditionBuilder[]): QueryBuilder {
    for (const builder of builders) {
      if (!builder.isValid()) continue;

      const { condition, params, reverse } = builder.expose();

      this._conditions.push({ value: { condition, reverse } });

      this._params.push({ value: params });
    }
    return this;
  }

  public select(select: string): QueryBuilder {
    this._select.push({ value: select });

    return this;
  }

  public orderBy(...orders: OrderBuilder[]): QueryBuilder {
    for (const order of orders)
      for (const value of order.expose()) this._orderBy.push({ value });

    return this;
  }

  public get(pagination: PaginationBuilder): QueryBuilder {
    this._pagination = pagination.expose();

    return this;
  }

  public expose(): { query: string; params: Dictionary<QueryableParam> } {
    const params = this._params.reduce((x, y) => ({ ...x, ...y.value }), {});

    return { query: this.build(), params };
  }

  public freeze(): Readonly<QueryBuilder> {
    this._freezed = true;
    this.setFreezedProps();

    return this;
  }

  public cached(): Readonly<QueryBuilder> {
    this._sanityClient = readOnlySanityClient;

    return this;
  }
  public fetch<T>(): Promise<T> {
    const params = this._params.reduce((x, y) => ({ ...x, ...y.value }), {});

    const query = this.build();

    return this._sanityClient.fetch<T>(query, params).then((response) => {
      if (this._freezed) this.cleanUnFreezed();
      return response;
    });
  }

  private handlePagination(): string {
    if (!this._pagination) return "";

    const { page, pageSize } = this._pagination;

    if (pageSize === 1) return `[${page - 1}]`;

    return `[${(page - 1) * pageSize}...${page * pageSize}]`;
  }

  private build(): string {
    const conditions = this._conditions
      .map((x) => x.value)
      .map(({ condition, reverse }) => `${reverse ? "!" : ""}(${condition})`)
      .join(" && ");

    const where = `*[_type == '${this._type}' ${
      conditions ? ` && ${conditions}` : ""
    }]`;

    const select = this._select.length
      ? this._select.map((s) => s.value).join(" ,")
      : "...";

    const orderBy = this._orderBy.length
      ? `| ${this._orderBy
          .map((x) => x.value)
          .map(({ prop, desc }) => `order(${prop} ${desc ? "desc" : "asc"})`)
          .join(" | ")}`
      : "";

    const pagination = this.handlePagination();

    return `${where} {${select}} ${orderBy} ${pagination}`.trim();
  }

  private get freezedFields() {
    return [this._conditions, this._params, this._select, this._orderBy];
  }

  private cleanUnFreezed(): void {
    this.freezedFields.forEach(QueryBuilder.filterFreezed);
  }

  private setFreezedProps(): void {
    this.freezedFields.forEach(QueryBuilder.setAsFreezed);
  }

  static filterFreezed(props: Freezable<unknown>[]) {
    props = props.filter((p) => p.freezed);
  }

  static setAsFreezed(props: Freezable<unknown>[]) {
    props.forEach((p) => (p.freezed = true));
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

  isValid(): boolean {
    return !this._optional || ConditionBuilder.check(this._params);
  }

  expose(): {
    condition: string;
    params: Dictionary<QueryableParam>;
    reverse: boolean;
  } {
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

      if (obj instanceof Date && obj) return true;
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