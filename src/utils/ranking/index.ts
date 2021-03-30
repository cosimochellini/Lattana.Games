import { trumpMatchPlayer } from "@/types";

type DataSet = {
  label: string;
  backgroundColor: string;
  data: number[];
};

type DataSetBinder<T> = {
  label: string;
  dataBinder: (item: T) => number;
  backgroundColor?: string;
};

export class Ranking<T extends Object> {
  public items: T[];

  constructor(items: T[]) {
    this.items = items;
  }

  public groupBy<TGroup>(func: (item: T) => TGroup): GroupedRanking<T, TGroup> {
    return new GroupedRanking<T, TGroup>(this.items, func);
  }
}

export class GroupedRanking<T extends Object, TGroup extends Object> {
  private _items: T[];
  private _groupByFn: (item: T) => TGroup;

  private _orderByFn: (
    item1: { key: TGroup; items: number[] },
    item2: { key: TGroup; items: number[] }
  ) => number = () => 0;

  private _labelBinder: (TKey: TGroup) => string = (i) => i.toString();

  private _backgroundBinder: (item: string) => string = () => "";

  private _datasetsBinder: DataSetBinder<T[]>[] = [];

  private _itemsMap!: Map<TGroup, T[]>;

  private _dataset!: DataSet[];

  private _sortedItems!: { items: number[]; key: TGroup }[];
  private _i18nProvider: ((item: string) => string) | undefined;

  constructor(items: T[], func: (item: T) => TGroup) {
    this._items = items;
    this._groupByFn = func;
  }

  public label(func: (TKey: TGroup) => string): GroupedRanking<T, TGroup> {
    this._labelBinder = func;
    return this;
  }

  public dataset(
    label: string,
    binder: (item: T[]) => number,
    backgroundColor?: string
  ): GroupedRanking<T, TGroup> {
    this._datasetsBinder.push({
      label,
      dataBinder: binder,
      backgroundColor,
    });

    return this;
  }

  public useBackgroundBinder(
    parser: (item: string) => string
  ): GroupedRanking<T, TGroup> {
    this._backgroundBinder = parser;

    return this;
  }

  public useI18n(
    i18nProvider: (item: string) => string
  ): GroupedRanking<T, TGroup> {
    this._i18nProvider = i18nProvider;

    return this;
  }

  public orderBy(
    orderFn: (
      item1: { key: TGroup; items: number[] },
      item2: { key: TGroup; items: number[] }
    ) => number
  ): GroupedRanking<T, TGroup> {
    this._orderByFn = orderFn;
    return this;
  }

  public get keys() {
    if (!this._itemsMap) this.loadItemsMap();
    return [...this._itemsMap.keys()];
  }

  public get labels(): string[] {
    if (!this._dataset) this.loadDataset();

    return this._sortedItems.map((x) => this._labelBinder(x.key));
  }

  public get datasets(): DataSet[] {
    if (!this._dataset) this.loadDataset();

    return this._dataset;
  }

  private loadDataset() {
    if (!this._itemsMap) this.loadItemsMap();

    this._sortedItems = [...this._itemsMap.entries()]
      .map(([key1, items1]) => ({
        items: this._datasetsBinder.map((d) => d.dataBinder(items1)),
        key: key1,
      }))
      .sort((it1, it2) => this._orderByFn(it1, it2));

    this._dataset = this._datasetsBinder.map((d, index) => {
      return {
        label: this._i18nProvider?.(d.label) ?? d.label,
        data: this._sortedItems.map(({ items }) => items[index]),
        backgroundColor: d.backgroundColor ?? this._backgroundBinder(d.label),
      } as DataSet;
    });
  }

  private loadItemsMap() {
    const uniqueKeys = new Set(this._items.map(this._groupByFn));

    this._itemsMap = new Map(
      [...uniqueKeys].map((key) => [
        key,
        this._items.filter((i) => this._groupByFn(i) === key),
      ])
    );
  }
}
