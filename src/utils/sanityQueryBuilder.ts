import { Dictionary } from "@/types/base";
import { sanityClient } from "@/istances/sanity";
import { sanityTypes } from "@/constants/roleConstants";
import { QueryableParam, sanityEntity, sanityReference } from "@/types/base";
import { uuid } from "./uuid";

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

export class QueryBuilder {
  private _type: string = "";
  private _conditions: Freezable<Condition>[] = [];
  private _params: Freezable<Dictionary<QueryableParam>>[] = [];
  private _select: Freezable<string>[] = [];
  private _orderBy: Freezable<Order>[] = [];
  private _pagination: { page: number; pageSize: number } | null = null;
  private _freezed: boolean = false;

  constructor(type: sanityTypes | null = null) {
    if (type) this._type = type;
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

  public fetch<T>(useCdn: boolean = true) {
    const client = useCdn ? sanityClient : sanityClient;

    const params = this._params.reduce((x, y) => ({ ...x, ...y.value }), {});

    const query = this.build();

    if (this._freezed) this.cleanUnfreezed();

    return client.fetch<T>(query, params);
  }

  private handlePagination(): string {
    if (!this._pagination) return "";

    const { page, pageSize } = this._pagination;

    if (pageSize === 1) return `[${page - 1}]`;

    return `$[{(page - 1) * pageSize}...${page * pageSize}]`;
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

  private cleanUnfreezed(): void {
    QueryBuilder.filterFreezed(this._conditions);
    QueryBuilder.filterFreezed(this._params);
    QueryBuilder.filterFreezed(this._select);
    QueryBuilder.filterFreezed(this._orderBy);
  }

  private setFreezedProps(): void {
    QueryBuilder.setAsFreezed(this._conditions);
    QueryBuilder.setAsFreezed(this._params);
    QueryBuilder.setAsFreezed(this._select);
    QueryBuilder.setAsFreezed(this._orderBy);
  }

  static filterFreezed(props: Freezable<any>[]) {
    props = props.filter((p) => p.freezed);
  }

  static setAsFreezed(props: Freezable<any>[]) {
    props.forEach((p) => (p.freezed = true));
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

export class OrderBuilder {
  private _ordes: Order[] = [];

  constructor(prop: string, desc: boolean = false) {
    this._ordes.push({ prop, desc });
  }

  then(condition: OrderBuilder): OrderBuilder {
    this._ordes = [...this._ordes, ...condition.expose()];

    return this;
  }

  expose(): Order[] {
    return this._ordes;
  }
}

export class PaginationBuilder {
  private _page: number;
  private _pageSize: number;

  constructor(page: number = 1, pageSize: number = 10) {
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

  public expose() {
    return { page: this._page, pageSize: this._pageSize };
  }
}
